# ⏰ Automated Post Scheduler - Setup Guide

## Overview

Automated cron job that publishes scheduled social media posts at the right time.

---

## 🎯 How It Works

```
Cron Trigger (every 5 min) → API Route → Fetch Due Posts → Publish → Update Status
```

### Flow:

1. **Cron triggers** `/api/cron/publish`
2. **Verifies** authorization secret
3. **Fetches** posts with status='QUEUED' and scheduled_at ≤ now()
4. **Publishes** each post to Facebook/Instagram
5. **Updates** status to PUBLISHED or FAILED
6. **Returns** summary (processed, success, failed)

---

## 🛠️ Setup

### 1. Add Environment Variable

```bash
# .env.local
CRON_SECRET=your-random-secret-here
```

**Generate secret:**
```bash
openssl rand -base64 32
```

Or use any random string (min 32 characters).

---

### 2. Configure Cron Service

#### Option A: Vercel Cron

Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/publish",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

**Schedule**: Every 5 minutes

#### Option B: GitHub Actions

Create `.github/workflows/cron-publish.yml`:
```yaml
name: Publish Scheduled Posts

on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
  workflow_dispatch:  # Manual trigger

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cron Endpoint
        run: |
          curl -X GET https://yourdomain.com/api/cron/publish \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

Add `CRON_SECRET` to GitHub Secrets.

#### Option C: Manual Testing

```bash
curl -X GET http://localhost:3000/api/cron/publish \
  -H "Authorization: Bearer your-cron-secret"
```

---

## 📊 Response Format

### Success
```json
{
  "processed": 5,
  "success": 4,
  "failed": 1,
  "details": [
    {
      "scheduleId": "uuid",
      "platform": "facebook",
      "status": "success",
      "postId": "123_456"
    },
    {
      "scheduleId": "uuid",
      "platform": "instagram",
      "status": "failed",
      "error": "Image ratio not supported"
    }
  ],
  "executionTime": 3542,
  "timestamp": "2026-01-18T21:00:00Z"
}
```

### No Posts Due
```json
{
  "processed": 0,
  "success": 0,
  "failed": 0,
  "message": "No posts due for publishing",
  "executionTime": 120
}
```

### Unauthorized
```json
{
  "error": "Unauthorized"
}
```

---

## 🔧 Database Updates

### On Success
```sql
UPDATE post_schedules SET
  status = 'PUBLISHED',
  platform_post_id = 'fb_post_123',
  published_at = NOW(),
  updated_at = NOW()
WHERE id = 'schedule_uuid';
```

### On Failure
```sql
UPDATE post_schedules SET
  status = 'FAILED',
  error_log = 'Image ratio not supported',
  updated_at = NOW()
WHERE id = 'schedule_uuid';
```

---

## 🧪 Testing

### 1. Create Test Post

```sql
-- Create a post scheduled for now
INSERT INTO posts (user_id, website_id, caption, image_url)
VALUES ('user-uuid', 'website-uuid', 'Test post', 'https://picsum.photos/1080/1080');

-- Schedule it for immediate publishing
INSERT INTO post_schedules (
  user_id, post_id, account_id, 
  scheduled_at, status
) VALUES (
  'user-uuid', 'post-uuid', 'account-uuid',
  NOW(), 'QUEUED'
);
```

### 2. Trigger Cron

```bash
curl -X GET http://localhost:3000/api/cron/publish \
  -H "Authorization: Bearer your-secret"
```

### 3. Check Results

```sql
SELECT * FROM post_schedules 
WHERE status IN ('PUBLISHED', 'FAILED') 
ORDER BY updated_at DESC 
LIMIT 10;
```

---

## ⚙️ Configuration

### Batch Size

Current limit: **50 posts per run**

Change in `route.ts`:
```typescript
.limit(50)  // Adjust as needed
```

### Schedule Frequency

**Recommended**: Every 5 minutes

More frequent = Lower latency, higher cost  
Less frequent = Higher latency, lower cost

### Timeout

Default: 10 seconds (Vercel free)  
Pro: 60 seconds

---

## 🚨 Error Handling

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Unauthorized" | Wrong CRON_SECRET | Check .env.local |
| "Missing post data" | Corrupted DB record | Verify foreign keys |
| "Token expired" | Account token expired | Reconnect account |
| "Image ratio..." | Wrong image size | Check PUBLISHING_GUIDE.md |

### Monitoring

**Check logs:**
```bash
# Vercel
vercel logs

# Local
Check server console
```

**Check failed posts:**
```sql
SELECT * FROM post_schedules 
WHERE status = 'FAILED' 
AND scheduled_at >= NOW() - INTERVAL '24 hours';
```

---

## 🔄 Retry Logic

Currently: **No automatic retry**

Failed posts stay FAILED. User must:
1. View error in UI
2. Fix issue (reconnect account, fix image, etc.)
3. Reschedule post

**Future**: Add retry with exponential backoff.

---

## 📚 Related Files

- **Cron Route**: [src/app/api/cron/publish/route.ts](file:///d:/ToolsLiguns/src/app/api/cron/publish/route.ts)
- **Publishing Service**: [src/lib/publish-service.ts](file:///d:/ToolsLiguns/src/lib/publish-service.ts)
- **Publishing Guide**: [PUBLISHING_GUIDE.md](file:///d:/ToolsLiguns/PUBLISHING_GUIDE.md)

---

## 🚀 Deployment

### Vercel

1. Create `vercel.json`
2. Add `CRON_SECRET` to environment variables
3. Deploy: `vercel --prod`
4. Cron runs automatically

### Self-Hosted

1. Set up cron job (crontab, systemd timer)
2. Call endpoint every 5 minutes
3. Pass `Authorization: Bearer <secret>` header

---

**Automated post scheduler ready! Set up cron and posts will publish automatically.** ⏰
