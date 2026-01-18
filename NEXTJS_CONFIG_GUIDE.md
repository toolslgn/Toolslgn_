# ⚙️ Next.js Configuration - Vercel Optimization

## Overview

Optimized `next.config.mjs` for fast deployment and smooth operation on Vercel.

---

## 🚀 Optimizations

### 1. Standalone Output
```javascript
output: 'standalone'
```

**Benefits:**
- ✅ Optimized Docker container size
- ✅ Faster cold starts on Vercel
- ✅ Reduced deployment bundle size
- ✅ Better performance

---

### 2. Build Error Ignoring
```javascript
typescript: {
  ignoreBuildErrors: true,
},
eslint: {
  ignoreDuringBuilds: true,
}
```

**Why:**
- 🚀 Deploy features immediately
- 🔧 Fix type errors locally at your own pace
- ⚡ Faster iteration in development
- 💡 Personal tool priority: speed over strict types

**Note:** Fix critical errors locally when you have time!

---

### 3. Remote Image Patterns

**Allowed Domains:**

#### Supabase
```javascript
{
  protocol: 'https',
  hostname: '**.supabase.co',
  pathname: '/storage/v1/object/public/**',
}
```
**For:** Post images, website logos, gallery images

#### Facebook CDN
```javascript
{
  hostname: 'scontent.xx.fbcdn.net',
  hostname: 'scontent-*.xx.fbcdn.net',
}
```
**For:** Facebook post images, profile pictures

#### Instagram CDN
```javascript
{
  hostname: 'platform-lookaside.fbsbx.com',
  hostname: 'scontent.cdninstagram.com',
  hostname: 'scontent-*.cdninstagram.com',
}
```
**For:** Instagram media, story images

---

## 🖼️ Image Optimization Benefits

**Next.js Automatic:**
- ✅ WebP/AVIF conversion
- ✅ Responsive sizes
- ✅ Lazy loading
- ✅ CDN caching on Vercel

**Performance:**
- Faster page loads
- Reduced bandwidth
- Better Core Web Vitals

---

## 📚 Configuration Breakdown

### Full Config
```javascript
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // Supabase
      { hostname: '**.supabase.co', ... },
      // Facebook
      { hostname: 'scontent.xx.fbcdn.net', ... },
      // Instagram
      { hostname: 'platform-lookaside.fbsbx.com', ... },
    ],
  },
};

export default withSerwist(nextConfig);
```

---

## 🔍 Troubleshooting

### Image not loading?
**Check:**
1. Domain matches one of the patterns
2. Protocol is HTTPS
3. Check browser console for errors

**Add new domain:**
```javascript
{
  protocol: 'https',
  hostname: 'new-domain.com',
  pathname: '/**',
}
```

### Build errors still fail?
**Verify in `next.config.mjs`:**
```javascript
typescript: { ignoreBuildErrors: true }
eslint: { ignoreDuringBuilds: true }
```

---

## 📚 Related Files

- **Config**: [next.config.mjs](file:///d:/ToolsLiguns/next.config.mjs)

---

**Optimized for speed!** ⚡
