# 🎛️ Dashboard Cockpit - Guide

## Overview

High-utility command center for monitoring and managing your social media automation.

---

## 📊 Stats Cards

### Three Key Metrics

**1. Scheduled**
- Count of queued posts
- Yellow clock icon
- Shows pending posts waiting to publish

**2. Published (This Month)**
- Count of successful posts this month
- Green checkmark icon
- Resets monthly

**3. Failed**
- Count of posts with errors
- Red X icon
- Requires attention

---

## 🚀 Up Next Section

### Features
- Shows next 3 upcoming posts
- Detailed card view with:
  - Image preview (if available)
  - Platform badge & account name
  - Caption (truncated to 2 lines)
  - Scheduled time in WIB

### "Post Now" Button
**Manual Override:**
- Click → Confirmation dialog
- Publishes immediately (bypasses schedule)
- Updates status to PUBLISHED/FAILED
- Refreshes dashboard

**Use Cases:**
- Test posting system
- Urgent announcements
- Skip waiting for cron

---

## ⚠️ Token Health Check

### Monitoring
Checks all accounts for token expiration:
- Queries `accounts` table
- Checks `token_expires_at` column
- Alerts if within 7 days or expired

### Alert Display
```
⚠️ Re-connection Required

2 account(s) have tokens expiring within 7 days:
• Facebook: Page Name (expires 22 Jan 2026, 10:00 WIB)
• Instagram: @username (expires 24 Jan 2026, 14:00 WIB)

[Manage Accounts] button
```

**Prevents:** Publishing failures from expired tokens

---

## 📈 Stats Calculation

### Scheduled Posts
```sql
SELECT COUNT(*) 
FROM post_schedules 
WHERE status = 'QUEUED'
```

### Published (This Month)
```sql
SELECT COUNT(*) 
FROM post_schedules 
WHERE status = 'PUBLISHED'
  AND published_at >= '2026-01-01T00:00:00Z'
```

### Failed Posts
```sql
SELECT COUNT(*) 
FROM post_schedules 
WHERE status = 'FAILED'
```

---

## 🎯 Quick Actions

### Create New Post
- Button → /dashboard/create
- Schedule content across platforms

### View All Schedules
- Button → /dashboard/calendar
- Browse full calendar

---

## 🔄 Manual Publishing Flow

### "Post Now" Workflow
1. User clicks "Post Now" on upcoming post
2. Confirmation dialog appears
3. Server action `publishNow()` called
4. Fetches post & account data
5. Parses spintax caption
6. Publishes to platform (FB/IG)
7. Updates schedule status
8. Revalidates dashboard
9. Shows toast notification

### Error Handling
- Invalid schedule → Error toast
- Already published → Error toast
- Platform error → Marks as FAILED
- Success → Marks as PUBLISHED

---

## 📚 Related Files

- **Dashboard Page**: [src/app/dashboard/page.tsx](file:///d:/ToolsLiguns/src/app/dashboard/page.tsx)
- **Actions**: [src/app/dashboard/actions.ts](file:///d:/ToolsLiguns/src/app/dashboard/actions.ts)
- **Publish Button**: [src/components/publish-now-button.tsx](file:///d:/ToolsLiguns/src/components/publish-now-button.tsx)

---

**Your social media command center!** 🎛️
