# 📤 Publishing Service - Implementation Guide

## Overview

Complete social media publishing logic for Facebook Pages and Instagram Business accounts.

---

## 🎯 Functions Implemented

### 1. publishToFacebookPage()

**Purpose**: Publish photo or text posts to Facebook Pages

**Parameters:**
- `accessToken` - Page access token
- `pageId` - Facebook Page ID
- `caption` - Post message/caption
- `imageUrl` - (Optional) Image URL

**Endpoints:**
- Photo: `POST /{page-id}/photos`
- Text: `POST /{page-id}/feed`

**Example:**
```typescript
const result = await publishToFacebookPage(
  pageToken,
  "123456789",
  "Check out our latest product!",
  "https://example.com/image.jpg"
);

if (result.success) {
  console.log("Posted! ID:", result.postId);
}
```

---

### 2. publishToInstagram()

**Purpose**: Publish photo posts to Instagram (2-step process)

**Parameters:**
- `accessToken` - Page access token
- `igUserId` - Instagram Business Account ID
- `caption` - Post caption
- `imageUrl` - Image URL (required)

**Process:**

**Step 1: Create Container**
```
POST /{ig-user-id}/media
Body: { image_url, caption, access_token }
Returns: { id: "creation_id" }
```

**Step 2: Publish Container**
```
POST /{ig-user-id}/media_publish
Body: { creation_id, access_token }
Returns: { id: "post_id" }
```

**Example:**
```typescript
const result = await publishToInstagram(
  pageToken,
  "17841234567890",
  "New product launch! 🚀 #business",
  "https://example.com/square-image.jpg"
);
```

---

### 3. publishToMultiplePlatforms()

**Purpose**: Publish to multiple platforms simultaneously

**Example:**
```typescript
const results = await publishToMultiplePlatforms([
  {
    platform: "facebook",
    accessToken: fbToken,
    accountId: pageId,
    caption: "My post",
    imageUrl: imageUrl
  },
  {
    platform: "instagram",
    accessToken: igToken,
    accountId: igUserId,
    caption: "My post",
    imageUrl: imageUrl
  }
]);

// Check results
results.forEach((result, i) => {
  console.log(`Platform ${i}: ${result.success ? 'Success' : result.error}`);
});
```

---

## 🚨 Error Handling

### Common Facebook Errors

| Error | Message Shown | Fix |
|-------|---------------|-----|
| Ratio error | "Image ratio not supported" | Use 1.91:1 to 4:5 ratio |
| OAuthException | "Authentication expired" | Reconnect account |
| Permissions | "Insufficient permissions" | Request more permissions |

### Common Instagram Errors

| Error | Message Shown | Fix |
|-------|---------------|-----|
| Aspect ratio | "Must be between 4:5 and 1.91:1" | Resize image |
| Resolution | "Min 320px, recommended 1080px" | Use higher resolution |
| URL error | "Must be publicly accessible" | Check image URL |
| Business account | "Must be Business or Creator" | Convert account type |

---

## 📏 Image Requirements

### Facebook

- **Formats**: JPG, PNG, GIF
- **Min size**: 200x200px
- **Max size**: 2048x2048px
- **Aspect ratio**: Flexible (recommended 1.91:1)
- **File size**: Max 4MB

### Instagram

- **Formats**: JPG, PNG
- **Min size**: 320x320px
- **Recommended**: 1080x1080px (square) or 1080x1350px (portrait)
- **Aspect ratio**: 4:5 to 1.91:1
- **File size**: Max 8MB

---

## 🧪 Testing

### Test Facebook Publishing

```typescript
import { publishToFacebookPage } from '@/lib/publish-service';

const result = await publishToFacebookPage(
  "EAAxxxx...",  // Page token
  "123456789",   // Page ID
  "Test post from ToolsLiguns!",
  "https://picsum.photos/1200/630"  // Test image
);

console.log(result);
// { success: true, postId: "123_456" }
```

### Test Instagram Publishing

```typescript
import { publishToInstagram } from '@/lib/publish-service';

const result = await publishToInstagram(
  "EAAxxxx...",  // Page token
  "17841234567890",  // IG User ID
  "Test post! #test",
  "https://picsum.photos/1080/1080"  // Square image
);

console.log(result);
// { success: true, postId: "17841..." }
```

---

## 📝 Usage in Server Action

```typescript
// In schedulePost server action
import { publishToFacebookPage, publishToInstagram } from '@/lib/publish-service';

// Fetch scheduled post
const post = await getScheduledPost(scheduleId);

// Fetch account details
const account = await getAccount(accountId);

// Publish based on platform
let result;
if (account.platform === "facebook") {
  result = await publishToFacebookPage(
    account.access_token,
    account.account_id,
    post.caption,
    post.image_url
  );
} else if (account.platform === "instagram") {
  result = await publishToInstagram(
    account.access_token,
    account.account_id,
    post.caption,
    post.image_url!
  );
}

// Update schedule status
if (result.success) {
  await updateScheduleStatus(scheduleId, "PUBLISHED", result.postId);
} else {
  await updateScheduleStatus(scheduleId, "FAILED", null, result.error);
}
```

---

## ⏱️ Instagram Timing

Instagram container creation is asynchronous:

1. Create container → Returns creation_id
2. Wait 2-5 seconds for processing
3. Publish container → Returns post_id

**Current Implementation**: 2-second wait

**Advanced**: Check container status before publishing:
```typescript
const status = await checkInstagramContainerStatus(token, creationId);
if (status.status_code === "FINISHED") {
  // Ready to publish
}
```

---

## 🔐 Security

- Never expose access tokens to client
- All publishing happens server-side
- Tokens stored encrypted in Supabase
- Check token expiry before publishing

---

## 📚 Related Files

- **Publishing Service**: [src/lib/publish-service.ts](file:///d:/ToolsLiguns/src/lib/publish-service.ts)
- **Meta Auth**: [src/lib/meta-auth.ts](file:///d:/ToolsLiguns/src/lib/meta-auth.ts)
- **OAuth Flow**: [OAUTH_FLOW_GUIDE.md](file:///d:/ToolsLiguns/OAUTH_FLOW_GUIDE.md)

---

**Publishing service ready! Integrate with scheduled posts to auto-publish.** 📤
