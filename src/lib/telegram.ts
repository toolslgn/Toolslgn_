/**
 * Telegram Notification Service
 * 
 * Send instant notifications to your phone via Telegram Bot API
 */

const TELEGRAM_API_BASE = "https://api.telegram.org";

interface TelegramMessage {
    success: boolean;
    message_id?: number;
    error?: string;
}

/**
 * Send a message to Telegram
 * 
 * @param message - Text message to send (supports Markdown)
 * @param parseMode - Message formatting (default: "Markdown")
 * @returns Result with message ID or error
 */
export async function sendTelegramMessage(
    message: string,
    parseMode: "Markdown" | "HTML" = "Markdown"
): Promise<TelegramMessage> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Check if Telegram is configured
    if (!botToken || !chatId) {
        console.warn("Telegram not configured - skipping notification");
        return {
            success: false,
            error: "Telegram credentials not configured",
        };
    }

    try {
        const response = await fetch(
            `${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: parseMode,
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                error.description || `Telegram API error: ${response.statusText}`
            );
        }

        const data = await response.json();

        return {
            success: true,
            message_id: data.result.message_id,
        };
    } catch (error) {
        console.error("Error sending Telegram message:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Send a success notification
 * 
 * @param summary - Summary of successful operation
 */
export async function sendSuccessNotification(summary: {
    processed: number;
    success: number;
    failed: number;
    retrying: number;
    websites?: string[];
    executionTime?: number;
}): Promise<void> {
    const { processed, success, failed, retrying, websites, executionTime } =
        summary;

    const websiteList = websites && websites.length > 0
        ? websites.join(", ")
        : "various websites";

    const message = `
🚀 *ToolsLiguns Report*

✅ Successfully published *${success}* post${success !== 1 ? "s" : ""}
${failed > 0 ? `❌ Failed: ${failed}\n` : ""}${retrying > 0 ? `🔄 Retrying: ${retrying}\n` : ""}
📊 Total processed: ${processed}
🌐 Websites: ${websiteList}
${executionTime ? `⏱ Execution time: ${(executionTime / 1000).toFixed(2)}s` : ""}

Keep up the great work! 💪
  `.trim();

    await sendTelegramMessage(message);
}

/**
 * Send a failure notification with urgent flag
 * 
 * @param errors - Array of error details
 */
export async function sendFailureNotification(errors: Array<{
    platform: string;
    error: string;
    scheduleId?: string;
}>): Promise<void> {
    const errorList = errors
        .map(
            (err, i) =>
                `${i + 1}. *${err.platform}*: ${err.error}${err.scheduleId ? ` (ID: \`${err.scheduleId.substring(0, 8)}\`)` : ""}`
        )
        .join("\n");

    const message = `
🚨 *URGENT: Publishing Failures*

❌ ${errors.length} post${errors.length !== 1 ? "s" : ""} failed to publish:

${errorList}

⚠️ *Action Required*
Please check the dashboard and resolve these issues.

🔗 Dashboard: ${process.env.NEXT_PUBLIC_APP_URL || "https://toolsliguns.vercel.app"}/dashboard
  `.trim();

    await sendTelegramMessage(message);
}

/**
 * Send a retry notification
 * 
 * @param retries - Array of retry details
 */
export async function sendRetryNotification(retries: Array<{
    platform: string;
    error: string;
    retryCount: number;
}>): Promise<void> {
    const retryList = retries
        .map(
            (retry, i) =>
                `${i + 1}. *${retry.platform}* (Attempt ${retry.retryCount}/3): ${retry.error}`
        )
        .join("\n");

    const message = `
🔄 *Retry Alert*

${retries.length} post${retries.length !== 1 ? "s" : ""} will be retried:

${retryList}

These will be attempted again in the next cron run.
  `.trim();

    await sendTelegramMessage(message);
}
