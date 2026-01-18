"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
    publishToFacebookPage,
    publishToInstagram,
} from "@/lib/publish-service";
import { parseSpintax } from "@/lib/spintax";

/**
 * Manually trigger a scheduled post to publish immediately
 */
export async function publishNow(scheduleId: string) {
    const supabase = await createClient();

    try {
        // Get the schedule with related data
        const { data: schedule, error: fetchError } = await supabase
            .from("post_schedules")
            .select(
                `
        id,
        status,
        posts (
          caption,
          image_url
        ),
        accounts (
          platform,
          account_id,
          access_token
        )
      `
            )
            .eq("id", scheduleId)
            .single();

        if (fetchError || !schedule) {
            return { error: "Schedule not found" };
        }

        if (schedule.status !== "QUEUED") {
            return { error: "Post is not queued for publishing" };
        }

        const post = Array.isArray(schedule.posts)
            ? schedule.posts[0]
            : schedule.posts;
        const account = Array.isArray(schedule.accounts)
            ? schedule.accounts[0]
            : schedule.accounts;

        if (!post || !account) {
            return { error: "Invalid post or account data" };
        }

        // Parse spintax caption
        const caption = parseSpintax(post.caption);

        // Publish based on platform
        let publishResult;

        if (account.platform === "facebook") {
            publishResult = await publishToFacebookPage(
                account.access_token,
                account.account_id,
                caption,
                post.image_url || undefined
            );
        } else if (account.platform === "instagram") {
            if (!post.image_url) {
                return { error: "Instagram requires an image" };
            }
            publishResult = await publishToInstagram(
                account.access_token,
                account.account_id,
                caption,
                post.image_url
            );
        } else {
            return { error: `Unsupported platform: ${account.platform}` };
        }

        // Update schedule based on result
        if (publishResult.success) {
            await supabase
                .from("post_schedules")
                .update({
                    status: "PUBLISHED",
                    platform_post_id: publishResult.postId,
                    published_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq("id", scheduleId);

            revalidatePath("/dashboard");
            return { success: true, message: "Post published successfully!" };
        } else {
            await supabase
                .from("post_schedules")
                .update({
                    status: "FAILED",
                    error_log: publishResult.error || "Unknown error",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", scheduleId);

            revalidatePath("/dashboard");
            return { error: publishResult.error || "Failed to publish" };
        }
    } catch (error) {
        console.error("Publish now error:", error);
        return {
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
