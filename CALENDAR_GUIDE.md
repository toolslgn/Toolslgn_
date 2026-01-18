# 📅 Visual Calendar Feature - Guide

## Overview

Comprehensive visual calendar with desktop month view and mobile agenda view for managing scheduled posts.

---

## 🎯 Features

### Desktop View (≥ md breakpoint)
- **Full Month Calendar**
- Color-coded events
- Click date → View posts dialog
- Navigation (prev/next month)

### Mobile View (< md breakpoint)
- **Agenda View** (vertical list)
- Grouped by: "Today", "Tomorrow", "Friday", etc.
- Color-coded status icons
- Touch-optimized cards

### Color Coding
- 🟡 **Yellow** - Queued (scheduled)
- 🟢 **Green** - Published (success)
- 🔴 **Red** - Failed (error)

---

## 🔧 Implementation

### Libraries
```bash
npm install react-big-calendar moment
```

### Components Used
- `react-big-calendar` - Desktop calendar
- `moment` - Date formatting
- Shadcn UI - Card, Dialog, Badge
- Custom CSS - Theme integration

---

## 💻 Desktop Calendar View

### Features
- Month view with color-coded events
- Each post = colored bar/dot
- Click date → Opens dialog
- Shows all posts for that day

### Event Styling
```typescript
const eventStyleGetter = (event) => {
  let backgroundColor = "#fbbf24"; // Yellow (Queued)
  
  if (event.status === "PUBLISHED") {
    backgroundColor = "#10b981"; // Green
  } else if (event.status === "FAILED") {
    backgroundColor = "#ef4444"; // Red
  }
  
  return { style: { backgroundColor } };
};
```

---

## 📱 Mobile Agenda View

### Grouping Logic
- **Today** - Posts scheduled for today
- **Tomorrow** - Posts for tomorrow
- **Friday, Jan 19** - Posts within 7 days
- **Jan 25, 2026** - Posts beyond 7 days

### Example
```
┌─────────────────────┐
│ Today               │
├─────────────────────┤
│ 🟡 Facebook - 10:00 WIB │
│ 🟢 Instagram - 14:00 WIB│
└─────────────────────┘

┌─────────────────────┐
│ Tomorrow            │
├─────────────────────┤
│ 🟡 Facebook - 09:00 WIB │
└─────────────────────┘
```

---

## 🎨 Visual Examples

### Desktop
```
     January 2026
┌─────┬─────┬─────┬─────┐
│ 15  │ 16  │ 17  │ 18  │
│ 🟡🟢 │     │ 🟡  │ 🔴🟡│
└─────┴─────┴─────┴─────┘
```

Click "18" → Dialog shows:
- 🔴 Facebook Page - Failed
- 🟡 Instagram - Queued

---

## 📊 Data Fetching

### Query
```typescript
const { data } = await supabase
  .from("post_schedules")
  .select(`
    id,
    scheduled_at,
    published_at,
    status,
    posts (caption, image_url),
    accounts (platform, account_name)
  `)
  .order("scheduled_at", { ascending: true });
```

### Conversion to Events
```typescript
const events = data.map((schedule) => ({
  id: schedule.id,
  title: schedule.accounts.account_name,
  start: new Date(schedule.scheduled_at),
  end: new Date(schedule.scheduled_at),
  status: schedule.status,
  resource: schedule // Full data for dialog
}));
```

---

## 🔄 Responsive Behavior

### Breakpoint Check
```typescript
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768); // md breakpoint
  };
  
  checkMobile();
  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);
```

### Conditional Rendering
```tsx
{isMobile ? (
  // Agenda View
  <AgendaView events={groupedEvents} />
) : (
  // Calendar View
  <Calendar events={events} />
)}
```

---

## 📚 Related Files

- **Calendar Page**: [src/app/dashboard/calendar/page.tsx](file:///d:/ToolsLiguns/src/app/dashboard/calendar/page.tsx)
- **Custom CSS**: [src/app/dashboard/calendar/calendar.css](file:///d:/ToolsLiguns/src/app/dashboard/calendar/calendar.css)
- **Timezone Utils**: [src/lib/timezone.ts](file:///d:/ToolsLiguns/src/lib/timezone.ts)

---

**Efficient schedule management with visual calendar!** 📅
