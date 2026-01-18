# 🖼️ Media Gallery - Guide

## Overview

Centralized media gallery for managing and reusing images across all 20 websites without re-uploading.

---

## 🎯 Features

### Gallery Page
- **Grid Layout**: 3 cols (mobile), 6 cols (desktop)
- **Image Preview**: Next/Image with lazy loading
- **Delete Management**: Remove old images
- **Storage Stats**: Total images & size

### Integration
- **Select from Gallery**: Button in Create Post
- **Modal Selector**: Grid view of all images
- **Instant Reuse**: No re-upload needed

---

## 📝 Gallery Page

**Location**: `/dashboard/gallery`

### Features
- Browse all uploaded images
- See file sizes
- Delete unused images
- Upload new (redirects to Create)

### Layout
```
Mobile (< md):  [img] [img] [img]
                [img] [img] [img]

Desktop (≥ lg): [img] [img] [img] [img] [img] [img]
                [img] [img] [img] [img] [img] [img]
```

### Delete Flow
1. Hover over image → Delete button appears
2. Click delete → Confirmation dialog
3. Confirm → Image removed from storage

---

## 🔄 Create Post Integration

### Before
```
Upload Image
[Drag & Drop Area]
```

### After
```
Upload Image
[Drag & Drop Area]

--- OR ---

[Select from Gallery] Button
```

### Selection Flow
1. Click "Select from Gallery"
2. Modal opens with grid of images
3. Click image to select (checkmark appears)
4. Click "Select Image" button
5. Image appears in form preview

---

## 💾 Storage Management

### Bucket
```
post-images/
  ├── user-id/timestamp-1.jpg
  ├── user-id/timestamp-2.jpg
  └── ...
```

### Benefits
- **No Duplicates**: Reuse same image 20x
- **Storage Savings**: Upload once, use everywhere
- **Easy Management**: Delete from one place

---

## 🖼️ Image Optimization

### Next/Image Features
- **Automatic Optimization**: WebP conversion
- **Lazy Loading**: Load images on scroll
- **Responsive Sizing**: Optimized per device
- **Caching**: Browser & CDN cache

### Sizes Configuration
```typescript
sizes="(max-width: 768px) 33vw, 16vw"
```

Desktop: 16% viewport width  
Mobile: 33% viewport width

---

## 🧪 Example Usage

### Scenario: Post to 5 Websites
**Without Gallery:**
1. Upload image 5 times
2. Each upload = new storage
3. Total: 5 × file size

**With Gallery:**
1. Upload once → Gallery
2. Select from gallery 5x
3. Total: 1 × file size ✅

**Storage Saved**: 80%!

---

## 📊 Gallery Stats

**Display:**
- Total Images: 42
- Total Size: 127.3 MB

**Calculated in real-time from storage**

---

## 🗑️ Deletion

### Confirmation Dialog
```
Delete Image?
[Image Preview]

This will permanently delete...
Cannot be undone.

[Cancel] [Delete]
```

### Safety
- Preview shown before delete
- Confirmation required
- Instant state update

---

## 📚 Related Files

- **Gallery Page**: [src/app/dashboard/gallery/page.tsx](file:///d:/ToolsLiguns/src/app/dashboard/gallery/page.tsx)
- **Gallery Selector**: [src/components/gallery-selector.tsx](file:///d:/ToolsLiguns/src/components/gallery-selector.tsx)
- **Create Post**: [src/app/dashboard/create/page.tsx](file:///d:/ToolsLiguns/src/app/dashboard/create/page.tsx)

---

**Reuse images efficiently across all websites!** 🖼️
