# 🖼️ Image Processing Service - Guide

## Overview

Intelligent image processing service that automatically optimizes images for Instagram using the sharp library.

---

## 🎯 Features

### Smart Canvas Processing
- **Detects** invalid aspect ratios (< 4:5 or > 1.91:1)
- **Resizes** to 1:1 square (1080x1080)
- **Preserves** original image (no cropping)
- **Fills** empty space with blurred background

### Background Options
- **Blur** (default) - Blurred version of the image
- **White** - Solid white background
- **Black** - Solid black background

---

## 📊 Instagram Requirements

| Spec | Value |
|------|-------|
| Min Aspect Ratio | 0.8 (4:5 portrait) |
| Max Aspect Ratio | 1.91 (landscape) |
| Ideal Ratio | 1.0 (square) |
| Recommended Size | 1080x1080px |
| Min Resolution | 320px |

---

## 🛠️ Functions

### processImageForInstagram()

**Purpose**: Process image to meet Instagram requirements

```typescript
const result = await processImageForInstagram(
  "https://example.com/image.jpg",
  "blur"  // or "white" | "black"
);

console.log(result.wasProcessed);  // true if processed
console.log(result.buffer);  // Image buffer
console.log(result.metadata.aspectRatio);  // 1.0
```

**Process:**
1. Fetch image from URL
2. Check aspect ratio
3. If invalid → Create 1080x1080 canvas
4. Generate blurred background
5. Overlay resized image (centered)
6. Return processed buffer

---

### getImageMetadata()

**Purpose**: Get image dimensions without processing

```typescript
const metadata = await getImageMetadata(
  "https://example.com/image.jpg"
);

console.log(metadata.width);  // 1920
console.log(metadata.height);  // 1080
console.log(metadata.aspectRatio);  // 1.78
```

---

## 🎨 Processing Examples

### Wide Landscape (2.5:1 → 1:1)
```
Original: 2500x1000
Invalid: 2.5:1 ratio

Processing:
  1. Create 1080x1080 canvas
  2. Blur background of image
  3. Resize image to 1080x432 (fit width)
  4. Center on canvas
  
Result: 1080x1080 with blur bars top/bottom
```

### Tall Portrait (0.5:1 → 1:1)
```
Original: 500x1000
Invalid: 0.5:1 ratio

Processing:
  1. Create 1080x1080 canvas
  2. Blur background
  3. Resize image to 540x1080 (fit height)
  4. Center on canvas

Result: 1080x1080 with blur bars left/right
```

---

## 🔄 Integration

### Auto-Processing in publishToInstagram()

**File**: [src/lib/publish-service.ts](file:///d:/ToolsLiguns/src/lib/publish-service.ts)

```typescript
// Automatic aspect ratio check
const metadata = await getImageMetadata(imageUrl);

if (aspectRatio < 0.8 || aspectRatio > 1.91) {
  // Auto-process with blur background
  const processed = await processImageForInstagram(imageUrl, "blur");
  
  // Upload to Supabase temp-uploads
  await supabase.storage.from("temp-uploads").upload(...);
  
  // Use processed image URL
  finalImageUrl = processedUrl;
}
```

**Benefits:**
- No manual image preparation needed
- Posts never fail due to aspect ratio
- Professional-looking backgrounds

---

## 📦 Supabase Storage

### temp-uploads Bucket

**Purpose**: Store processed images temporarily

**Structure**:
```
temp-uploads/
  └── [user-id]/
      ├── 1737297840123-instagram-processed.jpg
      ├── 1737298940456-instagram-processed.jpg
      └── ...
```

**RLS Policy:**
```sql
CREATE POLICY "Users can upload temp files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'temp-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 🧪 Testing

### Test Processing
```typescript
import { processImageForInstagram } from '@/lib/image-processor';

// Test with wide image
const result = await processImageForInstagram(
  "https://picsum.photos/2000/800",  // 2.5:1
  "blur"
);

console.log(`Processed: ${result.wasProcessed}`);  // true
console.log(`New ratio: ${result.metadata.aspectRatio}`);  // 1.0
```

### Visual Comparison
```typescript
// Original: 2000x800 landscape
// Processed: 1080x1080 square
//   - Center: 1080x432 resized image
//   - Top/Bottom: Blurred background fill
```

---

## ⚙️ Configuration

### Background Style

```typescript
// Blurred (default) - Best looking
processImageForInstagram(url, "blur")

// White - Clean, minimal  
processImageForInstagram(url, "white")

// Black - Dark, dramatic
processImageForInstagram(url, "black")
```

### Quality Settings

In `image-processor.ts`:
```typescript
.jpeg({ quality: 90 })  // 90% quality
.blur(50)  // Heavy blur
.modulate({ brightness: 0.7 })  // 70% brightness
```

---

## 📚 Related Files

- **Image Processor**: [src/lib/image-processor.ts](file:///d:/ToolsLiguns/src/lib/image-processor.ts)
- **Publishing Service**: [src/lib/publish-service.ts](file:///d:/ToolsLiguns/src/lib/publish-service.ts)
- **Publishing Guide**: [PUBLISHING_GUIDE.md](file:///d:/ToolsLiguns/PUBLISHING_GUIDE.md)

---

**Automatic image processing ensures all Instagram posts meet platform requirements!** 🖼️
