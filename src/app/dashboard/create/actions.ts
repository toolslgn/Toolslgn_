"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { parseSpintax } from "@/lib/spintax";

interface SchedulePostInput {
    websiteIds: string[]; // Changed from single websiteId to array
    caption: string;
    imageFile?: File;

    scheduledDate: Date;
    accountIds: string[];
    isEvergreen?: boolean;
}

/**
 * Schedule a post to multiple websites at once (Bulk Clone)
 * 
 * Creates unique posts for each website with spintax variations
 * to avoid duplicate content penalties.
 */
export async function schedulePost(input: SchedulePostInput) {
    const { websiteIds, caption, imageFile, scheduledDate, accountIds, isEvergreen } = input;

    try {
        const supabase = await createClient();

        // Get authenticated user
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { error: "Not authenticated" };
        }

        // Validate input
        if (websiteIds.length === 0) {
            return { error: "Please select at least one website" };
        }

        if (!caption || caption.trim().length === 0) {
            return { error: "Caption is required" };
        }

        if (accountIds.length === 0) {
            return { error: "Please select at least one account" };
        }

        // Upload image if provided
        let imageUrl: string | undefined;

        if (imageFile) {
            const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("post-images")
                .upload(fileName, imageFile, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) {
                return { error: `Image upload failed: ${uploadError.message}` };
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from("post-images").getPublicUrl(fileName);

            imageUrl = publicUrl;
        }

        // Start transaction-like bulk insert
        const createdSchedules: string[] = [];
        const errors: string[] = [];

        // Loop through each website
        for (const websiteId of websiteIds) {
            try {
                // Generate unique caption variation using spintax
                const uniqueCaption = parseSpintax(caption);

                // Create post for this website
                const { data: post, error: postError } = await supabase
                    .from("posts")
                    .insert({
                        user_id: user.id,
                        website_id: websiteId,
                        caption: uniqueCaption, // Unique variation per website
                        image_url: imageUrl,
                        is_evergreen: isEvergreen || false,
                    } as any)
                    .select()
                    .single();

                if (postError) {
                    throw new Error(`Failed to create post: ${postError.message}`);
                }

                // Create schedule entries for each selected account
                for (const accountId of accountIds) {
                    const { error: scheduleError } = await supabase
                        .from("post_schedules")
                        .insert({
                            user_id: user.id,
                            post_id: post.id,
                            account_id: accountId,
                            scheduled_at: scheduledDate.toISOString(),
                            status: "QUEUED",
                        } as any);

                    if (scheduleError) {
                        throw new Error(
                            `Failed to schedule post: ${scheduleError.message}`
                        );
                    }

                    createdSchedules.push(post.id);
                }
            } catch (websiteError) {
                // Log error but continue with other websites
                const errorMsg =
                    websiteError instanceof Error
                        ? websiteError.message
                        : "Unknown error";
                errors.push(`Website ${websiteId}: ${errorMsg}`);
                console.error(`Error processing website ${websiteId}:`, websiteError);
            }
        }

        // Revalidate paths
        revalidatePath("/dashboard/calendar");
        revalidatePath("/dashboard");

        // Return results
        if (createdSchedules.length === 0) {
            return {
                error: `All posts failed to schedule. Errors: ${errors.join("; ")}`,
            };
        }

        if (errors.length > 0) {
            return {
                success: true,
                message: `Scheduled ${createdSchedules.length} post(s) across ${websiteIds.length - errors.length} website(s). ${errors.length} failed.`,
                warnings: errors,
            };
        }

        return {
            success: true,
            message: `Successfully scheduled ${createdSchedules.length} post(s) across ${websiteIds.length} website(s)!`,
        };
    } catch (error) {
        console.error("Schedule post error:", error);
        return {
            error:
                error instanceof Error ? error.message : "Failed to schedule posts",
        };
    }
}
