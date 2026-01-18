# 🔄 Retry Logic & Activity Logs - Guide

## Overview

Enhanced cron job with intelligent retry logic and visual activity monitoring.

---

## 🎯 Features

### 1. Retry Count Tracking
**Column**: `retry_count` (integer, default 0)

Tracks number of retry attempts per post schedule.

### 2. Platform Response Logging  
**Column**: `platform_response` (JSONB)

Stores full API responses for debugging.

### 3. Smart Error Classification
Automatically categorizes errors as **fatal** or **temporary**.

### 4. Auto-Retry Logic
Temporary errors retry up to 3 times before failing.

---

## 🧠 Error Classification

### Fatal Errors (No Retry)
- OAuth/Authentication errors
- Token expired
- Permission denied
- Invalid credentials
- Account not found
- Business account required

**Action**: Mark as FAILED immediately

### Temporary Errors (Auto-Retry)
- Timeout
- Network errors
- 5xx server errors
- Rate limits
- Connection issues

**Action**: Increment retry_count, stay QUEUED

---

## 🔄 Retry Flow

```
Attempt 1 → Error (Temporary) → retry_count = 1, status = QUEUED
     ↓
Next Cron Run
     ↓
Attempt 2 → Error (Temporary) → retry_count = 2, status = QUEUED
     ↓
Next Cron Run
     ↓
Attempt 3 → Error (Temporary) → retry_count = 3, status = QUEUED
     ↓
Next Cron Run
     ↓
Attempt 4 → Error → retry_count >=3 → status = FAILED
```

---

## 📊 Database Schema

### New Columns

```sql
ALTER TABLE post_schedules 
ADD COLUMN retry_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE post_schedules 
ADD COLUMN platform_response JSONB;
```

**Migration**: [migrations/add-retry-columns.sql](file:///d:/ToolsLiguns/migrations/add-retry-columns.sql)

---

## 📈 Activity Logs UI

### Recent Activity Widget

**File**: [src/components/recent-activity.tsx](file:///d:/ToolsLiguns/src/components/recent-activity.tsx)

**Features:**
- Shows last 5 post attempts
- Color-coded status
- Auto-refreshes every 30 seconds
- Displays error messages

**Color Coding:**
- 🟢 **Green** - Published (success)
- 🔴 **Red** - Failed (permanent)
- 🟡 **Yellow** - Retrying (1-3 attempts)
- 🔵 **Blue** - Queued (pending)

---

## 🎨 Status Indicators

### Published
```
Icon: CheckCircle2 (green)
Badge: "Published"
Background: Green/10
```

### Failed
```
Icon: XCircle (red)
Badge: "Failed"
Background: Red/10
Shows: error_log
```

### Retrying
```
Icon: AlertCircle (yellow)
Badge: "Retrying (2/3)"
Background: Yellow/10
Shows: retry_count
```

### Queued
```
Icon: Clock (blue)
Badge: "Queued"
Background: Blue/10
```

---

## 🔧 cron Job Updates

### classifyError()

```typescript
function classifyError(error: string): "fatal" | "temporary" {
  // Check fatal patterns
  if (error.includes("oauth")) return "fatal";
  if (error.includes("token")) return "fatal";
  
  // Check temporary patterns
  if (error.includes("timeout")) return "temporary";
  if (error.includes("500")) return "temporary";
  
  return "temporary"; // Default to retry
}
```

### Retry Logic

```typescript
const errorType = classifyError(errorMessage);
const currentRetryCount = schedule.retry_count || 0;

if (errorType === "fatal" || currentRetryCount >= MAX_RETRIES) {
  // Mark as FAILED
  await supabase.from("post_schedules").update({
    status: "FAILED",
    error_log: errorMessage,
    platform_response: { error, errorType }
  });
} else {
  // Increment retry, keep QUEUED
  await supabase.from("post_schedules").update({
    retry_count: currentRetryCount + 1,
    error_log: `Retry ${currentRetryCount + 1}/3: ${errorMessage}`,
    platform_response: { error, errorType, retryCount: currentRetryCount + 1 }
  });
}
```

---

## 🧪 Testing

### Test Retry Logic

1. Create post with invalid token (fatal):
```sql
-- Will fail immediately, no retry
```

2. Simulate timeout (temporary):
```typescript
// Will retry up to 3 times
throw new Error("Connection timeout");
```

### View Activity Logs

1. Navigate to `/dashboard`
2. Check Recent Activity widget
3. See color-coded status
4. View error messages

---

## 📊 Cron Response

### With Retries

```json
{
  "processed": 5,
  "success": 3,
  "failed": 1,
  "retrying": 1,
  "details": [
    {
      "scheduleId": "uuid",
      "platform": "facebook",
      "status": "success"
    },
    {
      "scheduleId": "uuid",
      "platform": "instagram",
      "status": "retrying",
      "error": "Timeout",
      "retryCount": 2
    }
  ]
}
```

---

## 🔍 Debugging

### Check Platform Response

```sql
SELECT 
  platform_response,
  retry_count,
  error_log
FROM post_schedules
WHERE status = 'FAILED'
ORDER BY updated_at DESC;
```

### View Retry History

```sql
SELECT 
  id,
  status,
  retry_count,
  error_log,
  platform_response->>'errorType' as error_type
FROM post_schedules
WHERE retry_count > 0
ORDER BY updated_at DESC;
```

---

## 📚 Related Files

- **Cron Route**: [src/app/api/cron/publish/route.ts](file:///d:/ToolsLiguns/src/app/api/cron/publish/route.ts)
- **Activity Widget**: [src/components/recent-activity.tsx](file:///d:/ToolsLiguns/src/components/recent-activity.tsx)
- **Migration**: [migrations/add-retry-columns.sql](file:///d:/ToolsLiguns/migrations/add-retry-columns.sql)
- **Dashboard**: [src/app/dashboard/page.tsx](file:///d:/ToolsLiguns/src/app/dashboard/page.tsx)

---

**Intelligent retry logic and visual activity monitoring complete!** 🔄
