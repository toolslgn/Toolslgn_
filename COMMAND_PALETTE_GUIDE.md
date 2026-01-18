# ⌨️ Command Palette - Guide

## Overview

Spotlight-style command palette for instant navigation across dashboard and 20 websites.

---

## 🎯 Features

### Keyboard Shortcuts
- **Mac**: `⌘ + K`
- **Windows/Linux**: `Ctrl + K`
- **Click**: Search button in header

### Search Categories

**Navigation:**
- Go to Dashboard
- Go to Calendar
- Go to Gallery
- Go to Websites
- Go to Social Accounts
- Go to Settings

**Actions:**
- Create New Post

**Websites (Dynamic):**
- Post for [Website Name] (×20)
- Auto-indexed from your websites

---

## 💡 Usage

### Opening
```
Press: Cmd+K or Ctrl+K
Or: Click search button in header
```

### Searching
```
Type: "calendar"
→ Shows "Go to Calendar"

Type: "create"
→ Shows "Create New Post"

Type: "liguns"
→ Shows "Post for Liguns Entertainment"
```

### Selecting
```
↑↓ Arrow keys: Navigate
↵ Enter: Execute
ESC: Close
```

---

## 🔍 Search Algorithm

**Fuzzy Matching:**
- Searches label + keywords
- Case-insensitive
- Instant results

**Example:**
```
Search: "cal"
Matches:
- Go to Calendar (label)
- Go to Calendar (keyword: schedule)
```

---

## 🌐 Dynamic Indexing

**Websites Auto-Indexed:**
```typescript
websites.map(website => ({
  label: `Post for ${website.name}`,
  action: () => router.push(
    `/dashboard/create?website=${website.id}`
  ),
  keywords: [
    website.name.toLowerCase(),
    website.url,
    "post",
    "create"
  ]
}))
```

**Result:**
- 20 websites = 20 instant actions
- Updates when websites added/removed

---

## 🎨 UI Features

**Header Button (Desktop):**
```
[🔍 Search...  ⌘K]
```

**Header Button (Mobile):**
```
[🔍]
```

**Command List:**
- Grouped by category
- Icons for visual scanning
- Keyboard hints in footer

---

## ⚡ Power User Workflows

### Quick Post Creation
```
1. Cmd+K
2. Type: "post liguns"
3. Enter
→ Create Post page, Liguns pre-selected
```

### Fast Navigation
```
1. Cmd+K
2. Type: "gal"
3. Enter
→ Gallery page
```

### Multi-Website Management
```
Search "post" → See all 20 websites
Arrow down → Select target
Enter → Create post
```

---

## 📚 Related Files

- **Component**: [src/components/global-search.tsx](file:///d:/ToolsLiguns/src/components/global-search.tsx)
- **Layout**: [src/app/dashboard/layout.tsx](file:///d:/ToolsLiguns/src/app/dashboard/layout.tsx)

---

**Navigate like a pro!** ⚡
