# 🎨 Platform Preview Guide

## Overview

Pixel-perfect previews showing exactly how your posts will look on each platform.

---

## 🖼️ Preview Components

### Instagram Preview
**Features:**
- Authentic header with avatar
- Square image aspect ratio (1:1)
- Action buttons (heart, comment, send, bookmark)
- Caption with "... more" truncation after 80 chars
- Like count & timestamp

### Facebook Preview
**Features:**
- Page header with avatar & globe icon
- Flexible image aspect ratio
- Reaction emojis (👍❤️)
- Like/Comment/Share buttons
- Stats (1.2K likes, 42 comments, 18 shares)

### Twitter Preview
**Features:**
- Round profile avatar
- Username & handle
- Tweet text with proper wrapping
- Rounded image borders
- Actions (reply, retweet, like, views, share)
- Hover effects (blue, green, pink)

---

## 🔄 Dynamic Switching

### Tab Navigation
```
┌─────────────────────────────┐
│ Instagram │ Facebook │ Twitter│ ← Tabs
├─────────────────────────────┤
│                             │
│   [Instagram Preview]       │
│                             │
└─────────────────────────────┘
```

**Switch platforms** → Preview updates instantly

---

## 😊 Emoji Picker

### Features
- Button in caption textarea (bottom-right)
- Click → Emoji picker opens
- Select emoji → Inserts at cursor
- Cursor repositioned after emoji

### Usage
```
Caption: "Great news! [😊 button]"
         ↓ Click button
         ↓ Select 🎉
Caption: "Great news! 🎉"
```

### Library
- `emoji-picker-react`
- Full emoji support
- Search functionality
- Categories

---

## 📱 Platform Accuracy

### Instagram
- ✅ Square images (1:1)
- ✅ Story-like header
- ✅ Gradient ring avatar
- ✅ Caption truncation
- ✅ Action icons

### Facebook
- ✅ Card-style post
- ✅ Page header
- ✅ Reaction bubbles
- ✅ Three-button actions
- ✅ Stats row

### Twitter/X
- ✅ Tweet layout
- ✅ Username format
- ✅ Rounded images
- ✅ Five action buttons
- ✅ Hover colors

---

## 🎯 Preview Props

```typescript
interface PreviewProps {
  accountName?: string;  // Display name
  caption: string;       // Post text
  imageUrl?: string;     // Image preview
}
```

**Passed from Create Post Form:**
- Selected account name
- Caption text (live)
- Image preview URL

---

## 📚 Related Files

- **Instagram**: [src/components/previews/instagram-preview.tsx](file:///d:/ToolsLiguns/src/components/previews/instagram-preview.tsx)
- **Facebook**: [src/components/previews/facebook-preview.tsx](file:///d:/ToolsLiguns/src/components/previews/facebook-preview.tsx)
- **Twitter**: [src/components/previews/twitter-preview.tsx](file:///d:/ToolsLiguns/src/components/previews/twitter-preview.tsx)
- **Platform Preview**: [src/components/previews/platform-preview.tsx](file:///d:/ToolsLiguns/src/components/previews/platform-preview.tsx)
- **Emoji Textarea**: [src/components/emoji-textarea.tsx](file:///d:/ToolsLiguns/src/components/emoji-textarea.tsx)

---

**See exactly how your posts will look before publishing!** 🎨
