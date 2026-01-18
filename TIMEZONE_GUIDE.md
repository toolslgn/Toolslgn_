# 🕐 Timezone Handling - WIB Guide

## Overview

Accurate timezone handling for Asia/Jakarta (WIB, GMT+7) to prevent scheduling errors.

---

## ⚠️ The Problem

**Server Time vs Local Time:**
- Server runs on UTC (GMT+0)
- User is in WIB (GMT+7)
- 10:00 WIB ≠ 10:00 UTC

**Without timezone handling:**
```
User schedules: 10:00 WIB
Server stores: 10:00 UTC
Publishes at: 17:00 WIB ❌ (7 hours late!)
```

---

## ✅ The Solution

### 1. Frontend (User Input)
- User sees: "10:00 WIB"
- Form submits: UTC ISO string
- Conversion happens before API call

### 2. Database Storage
- Always stores UTC timestamps
- Postgres TIMESTAMPTZ handles this

### 3. Backend Display
- Cron job compares UTC correctly
- Telegram shows WIB for readability

---

## 🔧 Implementation

### Timezone Utilities

**File**: [src/lib/timezone.ts](file:///d:/ToolsLiguns/src/lib/timezone.ts)

```typescript
// Convert local WIB to UTC for database
localToUTC(date, "10:00") → "2026-01-18T03:00:00.000Z"

// Convert UTC to WIB for display
utcToWIB("2026-01-18T03:00:00.000Z") → "18 Jan 2026, 10:00"

// Format with timezone label
formatWIB(date, true) → "18 Jan 2026, 10:00 WIB"
```

---

## 📝 Frontend Usage

### Time Picker
```tsx
<Label>Schedule Time * (WIB)</Label>
<input type="time" value={time} />
<p>🕐 Time zone: Asia/Jakarta (WIB, GMT+7)</p>
```

**User sees:** WIB label clearly

### Form Submission
```typescript
const scheduledDateTime = new Date(date);
scheduledDateTime.setHours(hours, minutes);

// Automatically converts to UTC when .toISOString() is called
await schedulePost({ scheduledDate: scheduledDateTime });
```

---

## 🤖 Backend Usage

### Cron Job Query
```typescript
const now = new Date().toISOString(); // UTC

const { data } = await supabase
  .from("post_schedules")
  .eq("status", "QUEUED")
  .lte("scheduled_at", now); // Compares UTC to UTC ✅
```

**Correct comparison:** Both sides are UTC

### Telegram Notification
```typescript
await sendSuccessNotification({
  timestamp: new Date().toISOString(), // UTC timestamp
  // ... other data
});

// Inside telegram.ts:
const wibTime = formatWIB(timestamp); // Converts to WIB
message = `🕐 Time: 18 Jan 2026, 10:00 WIB`;
```

**User sees:** WIB time in notifications

---

## 🧪 Testing

### Schedule for 10:00 WIB

**Frontend:**
1. Select date: Jan 18, 2026
2. Select time: 10:00
3. See label: "Schedule Time * (WIB)"
4. Submit

**Database:**
```sql
SELECT scheduled_at FROM post_schedules;
-- Result: 2026-01-18 03:00:00+00 (UTC)
```

**Cron Execution:**
```
Current time: 2026-01-18T03:00:00.000Z (UTC)
Query: scheduled_at <= NOW()
Match: ✅ Post is due
```

**Telegram:**
```
🕐 Time: 18 Jan 2026, 10:00 WIB
```

---

## 📊 Timezone Conversion Examples

| User Input (WIB) | Database (UTC) | Publishes At (WIB) |
|------------------|----------------|-------------------|
| 10:00 WIB | 03:00 UTC | 10:00 WIB ✅ |
| 14:30 WIB | 07:30 UTC | 14:30 WIB ✅ |
| 22:00 WIB | 15:00 UTC | 22:00 WIB ✅ |
| 00:30 WIB | 17:30 UTC (prev day) | 00:30 WIB ✅ |

---

## 🚨 Common Pitfalls

### ❌ Don't store local time
```typescript
// WRONG
scheduled_at: "2026-01-18T10:00:00" // No timezone!
```

### ✅ Always use ISO with timezone
```typescript
// CORRECT
scheduled_at: date.toISOString() // "2026-01-18T03:00:00.000Z"
```

### ❌ Don't compare mixed timezones
```typescript
// WRONG
const now = new Date(); // Local time
const scheduled = new Date(utcString); // UTC
if (scheduled <= now) // ❌ Comparing different timezones
```

### ✅ Always compare UTC to UTC
```typescript
// CORRECT
const now = new Date().toISOString(); // UTC
.lte("scheduled_at", now) // Both UTC ✅
```

---

## 📚 Related Files

- **Timezone Utils**: [src/lib/timezone.ts](file:///d:/ToolsLiguns/src/lib/timezone.ts)
- **Create Page**: [src/app/dashboard/create/page.tsx](file:///d:/ToolsLiguns/src/app/dashboard/create/page.tsx)
- **Cron Job**: [src/app/api/cron/publish/route.ts](file:///d:/ToolsLiguns/src/app/api/cron/publish/route.ts)
- **Telegram**: [src/lib/telegram.ts](file:///d:/ToolsLiguns/src/lib/telegram.ts)

---

**Posts now publish at exactly the right WIB time!** 🕐
