import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
    publishToFacebookPage,
    publishToInstagram,
    publishToInstagramWithProcessing,
} from "@/lib/publish-service";
import { parseSpintax } from "@/lib/spintax";

/**
 * Cron Job Handler for Publishing Scheduled Posts
 * 
 * Enhanced with retry logic and detailed error tracking.
 * 
 * Features:
 * - Smart error classification (fatal vs temporary)
 * - Automatic retry for temporary errors (max 3 attempts)
 * - Detailed platform response logging
 * - Spintax content variation
 */

const MAX_RETRIES = 3;

/**
 * Classify error type to determine retry strategy
 */
function classifyError(error: string): "fatal" | "temporary" {
    const errorLower = error.toLowerCase();

    // Fatal errors - don't retry
    const fatalPatterns = [
        "oauth",
        "authentication expired",
        "token",
        "permission",
        "invalid credentials",
        "account not found",
        "business account",
        "invalid app",
    ];

    for (const pattern of fatalPatterns) {
        if (errorLower.includes(pattern)) {
            return "fatal";
        }
    }

    // Temporary errors - retry
    const temporaryPatterns = [
        "timeout",
        "network",
        "500",
        "502",
        "503",
        "504",
        "connection",
        "temporary",
        "rate limit",
        "try again",
    ];

    for (const pattern of temporaryPatterns) {
        if (errorLower.includes(pattern)) {
            return "temporary";
        }
    }

    // Default to temporary (safer to retry unknown errors)
    return "temporary";
}

/**
 * POST /api/cron/publish
 * 
 * Automated job that publishes scheduled posts at their scheduled time.
 * 
 * IMPORTANT NOTES:
 * - Vercel Cron runs in UTC timezone
 * - Our database stores scheduled_at in UTC (via localToUTC conversion)
 * - Query uses NOW() which returns UTC on Supabase
 * - Times are converted to WIB only for display/logging
 * - This ensures timezone-accurate scheduling regardless of server location
 * 
 * Security:
 * - Vercel Cron automatically sends Authorization: Bearer <CRON_SECRET>
 * - We validate this header to prevent unauthorized external access
 * 
 * Schedule: Every 10 minutes (configured in vercel.json)
 */
