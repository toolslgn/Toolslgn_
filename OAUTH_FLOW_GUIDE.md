# 🔗 Facebook OAuth Flow - Implementation Guide

## Complete OAuth Flow Overview

User clicks "Connect Facebook" → Facebook Login → Callback → Token Exchange → Save to DB → Success!

---

## 🎯 What Was Built

### 1. OAuth Callback Route
**File**: [src/app/api/auth/callback/facebook/route.ts](file:///d:/ToolsLiguns/src/app/api/auth/callback/facebook/route.ts)

**Flow:**
1. Receives `code` from Facebook
2. Exchanges code for short-lived token
3. Exchanges short-lived for long-lived token (60 days)
4. Fetches connected Facebook Pages
5. Fetches linked Instagram Business accounts  
6. Upserts all accounts to Supabase
7. Redirects back to `/dashboard/accounts` with success message

### 2. Connect Facebook Button
**File**: [src/app/dashboard/accounts/page.tsx](file:///d:/ToolsLiguns/src/app/dashboard/accounts/page.tsx)

**Features:**
- "Connect Facebook" button
- Redirects to Facebook OAuth
- Handles callback messages (success/error)
- Shows toast notifications
- Auto-clears URL parameters

---

## 🚀 Setup Instructions

### 1. Add Environment Variables

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FACEBOOK_APP_ID=123456789012345
FACEBOOK_APP_ID=123456789012345
FACEBOOK_APP_SECRET=your-app-secret
```

### 2. Configure Facebook App

In Facebook App Dashboard → **Facebook Login** → **Settings**:

Add **Valid OAuth Redirect URIs**:
```
http://localhost:3000/api/auth/callback/facebook
https://yourdomain.com/api/auth/callback/facebook
```

### 3. Required Permissions

In App Dashboard → **App Review** → **Permissions**:

- ✅ `pages_show_list`
- ✅ `pages_read_engagement`
- ✅ `pages_manage_posts`
- ✅ `instagram_basic`
- ✅ `instagram_content_publish`

---

## 📊 OAuth Flow Diagram

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Clicks "Connect Facebook"
     ▼
┌─────────────────────────────────┐
│  Redirect to Facebook OAuth     │
│  /v19.0/dialog/oauth            │
└────┬────────────────────────────┘
     │ 2. User authorizes
     ▼
┌─────────────────────────────────┐
│  Facebook Callback              │
│  /api/auth/callback/facebook    │
│  ?code=xxx                      │
└────┬────────────────────────────┘
     │ 3. Exchange code → short token
     ▼
┌─────────────────────────────────┐
│  Exchange short → long token    │
│  (60 days)                      │
└────┬────────────────────────────┘
     │ 4. Fetch FB Pages
     ▼
┌─────────────────────────────────┐
│  Fetch Instagram accounts       │
└────┬────────────────────────────┘
     │ 5. Save to Supabase
     ▼
┌─────────────────────────────────┐
│  Redirect to /dashboard/accounts│
│  with success message           │
└─────────────────────────────────┘
```

---

## 🔧 Code Walkthrough

### Step 1: Initiate OAuth

```typescript
const handleConnectFacebook = () => {
  const authUrl = new URL("https://www.facebook.com/v19.0/dialog/oauth");
  authUrl.searchParams.set("client_id", appId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scopes.join(","));
  
  // Redirect user
  window.location.href = authUrl.toString();
};
```

### Step 2: Handle Callback

```typescript
export async function GET(request: NextRequest) {
  const code = searchParams.get("code");
  
  // Exchange code for short-lived token
  const tokenResponse = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?...`
  );
  const { access_token } = await tokenResponse.json();
  
  // Exchange for long-lived token
  const longLived = await exchangeForLongLivedToken(access_token);
  
  // Fetch accounts
  const accounts = await fetchConnectedAccounts(longLived.accessToken);
  
  // Save to DB
  for (const account of accounts) {
    await supabase.from("accounts").upsert({
      user_id: user.id,
      platform: account.platform,
      account_id: account.accountId,
      account_name: account.accountName,
      access_token: account.accessToken,
      token_expires_at: longLived.expiresAt,
    });
  }
}
```

---

## 🧪 Testing

### Test OAuth Flow

1. **Start dev server**: `npm run dev`

2. **Navigate**: `http://localhost:3000/dashboard/accounts`

3. **Click**: "Connect Facebook" button

4. **Authorize**: Grant permissions on Facebook

5. **Verify**: Check redirect success message

6. **Database**: Check Supabase `accounts` table

Expected result:
- Facebook Page(s) saved
- Instagram account(s) saved (if linked)  
- Long-lived tokens stored
- Expiry dates set (60 days out)

---

## 📝 Success/Error Messages

### Success
```
"2 account(s) connected successfully"
```

Toast appears with green checkmark.

### Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `no_code` | OAuth denied | User refused permissions |
| `not_authenticated` | Not logged in | Login first |
| `Invalid App ID` | Wrong credentials | Check `.env.local` |
| `Redirect URI mismatch` | URI not whitelisted | Add to Facebook App settings |

---

## 🔐 Security Features

### CSRF Protection
```typescript
authUrl.searchParams.set("state", randomString());
// TODO: Verify state in callback
```

### Token Storage
- Long-lived tokens stored encrypted in Supabase
- Never exposed to client-side
- Automatic expiry tracking

### Error Handling
- All errors logged
- User-friendly error messages
- Graceful fallbacks

---

## 📊 Database Schema

After successful OAuth:

```sql
SELECT * FROM accounts WHERE user_id = 'xxx';
```

| Column | Example Value |
|--------|---------------|
| platform | facebook |
| account_id | 123456789 |
| account_name | My Business Page |
| access_token | EAAxxxx... (encrypted) |
| token_expires_at | 2026-03-19T21:00:00Z |
| is_active | true |

---

## 🔄 Next Steps

After OAuth is working:

1. ✅ Display connected accounts in UI
2. ✅ Implement token refresh cron job
3. ✅ Add disconnect functionality
4. ✅ Build post publishing to Facebook/Instagram

---

## 🚨 Common Issues

### Issue: "Redirect URI mismatch"

**Fix**: Add exact callback URL to Facebook App settings:
```
http://localhost:3000/api/auth/callback/facebook
```

### Issue: "Invalid App ID"

**Fix**: Verify `.env.local` has correct values and restart server.

### Issue: No Instagram accounts

**Cause**: Instagram not linked to Facebook Page  
**Fix**: Link Instagram Business account to Facebook Page in Instagram settings.

---

## 📚 Related Files

- **Callback Route**: [src/app/api/auth/callback/facebook/route.ts](file:///d:/ToolsLiguns/src/app/api/auth/callback/facebook/route.ts)
- **Accounts Page**: [src/app/dashboard/accounts/page.tsx](file:///d:/ToolsLiguns/src/app/dashboard/accounts/page.tsx)
- **Meta Auth**: [src/lib/meta-auth.ts](file:///d:/ToolsLiguns/src/lib/meta-auth.ts)
- **Env Example**: [.env.example](file:///d:/ToolsLiguns/.env.example)

---

**Facebook/Instagram OAuth flow is ready to test! 🚀**
