import { processAndUploadForInstagram } from "./image-processor";

const GRAPH_API_VERSION = "v19.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

interface PublishResult {
    success: boolean;
    postId?: string;
    error?: string;
}

interface InstagramContainerResult {
    id: string; // creation_id
}

/**
 * Publish a photo post to a Facebook Page
 * 
 * @param accessToken - Page access token
 * @param pageId - Facebook Page ID
 * @param caption - Post caption/message
 * @param imageUrl - Public URL of the image to post
 * @returns Result with post ID or error
 */
export async function publishToFacebookPage(
    accessToken: string,
    pageId: string,
    caption: string,
    imageUrl?: string
): Promise<PublishResult> {
    try {
        const endpoint = `${GRAPH_API_BASE}/${pageId}/${imageUrl ? 'photos' : 'feed'}`;

        const body: any = {
            access_token: accessToken,
            published: true,
        };

        if (imageUrl) {
            // Photo post
            body.url = imageUrl;
            body.caption = caption;
        } else {
            // Text-only post
            body.message = caption;
        }

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                error.error?.message || `Facebook API error: ${response.statusText}`
            );
        }

        const data = await response.json();

        return {
            success: true,
            postId: data.id || data.post_id,
        };
    } catch (error) {
        console.error("Error publishing to Facebook:", error);

        // Parse common Meta errors
        let errorMessage = "Failed to publish to Facebook";
        if (error instanceof Error) {
            if (error.message.includes("ratio")) {
                errorMessage = "Image ratio not supported by Facebook";
            } else if (error.message.includes("OAuthException")) {
                errorMessage = "Facebook authentication expired. Please reconnect your account.";
            } else if (error.message.includes("permissions")) {
                errorMessage = "Insufficient permissions to post to this Page";
            } else {
                errorMessage = error.message;
            }
        }

        return {
            success: false,
            error: errorMessage,
        };
    }
}

/**
 * Publish a photo post to Instagram (2-step process)
 * 
 * Instagram requires:
 * 1. Create media container
 * 2. Publish the container
 * 
 * @param accessToken - Page access token (Instagram uses Page token)
 * @param igUserId - Instagram Business Account ID
 * @param caption - Post caption
 * @param imageUrl - Public URL of the image (must be accessible by Meta)
 * @returns Result with post ID or error
 */
export async function publishToInstagram(
    accessToken: string,
    igUserId: string,
    caption: string,
    imageUrl: string
): Promise<PublishResult> {
    try {
        // Step 1: Create Instagram Media Container
        const containerResponse = await fetch(
            `${GRAPH_API_BASE}/${igUserId}/media`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image_url: imageUrl,
                    caption: caption,
                    access_token: accessToken,
                }),
            }
        );

        if (!containerResponse.ok) {
            const error = await containerResponse.json();
            throw new Error(
                error.error?.message || `Container creation failed: ${containerResponse.statusText}`
            );
        }

        const containerData: InstagramContainerResult = await containerResponse.json();
        const creationId = containerData.id;

        // Wait a bit for Instagram to process the container
        // Instagram recommends checking status, but for simplicity we'll wait
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Step 2: Publish the Media Container
        const publishResponse = await fetch(
            `${GRAPH_API_BASE}/${igUserId}/media_publish`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    creation_id: creationId,
                    access_token: accessToken,
                }),
            }
        );

        if (!publishResponse.ok) {
            const error = await publishResponse.json();
            throw new Error(
                error.error?.message || `Container publish failed: ${publishResponse.statusText}`
            );
        }

        const publishData = await publishResponse.json();

        return {
            success: true,
            postId: publishData.id,
        };
    } catch (error) {
        console.error("Error publishing to Instagram:", error);

        // Parse common Instagram errors
        let errorMessage = "Failed to publish to Instagram";
        if (error instanceof Error) {
            if (error.message.includes("aspect ratio")) {
                errorMessage = "Image aspect ratio must be between 4:5 and 1.91:1 for Instagram";
            } else if (error.message.includes("resolution")) {
                errorMessage = "Image resolution not supported. Min 320px, recommended 1080px";
            } else if (error.message.includes("url")) {
                errorMessage = "Image URL must be publicly accessible by Instagram";
            } else if (error.message.includes("OAuthException")) {
                errorMessage = "Instagram authentication expired. Please reconnect your account.";
            } else if (error.message.includes("permissions")) {
                errorMessage = "Insufficient permissions to post to Instagram";
            } else if (error.message.includes("Business")) {
                errorMessage = "Instagram account must be a Business or Creator account";
            } else {
                errorMessage = error.message;
            }
        }

        return {
            success: false,
            error: errorMessage,
        };
    }
}