export async function GET(request: Request) {
    const startTime = Date.now();

    try {
        // Step 1: Verify Authorization header (Vercel Cron sends this automatically)
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (!cronSecret) {
            console.error("CRON_SECRET is not configured");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Vercel Cron sends: "Authorization: Bearer <CRON_SECRET>"
        const expectedAuth = `Bearer ${cronSecret}`;

        if (authHeader !== expectedAuth) {
            console.error("Unauthorized cron access attempt");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const supabase = await createClient();

        try {
            // Step 2: Fetch queued posts
            const now = new Date().toISOString();

            const { data: dueSchedulesData, error: fetchError } = await supabase
                .from("post_schedules")
                .select(
                    `
        id,
        post_id,
        account_id,
        scheduled_at,
        retry_count,
        posts (
          id,
          id,
          caption,
          image_url,
          website_id,
          user_id
        ),
        accounts (
          id,
          platform,
          account_id,
          access_token
        )
      `
                )
                .eq("status", "QUEUED")
                .lte("scheduled_at", now)
                .limit(50);

            const dueSchedules = dueSchedulesData as any[];

            if (fetchError) {
                console.error("Error fetching due schedules:", fetchError);
                return NextResponse.json(
                    { error: "Failed to fetch schedules", details: fetchError.message },
                    { status: 500 }
                );
            }

            if (!dueSchedules || dueSchedules.length === 0) {
                return NextResponse.json({
                    processed: 0,
                    success: 0,
                    failed: 0,
                    retrying: 0,
                    message: "No posts due for publishing",
                    executionTime: Date.now() - startTime,
                });
            }

            // Step 3: Process each post
            const results = {
                processed: 0,
                success: 0,
                failed: 0,
                retrying: 0,
                details: [] as Array<{
                    scheduleId: string;
                    platform: string;
                    status: "success" | "failed" | "retrying";
                    postId?: string;
                    error?: string;
                    retryCount?: number;
                }>,
            };

            for (const schedule of dueSchedules) {
                results.processed++;

                try {
                    // Validate data
                    if (!schedule.posts || !schedule.accounts) {
                        throw new Error("Missing post or account data");
                    }

                    const post = Array.isArray(schedule.posts)
                        ? schedule.posts[0]
                        : schedule.posts;
                    const account = Array.isArray(schedule.accounts)
                        ? schedule.accounts[0]
                        : schedule.accounts;

                    if (!post || !account) {
                        throw new Error("Invalid post or account data");
                    }

                    // Parse spintax for unique variation
                    const uniqueCaption = parseSpintax(post.caption);

                    console.log(`Publishing to ${account.platform}:`, {
                        scheduleId: schedule.id,
                        retryCount: schedule.retry_count || 0,
                    });

                    // Publish to platform
                    let publishResult;

                    if (account.platform === "facebook") {
                        publishResult = await publishToFacebookPage(
                            account.access_token,
                            account.account_id,
                            uniqueCaption,
                            post.image_url || undefined
                        );
                    } else if (account.platform === "instagram") {
                        if (!post.image_url) {
                            throw new Error("Instagram requires an image");
                        }
                        publishResult = await publishToInstagramWithProcessing(
                            account.access_token,
                            account.account_id,
                            uniqueCaption,
                            post.image_url,
                            supabase,
                            post.user_id,
                            post.website_id
                        );
                    } else {
                        throw new Error(`Unsupported platform: ${account.platform}`);
                    }

                    // Handle success
                    if (publishResult.success) {
                        await supabase
                            .from("post_schedules")
                            .update({
                                status: "PUBLISHED",
                                platform_post_id: publishResult.postId,
                                published_at: new Date().toISOString(),
                                platform_response: { success: true, postId: publishResult.postId },
                                updated_at: new Date().toISOString(),
                            } as any)
                            .eq("id", schedule.id);

                        results.success++;
                        results.details.push({
                            scheduleId: schedule.id,
                            platform: account.platform,
                            status: "success",
                            postId: publishResult.postId,
                        });
                    } else {
                        throw new Error(publishResult.error || "Unknown error");
                    }
                } catch (error) {
                    // Handle failure with retry logic
                    const errorMessage =
                        error instanceof Error ? error.message : "Unknown error";
                    const errorType = classifyError(errorMessage);
                    const currentRetryCount = schedule.retry_count || 0;

                    console.error(
                        `Error publishing schedule ${schedule.id}:`,
                        errorMessage,
                        `(${errorType}, retry: ${currentRetryCount}/${MAX_RETRIES})`
                    );

                    if (errorType === "fatal" || currentRetryCount >= MAX_RETRIES) {
                        // Mark as FAILED
                        await supabase
                            .from("post_schedules")
                            .update({
                                status: "FAILED",
                                error_log: errorMessage,
                                platform_response: {
                                    error: errorMessage,
                                    errorType,
                                    finalRetryCount: currentRetryCount,
                                },
                                updated_at: new Date().toISOString(),
                            } as any)
                            .eq("id", schedule.id);

                        results.failed++;
                        results.details.push({
                            scheduleId: schedule.id,
                            platform: schedule.accounts?.platform || "unknown",
                            status: "failed",
                            error: errorMessage,
                            retryCount: currentRetryCount,
                        });
                    } else {
                        // Increment retry, keep as QUEUED
                        await supabase
                            .from("post_schedules")
                            .update({
                                retry_count: currentRetryCount + 1,
                                error_log: `Retry ${currentRetryCount + 1}/${MAX_RETRIES}: ${errorMessage}`,
                                platform_response: {
                                    error: errorMessage,
                                    errorType,
                                    retryCount: currentRetryCount + 1,
                                },
                                updated_at: new Date().toISOString(),
                            } as any)
                            .eq("id", schedule.id);

                        results.retrying++;
                        results.details.push({
                            scheduleId: schedule.id,
                            platform: schedule.accounts?.platform || "unknown",
                            status: "retrying",
                            error: errorMessage,
                            retryCount: currentRetryCount + 1,
                        });
                    }
                }
            }

            // Step 4: Content Recycler (Auto-fill gaps)
            // Only run if we didn't just process a bunch of posts (to avoid overload)
            const gapThresholdHours = 12; // Updated to 12 hours as requested
            const gapThresholdDate = new Date(Date.now() + gapThresholdHours * 60 * 60 * 1000).toISOString();

            // Check for upcoming posts in the next 6 hours (globally for MVP)
            const { count: upcomingCount, error: countError } = await supabase
                .from("post_schedules")
                .select("*", { count: "exact", head: true })
                .eq("status", "QUEUED")
                .lte("scheduled_at", gapThresholdDate)
                .gt("scheduled_at", now); // Only future posts

            if (!countError && upcomingCount === 0) {
                console.log("Gap detected in schedule. Checking for evergreen content...");

                // Fetch random evergreen post
                // Since we can't easily do ORDER BY RANDOM() in standard Postgrest JS client without RPC,
                // we'll fetch a batch of IDs and pick one in JS.
                const { data: evergreenPostsData, error: evergreenError } = await supabase
                    .from("posts")
                    .select("id, user_id, website_id")
                    .eq("is_evergreen", true)
                    .limit(20); // Fetch a small pool to pick from

                const evergreenPosts = evergreenPostsData as any[];

                if (!evergreenError && evergreenPosts && evergreenPosts.length > 0) {
                    const randomPost = evergreenPosts[Math.floor(Math.random() * evergreenPosts.length)];

                    // Found a candidate! Now schedule it for immediate publication (on next run or now? "scheduled_at = NOW()" implies immediate)
                    // We need to pick an account. Let's find a valid account for this user/website.
                    // Prioritize accounts linked to the post's website, or fallback to user's first account.
                    // Since schema links accounts to users, let's just pick the first valid account for the user.

                    const { data: accountsData } = await supabase
                        .from("accounts")
                        .select("id")
                        .eq("user_id", randomPost.user_id)
                        .eq("is_active", true)
                        .limit(1);

                    const accounts = accountsData as any[];

                    if (accounts && accounts.length > 0) {
                        const targetAccount = accounts[0];

                        // Schedule it NOW
                        const { error: recycleError } = await supabase
                            .from("post_schedules")
                            .insert({
                                user_id: randomPost.user_id,
                                post_id: randomPost.id,
                                account_id: targetAccount.id,
                                scheduled_at: new Date().toISOString(),
                                status: "QUEUED",
                                error_log: "Auto-Recycled Content ♻️", // Tag it for visibility
                            } as any);

                        if (!recycleError) {
                            console.log(`Auto-recycled post ${randomPost.id} for account ${targetAccount.id}`);
                            results.details.push({
                                scheduleId: "recycle-job",
                                platform: "recycler",
                                status: "success", // Not strictly 'success' in publishing, but successfully scheduled
                                error: "Auto-Recycled Content Scheduled",
                            });
                        } else {
                            console.error("Failed to schedule recycled post:", recycleError);
                        }
                    } else {
                        console.log("Evergreen post found but no active accounts to schedule to.");
                    }
                } else {
                    console.log("No evergreen content available to recycle.");
                }
            } else if (countError) {
                console.error("Error checking schedule gap:", countError);
            } else {
                console.log(`Schedule healthy: ${upcomingCount} posts in next ${gapThresholdHours}h.`);
            }

            // Return summary
            return NextResponse.json({
                ...results,
                executionTime: Date.now() - startTime,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Cron job error:", error);
            return NextResponse.json(
                {
                    error: "Cron job failed",
                    details: error instanceof Error ? error.message : "Unknown error",
                    executionTime: Date.now() - startTime,
                },
                { status: 500 }
            );
        }
    } catch (outerError) {
        console.error("Fatal cron error:", outerError);
        return NextResponse.json(
            { error: "Fatal server error" },
            { status: 500 }
        );
    }
}
