/**
 * Environment Variables Validation
 * Runs at build time to ensure all required env vars are set
 */

interface EnvVar {
    key: string;
    description: string;
    required: boolean;
    category: "supabase" | "meta" | "telegram" | "cron" | "auth" | "ai";
}

const ENV_VARS: EnvVar[] = [
    // Supabase
    {
        key: "NEXT_PUBLIC_SUPABASE_URL",
        description: "Supabase project URL",
        required: true,
        category: "supabase",
    },
    {
        key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        description: "Supabase anonymous/public key",
        required: true,
        category: "supabase",
    },
    {
        key: "SUPABASE_SERVICE_ROLE_KEY",
        description: "Supabase service role key (server-side only)",
        required: true,
        category: "supabase",
    },

    // Meta API (Facebook/Instagram)
    {
        key: "FACEBOOK_APP_ID",
        description: "Facebook App ID from Meta Developer Portal",
        required: true,
        category: "meta",
    },
    {
        key: "FACEBOOK_APP_SECRET",
        description: "Facebook App Secret from Meta Developer Portal",
        required: true,
        category: "meta",
    },
    {
        key: "NEXT_PUBLIC_FACEBOOK_APP_ID",
        description: "Public Facebook App ID for OAuth button",
        required: true,
        category: "meta",
    },
    {
        key: "NEXT_PUBLIC_APP_URL",
        description: "Public app URL for OAuth callbacks (e.g., https://your-app.vercel.app)",
        required: true,
        category: "meta",
    },

    // Telegram Notifications
    {
        key: "TELEGRAM_BOT_TOKEN",
        description: "Telegram Bot Token from @BotFather",
        required: true,
        category: "telegram",
    },
    {
        key: "TELEGRAM_CHAT_ID",
        description: "Telegram Chat ID for notifications",
        required: true,
        category: "telegram",
    },

    // Cron Security
    {
        key: "CRON_SECRET",
        description: "Random secret for securing cron endpoints (generate UUID)",
        required: true,
        category: "cron",
    },

    // Authentication
    {
        key: "ADMIN_EMAIL",
        description: "Comma-separated list of admin emails for whitelist",
        required: true,
        category: "auth",
    },

    // AI
    {
        key: "GOOGLE_AI_API_KEY",
        description: "API Key for Google Gemini (Generative AI)",
        required: true,
        category: "ai",
    },
];

/**
 * Validate environment variables
 */
export function validateEnv(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const envVar of ENV_VARS) {
        if (envVar.required && !process.env[envVar.key]) {
            errors.push(
                `❌ Missing required env var: ${envVar.key}\n   Description: ${envVar.description}\n   Category: ${envVar.category}`
            );
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Check environment and throw error if invalid
 * Call this at build time
 */
export function checkEnv() {
    const { valid, errors } = validateEnv();

    if (!valid) {
        console.error("\n🚫 ENVIRONMENT VALIDATION FAILED\n");
        console.error("The following required environment variables are missing:\n");
        errors.forEach((error) => console.error(error + "\n"));
        console.error(
            "Please add these variables to your .env.local file (development) or Vercel Project Settings (production).\n"
        );
        console.error("See VERCEL_DEPLOYMENT.md for detailed instructions.\n");

        // Throw error to fail the build
        throw new Error("Missing required environment variables");
    }

    console.log("✅ All required environment variables are set");
}

/**
 * Get environment variable status for debugging
 */
export function getEnvStatus() {
    return ENV_VARS.map((envVar) => ({
        ...envVar,
        isSet: !!process.env[envVar.key],
        value: envVar.key.includes("SECRET") || envVar.key.includes("KEY")
            ? process.env[envVar.key] ? "***SET***" : undefined
            : process.env[envVar.key],
    }));
}

// Run validation if this file is executed directly
if (require.main === module) {
    checkEnv();
}
