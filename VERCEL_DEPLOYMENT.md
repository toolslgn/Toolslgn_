# 🚀 Vercel Deployment Guide

Complete checklist for deploying ToolsLiguns to Vercel.

---

## 📋 Required Environment Variables

### 1. Supabase (Database & Auth)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to find:**
- Supabase Dashboard → Project Settings → API
- `NEXT_PUBLIC_*` = Public (client-side)
- `SUPABASE_SERVICE_ROLE_KEY` = Server-only (DO NOT expose to client)

---

### 2. Meta API (Facebook/Instagram)

```bash
FACEBOOK_APP_ID=1234567890123456
FACEBOOK_APP_SECRET=abcdef1234567890abcdef1234567890
NEXT_PUBLIC_FACEBOOK_REDIRECT_URI=https://your-domain.vercel.app/api/auth/facebook/callback
```

**Where to find:**
- Meta for Developers → Your App → Settings → Basic
- Update redirect URI to your Vercel domain
- **Important**: Add Vercel domain to Facebook App's allowed domains

---

### 3. Telegram Notifications

```bash
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

**Where to find:**
- Bot Token: @BotFather on Telegram
- Chat ID: Send message to bot, then visit `https://api.telegram.org/bot<TOKEN>/getUpdates`

---

### 4. Cron Security

```bash
CRON_SECRET=550e8400-e29b-41d4-a716-446655440000
```

**Generate:**
```bash
# Online: https://www.uuidgenerator.net/
# Or Node.js:
node -e "console.log(require('crypto').randomUUID())"
```

**Purpose:** Secures `/api/cron/*` endpoints from unauthorized access

---

### 5. Authentication (Whitelist)

```bash
ADMIN_EMAIL=your-email@gmail.com,another@gmail.com
```

**Format:** Comma-separated list of allowed admin emails
**Purpose:** Only these emails can access the dashboard

---

## 🔧 Vercel Setup Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/toolsliguns.git
git push -u origin main
```

### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Framework Preset: **Next.js**
5. Root Directory: `./`

### 3. Add Environment Variables
In Vercel Project Settings → Environment Variables, add **ALL** variables from above.

**Pro Tip:** Copy from your `.env.local` but update URLs/domains for production.

### 4. Deploy
Click "Deploy" - Vercel will:
1. Run `npm install`
2. Run `npm run build` (env validation runs here)
3. Deploy if build succeeds

---

## ✅ Build-Time Validation

The project includes automatic environment validation:

**File:** `src/lib/env-check.ts`

**What it does:**
- Checks all required env vars at build time
- Fails build with clear error messages if any are missing
- Prevents deploying broken apps

**Example Error:**
```
🚫 ENVIRONMENT VALIDATION FAILED

❌ Missing required env var: TELEGRAM_BOT_TOKEN
   Description: Telegram Bot Token from @BotFather
   Category: telegram

Please add these variables to Vercel Project Settings.
```

---

## 🔐 Security Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT in public env vars
- [ ] `FACEBOOK_APP_SECRET` is NOT in public env vars
- [ ] `TELEGRAM_BOT_TOKEN` is NOT in public env vars
- [ ] `CRON_SECRET` is strong (UUID recommended)
- [ ] Facebook App domain includes Vercel URL
- [ ] Supabase RLS policies are enabled
- [ ] `ADMIN_EMAIL` contains only authorized emails

---

## 📊 Post-Deployment

### 1. Verify Cron Jobs
```bash
# Test cron endpoint (replace with your domain and secret)
curl -X GET "https://your-app.vercel.app/api/cron/publish?secret=YOUR_CRON_SECRET"
```

### 2. Set Up Vercel Cron
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/publish?secret=YOUR_CRON_SECRET",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### 3. Test Features
- [ ] Login with admin email
- [ ] Connect Facebook account
- [ ] Create test post
- [ ] Schedule post
- [ ] Verify Telegram notifications
- [ ] Check post publishes at scheduled time

---

## 🐛 Troubleshooting

### Build Fails: "Missing required environment variables"
→ Add the missing env var in Vercel Settings → Redeploy

### Facebook OAuth doesn't work
→ Check `NEXT_PUBLIC_FACEBOOK_REDIRECT_URI` matches Vercel domain  
→ Verify domain is added to Facebook App settings

### Cron jobs don't run
→ Verify `CRON_SECRET` matches in Vercel env and `vercel.json`  
→ Check Vercel Cron logs in dashboard

### Telegram notifications fail
→ Test bot token: `https://api.telegram.org/bot<TOKEN>/getMe`  
→ Verify chat ID is correct

---

## 📚 Related Files

- **Env Validation**: [src/lib/env-check.ts](file:///d:/ToolsLiguns/src/lib/env-check.ts)
- **Env Example**: [.env.example](file:///d:/ToolsLiguns/.env.example)
- **Cron Setup**: [CRON_SETUP.md](file:///d:/ToolsLiguns/CRON_SETUP.md)

---

**Ready to deploy!** 🚀
