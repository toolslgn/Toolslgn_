# 🇮🇩 Indonesian Holiday Support - Guide

## Overview

Automatic Indonesian public holiday indicators in calendar for better content planning.

---

## 📅 Holiday Data

### 2026 Indonesian Holidays
**File**: `lib/holidays-2026.ts`

**Major Holidays Included:**
- New Year's Day (Jan 1)
- Chinese New Year (Feb 17)
- Nyepi - Balinese New Year (Mar 25)
- Eid al-Fitr (May 2-3) + Joint Holidays
- Independence Day (Aug 17)
- Eid al-Adha (Jul 9)
- Christmas (Dec 25-26)
- And more religious & national holidays

**Total**: 18 holidays for 2026

---

## 🎨 Calendar Indicators

### Visual Markers
**Desktop Calendar View:**
- Small flag icon (🚩) on holiday dates
- Color-coded by type:
  - **Red**: National holidays
  - **Orange**: Religious holidays
  - **Yellow**: Regional holidays

### Hover Tooltips
**On hover:**
```
┌─────────────────────┐
│ Hari Kemerdekaan RI │
│ Independence Day    │
└─────────────────────┘
```

Shows both Indonesian and English names

---

## ⚠️ Create Post Warnings

### Date Picker Alert
**When selecting holiday date:**

```
⚠️ Heads up! This date is Hari Raya Idul Fitri.
   Ensure your content is relevant.
```

**Features:**
- Orange alert box
- Holiday name displayed
- Gentle reminder (not blocking)

**Purpose:**
- Avoid inappropriate business posts
- Plan holiday-relevant content
- Prevent scheduling conflicts

---

## 🔧 Utility Functions

### isHoliday()
```typescript
const holiday = isHoliday(new Date("2026-08-17"));
// Returns: { 
//   date: "2026-08-17",
//   name: "Hari Kemerdekaan RI",
//   nameEn: "Independence Day",
//   type: "national"
// }
```

### getHolidaysInMonth()
```typescript
const holidays = getHolidaysInMonth(2026, 8);
// Returns all August 2026 holidays
```

### getHolidayColor()
```typescript
const colorClass = getHolidayColor("national");
// Returns: "text-red-600 dark:text-red-400"
```

---

## 📊 Holiday Types

| Type | Description | Color | Examples |
|------|-------------|-------|----------|
| National | Government holidays | Red | Independence Day, New Year |
| Religious | Religious celebrations | Orange | Eid, Christmas, Nyepi |
| Regional | Regional holidays | Yellow | Local festivals |

---

## 🎯 Use Cases

### Content Planning
1. Check calendar for holidays
2. Plan holiday-themed content
3. Avoid scheduling during major holidays
4. Prepare special promotions

### Example Scenarios
- **Aug 17**: Post patriotic content for Independence
- **May 2-3**: Eid greetings & promotions
- **Dec 25**: Christmas specials

---

## 🔄 Updating for 2027

**To add 2027 holidays:**
1. Create `lib/holidays-2027.ts`
2. Follow same structure
3. Update imports in calendar
4. Switch based on year

---

## 📚 Related Files

- **Holidays Data**: [src/lib/holidays-2026.ts](file:///d:/ToolsLiguns/src/lib/holidays-2026.ts)
- **Calendar Page**: [src/app/dashboard/calendar/page.tsx](file:///d:/ToolsLiguns/src/app/dashboard/calendar/page.tsx)
- **Create Post**: [src/app/dashboard/create/page.tsx](file:///d:/ToolsLiguns/src/app/dashboard/create/page.tsx)

---

**Plan content around Indonesian holidays perfectly!** 🇮🇩