/**
 * Check Instagram container status (optional, for advanced use)
 * 
 * @param accessToken - Page access token
 * @param containerId - Container ID from creation step
 * @returns Container status
 */
export async function checkInstagramContainerStatus(
    accessToken: string,
    containerId: string
): Promise<{ status: string; status_code: string }> {
    try {
        const response = await fetch(
            `${GRAPH_API_BASE}/${containerId}?fields=status,status_code&access_token=${accessToken}`,
            {
                method: "GET",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to check container status");
        }

        return await response.json();
    } catch (error) {
        console.error("Error checking container status:", error);
        throw error;
    }
}

/**
 * Publish to multiple platforms at once
 * 
 * @param platforms - Array of platform publish jobs
 * @returns Array of results
 */
export async function publishToMultiplePlatforms(
    platforms: Array<{
        platform: "facebook" | "instagram";
        accessToken: string;
        accountId: string;
        caption: string;
        imageUrl?: string;
    }>
): Promise<PublishResult[]> {
    const results = await Promise.allSettled(
        platforms.map((platform) => {
            if (platform.platform === "facebook") {
                return publishToFacebookPage(
                    platform.accessToken,
                    platform.accountId,
                    platform.caption,
                    platform.imageUrl
                );
            } else {
                if (!platform.imageUrl) {
                    return Promise.resolve({
                        success: false,
                        error: "Instagram requires an image",
                    });
                }
                return publishToInstagram(
                    platform.accessToken,
                    platform.accountId,
                    platform.caption,
                    platform.imageUrl
                );
            }
        })
    );

    return results.map((result) => {
        if (result.status === "fulfilled") {
            return result.value;
        } else {
            return {
                success: false,
                error: result.reason?.message || "Unknown error",
            };
        }
    });
}

/**
 * Publish to Instagram with automatic image processing and watermarking
 * 
 * 1. Checks if website has a logo
 * 2. Fetches and composites logo if exists
 * 3. Handles aspect ratio
 * 4. Publishes to Instagram
 */
export async function publishToInstagramWithProcessing(
    accessToken: string,
    igUserId: string,
    caption: string,
    imageUrl: string,
    supabase: any,
    userId: string,
    websiteId: string
): Promise<PublishResult> {
    try {
        // 1. Get website settings (logo)
        let logoUrl: string | undefined;
        if (websiteId) {
            const { data: website } = await supabase
                .from("websites")
                .select("logo_url")
                .eq("id", websiteId)
                .single();

            if (website?.logo_url) {
                logoUrl = website.logo_url;
            }
        }

        // 2. Process image (resize/watermark)
        let processedImageUrl = imageUrl;
        try {
            processedImageUrl = await processAndUploadForInstagram(
                imageUrl,
                supabase,
                userId,
                "blur",
                logoUrl
            );
        } catch (processError) {
            console.warn("Image processing/watermarking failed. Falling back to original image.", processError);
            // Fallback: Use original URL, but continue publishing
            processedImageUrl = imageUrl;
        }

        // 3. Publish
        return await publishToInstagram(
            accessToken,
            igUserId,
            caption,
            processedImageUrl
        );
    } catch (error) {
        console.error("Error in publishToInstagramWithProcessing:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Publishing failed",
        };
    }
}
