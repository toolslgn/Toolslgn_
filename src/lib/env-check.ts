/**
 * Environment Variable Check Script
 * 
 * This script runs during build time to verify that all required
 * environment variables are present. It logs warnings for missing variables
 * to help prevent runtime errors in production.
 */

// List of required environment variables
const requiredEnvVars = [
    // Supabase
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",

    // AI Integration
    "GOOGLE_AI_API_KEY",

    // Facebook/Meta Integration
    "FACEBOOK_APP_ID",

    // Cron Jobs
    "CRON_SECRET"
];

// ANSI color codes for console output
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    bold: "\x1b[1m"
};

console.log(`${colors.blue}${colors.bold}🔍 Checking environment variables...${colors.reset}`);

const missingVars: string[] = [];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        missingVars.push(envVar);
    }
}

if (missingVars.length > 0) {
    console.warn(`\n${colors.yellow}${colors.bold}⚠️  WARNING: Missing Environment Variables${colors.reset}`);
    console.warn(`${colors.yellow}The following environment variables are missing. The app may not function correctly:${colors.reset}`);

    missingVars.forEach(variable => {
        console.warn(`${colors.red}  - ${variable}${colors.reset}`);
    });

    console.warn(`\n${colors.yellow}Please check your .env.local file or Vercel project settings.${colors.reset}\n`);

    // We don't exit with error code 1 because we want the build to potentially proceed
    // even if some vars are missing (e.g. during specific test builds), but the warning is prominent.
} else {
    console.log(`${colors.green}✅ All required environment variables are present.${colors.reset}\n`);
}
