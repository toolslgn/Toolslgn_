# 🔑 Master Keys - Vercel Deployment

These are the EXACT environment variables you need to copy-paste into Vercel Project Settings.

## 1. Quick Copy List

| Variable Name | Value To Enter |
|---------------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | *Your Supabase Project URL* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *Your Supabase Anon Key* |
| `SUPABASE_SERVICE_ROLE_KEY` | *Your Supabase Service Role Key* |
| `FACEBOOK_APP_ID` | *Meta App ID* |
| `FACEBOOK_APP_SECRET` | *Meta App Secret* |
| `NEXT_PUBLIC_FACEBOOK_APP_ID` | *Meta App ID (Same as above)* |
| `NEXT_PUBLIC_APP_URL` | `https://your-app-name.vercel.app` (or your production domain) |
| `TELEGRAM_BOT_TOKEN` | *Your Bot Token from @BotFather* |
| `TELEGRAM_CHAT_ID` | *Your Chat ID* |
| `CRON_SECRET` | `5c4d6a7f-8b9e-4c2d-1a3b-9e8d7c6b5a4f` (Generated Just Now) |
| `GOOGLE_AI_API_KEY` | *Your Gemini API Key* |
| `ADMIN_EMAIL` | *Your Email Address* |

---

## 2. Detailed Breakdown

### 🗄️ Database & Auth (Supabase)
Used for the database connection and user authentication.
- **`NEXT_PUBLIC_SUPABASE_URL`**
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
- **`SUPABASE_SERVICE_ROLE_KEY`** (Critical: Used by Cron jobs to bypass RLS)

### 📲 Meta Connectivity
Used for posting to Facebook and Instagram.
- **`FACEBOOK_APP_ID`**
-## 🔑 Definitive Production Environment Variables
*Add these to your Vercel Project Settings immediately.*

### 1. Database (Supabase)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Public API Key.
- `SUPABASE_SERVICE_ROLE_KEY`: **CRITICALLY IMPORTANT** for the Cron Job to run securely.

### 2. Authentication & Admin
- `NEXT_PUBLIC_APP_URL`: Your production Vercel URL (e.g., `https://toolsliguns.vercel.app`).
- `ADMIN_EMAIL`: `Muchamad.guntur04@gmail.com,Muchamad.guntur97@gmail.com,Ligunsentertain@gmail.com`

### 3. Meta API (Facebook & Instagram)
- `FACEBOOK_APP_ID`: From Meta Developer Portal.
- `FACEBOOK_APP_SECRET`: From Meta Developer Portal.
- `NEXT_PUBLIC_FACEBOOK_APP_ID`: Same as above, repeated for client-side usage.

### 4. Notifications
- `TELEGRAM_BOT_TOKEN`: From BotFather.
- `TELEGRAM_CHAT_ID`: Your chat ID for notifications.

### 5. AI Power 🧠 (New!)
- `GOOGLE_AI_API_KEY`: Your Gemini API Key for caption generation.

### 6. Cron Security 🛡️
- `CRON_SECRET`: A strong random string (UUID) to protect your `/api/cron/publish` endpoint.
  - _Generated_: `b3a8d9f1-7c2e-4e5a-9d8b-1a2c3d4e5f6g` (Example - use a fresh one if simpler)

---

## 🛡️ Vercel Configuration Verification

### `vercel.json` (Required for Cron)
Ensure your file looks exactly like this to run every 10 minutes:
```json
{
  "crons": [
    {
      "path": "/api/cron/publish",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

### `next.config.mjs` (Required for Build)
Ensure you allow images from Facebook, Instagram, and Supabase:
```javascript
const nextConfig = {
    output: 'standalone',
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: '**.supabase.co' },
            { protocol: 'https', hostname: '**.fbcdn.net' },
            { protocol: 'https', hostname: '**.cdninstagram.com' }
        ]
    }
};
```
  - Get from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 3. How to Add to Vercel
1. Go to **vercel.com** → Select your project.
2. Click **Settings** (top tab).
3. Click **Environment Variables** (left sidebar).
4. Enter the **Key** and **Value** for each item above.
5. Click **Save**.
6. **Redeploy** (Go to Deployments → Redeploy) for changes to take effect.
