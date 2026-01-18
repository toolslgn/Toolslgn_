# 🔐 Security & Authentication Setup Guide

## Overview

ToolsLiguns is now protected with enterprise-grade security:

1. **SEO Blocking** - Prevents search engine indexing
2. **Email Whitelist** - Only authorized emails can access
3. **Middleware Protection** - Guards all /dashboard routes
4. **Clean Login** - Mobile-friendly authentication

---

## 🚨 Important: Update Admin Email

### 1. Edit `middleware.ts`

**File**: [middleware.ts](file:///d:/ToolsLiguns/middleware.ts)

```typescript
// Line 5-8: Replace with YOUR email
const ADMIN_EMAILS = [
  "your-actual-email@gmail.com",  // ⚠️ CHANGE THIS
  // Add more emails if needed
];
```

**Example:**
```typescript
const ADMIN_EMAILS = [
  "akung@example.com",
  "admin@toolsliguns.com",
];
```

---

## 🔒 How Security Works

### 1. SEO Blocking

**File**: [src/app/layout.tsx](file:///d:/ToolsLiguns/src/app/layout.tsx)

```typescript
export const metadata: Metadata = {
  robots: {
    index: false,        // Don't index pages
    follow: false,       // Don't follow links
    nocache: true,       // Don't cache
    googleBot: {
      index: false,
      noimageindex: true,
    },
  },
};
```

**Effect**: Google and other search engines will NOT index your app.

---

### 2. Middleware Protection

**File**: [middleware.ts](file:///d:/ToolsLiguns/middleware.ts)

**Flow:**
```
1. User visits /dashboard/* route
2. Middleware checks authentication
3. If NOT logged in → Redirect to /login
4. If logged in BUT email NOT in whitelist → Sign out + /unauthorized
5. If logged in AND email in whitelist → Allow access
```

**Protected Routes:**
- `/dashboard`
- `/dashboard/websites`
- `/dashboard/accounts`
- `/dashboard/create`
- `/dashboard/calendar`
- `/dashboard/settings`

**Public Routes:**
- `/login`
- `/unauthorized`
- `/` (home page)

---

### 3. Login Page

**File**: [src/app/login/page.tsx](file:///d:/ToolsLiguns/src/app/login/page.tsx)

**Features:**
- ✅ Email/Password authentication
- ✅ Supabase Auth integration
- ✅ Mobile-friendly (large inputs, big button)
- ✅ Loading states
- ✅ Toast notifications
- ✅ Redirect to requested page after login
- ❌ NO signup link (private tool)

**Access:**
`http://localhost:3000/login`

---

### 4. Unauthorized Page

**File**: [src/app/unauthorized/page.tsx](file:///d:/ToolsLiguns/src/app/unauthorized/page.tsx)

**Features:**
- Auto signs out user
- Clear error message
- Link back to login
- Professional design

**When Shown:**
- Email not in `ADMIN_EMAILS` whitelist
- After automatic sign-out

---

## ✅ Setup Checklist

### 1. Update Email Whitelist
```bash
# Edit middleware.ts
const ADMIN_EMAILS = ["your-email@example.com"];
```

### 2. Create User in Supabase

Go to Supabase Dashboard → **Authentication** → **Users** → **Add User**

**Important:**
- Email MUST match the email in `ADMIN_EMAILS`
- Set a strong password
- Enable email confirmation (optional)

### 3. Test Login Flow

1. Visit `http://localhost:3000/dashboard`
2. Should redirect to `/login`
3. Enter your email and password
4. Click "Sign In"
5. Should redirect to `/dashboard`

### 4. Test Whitelist Protection

1. Create a test user with different email
2. Try to log in
3. Should see "Access Denied" page
4. User should be automatically signed out

---

## 🧪 Testing

### Valid User (Whitelisted)
```
Email: your-email@example.com
Password: your-password
Expected: Login successful → /dashboard
```

### Invalid User (Not Whitelisted)
```
Email: unauthorized@example.com
Password: any-password
Expected: Login → Auto sign out → /unauthorized
```

### Not Authenticated
```
Visit: /dashboard
Expected: Redirect to /login
```

---

## 🔐 Security Best Practices

### 1. Strong Passwords
- Minimum 12 characters
- Mix of letters, numbers, symbols
- Use a password manager

### 2. Email Confirmation
Enable in Supabase Dashboard:
- Authentication → Providers → Email
- ✅ Enable email confirmations

### 3. Environment Variables
Never commit:
```
# .env.local (already in .gitignore)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 4. HTTPS in Production
Always use HTTPS:
- Vercel: Automatic
- Custom domain: Use SSL certificate

### 5. Session Management
Sessions expire after:
- Default: 1 hour (refresh token valid for 60 days)
- Configure in Supabase Dashboard

---

## 🚨 Troubleshooting

### "Access Denied" after login
**Cause**: Email not in whitelist  
**Fix**: Add email to `ADMIN_EMAILS` in `middleware.ts`

### Redirect loop
**Cause**: Middleware configuration issue  
**Fix**: Check `matcher` config in `middleware.ts`

### "Invalid login credentials"
**Cause**: Wrong email/password  
**Fix**: 
- Check Supabase Dashboard → Users
- Reset password if needed
- Verify email confirmation

### Login works but still redirects
**Cause**: Cookie/session issue  
**Fix**: 
- Clear browser cookies
- Check browser console for errors
- Restart dev server

---

## 📱 Mobile Login Design

The login page is optimized for mobile:
- ✅ Large inputs (`h-12`)
- ✅ Large button (`h-12`)
- ✅ Clear labels (`text-base`)
- ✅ Responsive layout
- ✅ Touch-friendly spacing
- ✅ Auto-focus on email field

---

## 🔒 Additional Security (Future)

### Multi-Factor Authentication (MFA)
```typescript
// Enable in Supabase Dashboard
// Authentication → Providers → Phone
```

### IP Whitelist
```typescript
// Add to middleware.ts
const ALLOWED_IPS = ["your.ip.address"];
```

### Rate Limiting
```typescript
// Use upstash/ratelimit package
import { Ratelimit } from "@upstash/ratelimit";
```

---

## 📚 Related Files

- **Middleware**: [middleware.ts](file:///d:/ToolsLiguns/middleware.ts)
- **Login Page**: [src/app/login/page.tsx](file:///d:/ToolsLiguns/src/app/login/page.tsx)
- **Unauthorized**: [src/app/unauthorized/page.tsx](file:///d:/ToolsLiguns/src/app/unauthorized/page.tsx)
- **Layout (SEO)**: [src/app/layout.tsx](file:///d:/ToolsLiguns/src/app/layout.tsx)

---

**Your app is now secure with email whitelist protection! 🔐**

**⚠️ CRITICAL: Update `ADMIN_EMAILS` in `middleware.ts` before deploying!**
