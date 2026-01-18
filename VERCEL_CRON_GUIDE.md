# ⏰ Vercel Cron Configuration - Guide

## Overview

Automated publishing engine that runs every 10 minutes on Vercel.

---

## 🔧 Configuration

### vercel.json
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

**Schedule**: `*/10 * * * *` = Every 10 minutes
**Path**: `/api/cron/publish`

---

## 🔐 Security

### Authorization Header
Vercel Cron automatically sends:
```
Authorization: Bearer <CRON_SECRET>
```

**Validation in route.ts:**
```typescript
const authHeader = request.headers.get("authorization");
const expectedAuth = `Bearer ${cronSecret}`;

if (authHeader !== expectedAuth) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Protection:**
- ✅ Prevents external hackers from triggering endpoint
- ✅ No query parameter exposure
- ✅ Header-based authentication
- ✅ Vercel handles header automatically

---

## 🌍 Timezone Handling

**Important Notes:**
- Vercel Cron runs in **UTC**
- Database `scheduled_at` stored in **UTC** (via `localToUTC()`)
- Query uses `NOW()` which returns **UTC** on Supabase
- Times converted to **WIB (Asia/Jakarta)** only for display/logging

**Why this works:**
```typescript
// User selects: 2026-01-19 10:00 WIB
// localToUTC converts to: 2026-01-19 03:00 UTC
// Saved to DB as: 2026-01-19 03:00 UTC

// Cron runs at: 2026-01-19 03:05 UTC
// Query: SELECT * WHERE scheduled_at <= NOW()
// NOW() returns: 2026-01-19 03:05 UTC
// Match! ✅ Post publishes

// Notification shows: "Published at 10:00 WIB" ✅
```

**Result:** Timezone-accurate regardless of server location!

---

## 📊 How It Works

### Every 10 Minutes:
1. Vercel Cron triggers `/api/cron/publish`
2. Sends `Authorization: Bearer <CRON_SECRET>`
3. Route validates header
4. Queries: `scheduled_at <= NOW()` (both UTC)
5. Publishes matching posts
6. Sends Telegram notifications (times in WIB)
7. Returns summary

---

## 🧪 Testing

### Local Testing (HTTP)
```bash
# Get your CRON_SECRET from .env.local
curl -X GET "http://localhost:3000/api/cron/publish" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Production Testing (HTTPS)
```bash
curl -X GET "https://your-app.vercel.app/api/cron/publish" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Cron job completed",
  "stats": {
    "processed": 5,
    "success": 4,
    "failed": 1,
    "retrying": 0
  }
}
```

---

## 📈 Monitoring

### Vercel Dashboard
**Cron Logs:**
- Vercel Dashboard → Your Project → Cron Jobs
- View execution history
- See success/failure rates
- Check execution times

### Telegram Notifications
Every successful run sends:
```
🚀 ToolsLiguns Report

✅ Successfully published 4 posts
📊 Total processed: 5
🕐 Time: 19 Jan 2026, 10:05 WIB
⏱ Execution time: 2.34s
```

---

## 🔧 Configuration Options

### Change Schedule
Edit `vercel.json`:
```json
"schedule": "*/5 * * * *"   // Every 5 minutes
"schedule": "*/15 * * * *"  // Every 15 minutes
"schedule": "0 * * * *"     // Every hour
"schedule": "0 0 * * *"     // Daily at midnight UTC
```

### Cron Syntax
```
* * * * *
│ │ │ │ │
│ │ │ │ └─ Day of week (0-7)
│ │ │ └─── Month (1-12)
│ │ └───── Day of month (1-31)
│ └─────── Hour (0-23)
└───────── Minute (0-59)
```

---

## 🚨 Troubleshooting

### Cron Not Running
- ✅ Verify `vercel.json` deployed
- ✅ Check Vercel Dashboard → Cron Jobs
- ✅ Ensure `CRON_SECRET` set in Vercel env vars

### Unauthorized Errors
- ✅ `CRON_SECRET` matches in Vercel env and .env.local
- ✅ Header format: `Bearer <secret>` (with space)

### Posts Not Publishing
- ✅ Check `scheduled_at` is in UTC
- ✅ Verify NOW() returns UTC on Supabase
- ✅ Check Telegram notifications for errors

---

## 📚 Related Files

- **Config**: [vercel.json](file:///d:/ToolsLiguns/vercel.json)
- **Route**: [src/app/api/cron/publish/route.ts](file:///d:/ToolsLiguns/src/app/api/cron/publish/route.ts)
- **Timezone Utils**: [src/lib/timezone.ts](file:///d:/ToolsLiguns/src/lib/timezone.ts)

---

**Automated publishing every 10 minutes!** ⏰
