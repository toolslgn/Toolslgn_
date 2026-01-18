# 🗄️ ToolsLiguns Database Setup Guide

## Quick Start

### 1️⃣ Run the SQL Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **+ New query**
4. Copy the entire contents of [supabase-schema.sql](file:///d:/ToolsLiguns/supabase-schema.sql)
5. Paste into the SQL editor
6. Click **Run** (or press `Ctrl+Enter`)

You should see: `Success. No rows returned`

### 2️⃣ Verify Tables Created

Run this query to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('websites', 'accounts', 'posts', 'post_schedules')
ORDER BY table_name;
```

You should see all 4 tables listed.

### 3️⃣ Update Environment Variables

Copy your Supabase credentials to `.env.local`:

```bash
cp .env.example .env.local
```

Then update `.env.local` with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**
- Go to **Project Settings** → **API**
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📊 Schema Overview

```
┌─────────────┐
│   users     │ (Supabase Auth)
└──────┬──────┘
       │
       ├──────────┬───────────┬─────────────┐
       │          │           │             │
       ▼          ▼           ▼             ▼
┌──────────┐ ┌─────────┐ ┌───────┐ ┌──────────────┐
│ websites │ │accounts │ │ posts │ │post_schedules│
└────┬─────┘ └────┬────┘ └───┬───┘ └──────────────┘
     │            │           │
     └────────────┴───────────┘
         (Foreign Keys)
```

### Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **websites** | Websites you're promoting | `name`, `url` |
| **accounts** | Social media credentials | `platform`, `access_token` |
| **posts** | Content master | `caption`, `image_url` |
| **post_schedules** | Execution queue | `scheduled_at`, `status` |

---

## 🔒 Security Features

### ✅ Row Level Security (RLS)
All tables have RLS enabled. Users can only access their own data.

**How it works:**
```typescript
// ✅ This automatically filters by current user
const { data } = await supabase
  .from('websites')
  .select('*')

// ❌ No need to manually add user_id filter
// Supabase does this automatically via RLS
```

### ✅ Unique Constraints
- Prevents duplicate social accounts per platform
- Constraint: `(user_id, platform, account_id)`

### ✅ Foreign Key Cascades
- Deleting a website → deletes all related posts
- Deleting a post → deletes all related schedules
- Deleting a user → deletes everything (via `ON DELETE CASCADE`)

---

## 📝 Usage Examples

### TypeScript with Supabase Client

```typescript
import { createClient } from '@/lib/supabase/client';
import type { Website, Post, PostSchedule } from '@/types';

const supabase = createClient();

// ✅ Create a website
const { data: website, error } = await supabase
  .from('websites')
  .insert({
    user_id: user.id,
    name: 'Beras Polos',
    url: 'https://beraspolos.online',
    description: 'Premium rice delivery'
  })
  .select()
  .single();

// ✅ Get all websites (automatically filtered by user_id via RLS)
const { data: websites } = await supabase
  .from('websites')
  .select('*')
  .order('created_at', { ascending: false });

// ✅ Create a post with image
const { data: post } = await supabase
  .from('posts')
  .insert({
    user_id: user.id,
    website_id: website.id,
    caption: 'Fresh organic rice! 🌾',
    image_url: 'https://project.supabase.co/storage/v1/object/public/post-images/rice.jpg'
  })
  .select()
  .single();

// ✅ Schedule a post for next week
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const { data: schedule } = await supabase
  .from('post_schedules')
  .insert({
    user_id: user.id,
    post_id: post.id,
    account_id: 'facebook-account-uuid',
    scheduled_at: nextWeek.toISOString(),
    status: 'QUEUED'
  })
  .select()
  .single();

// ✅ Get upcoming posts using the view
const { data: upcoming } = await supabase
  .from('upcoming_posts_view')
  .select('*')
  .gte('scheduled_at', new Date().toISOString())
  .order('scheduled_at', { ascending: true })
  .limit(10);
```

---

## 🎨 Next Steps - Build the UI

### 1. Create Website Management Page
- List all websites
- Add/Edit/Delete websites
- View posts per website

### 2. Create Account Management Page
- Connect social media accounts (OAuth flow)
- View token expiration status
- Refresh expired tokens

### 3. Create Post Composer
- Rich text editor for captions
- Image upload (Supabase Storage)
- Preview before scheduling

### 4. Create Scheduler Dashboard
- Calendar view of scheduled posts
- Drag-and-drop rescheduling
- Bulk scheduling

### 5. Create Analytics Dashboard
- Use the database views:
  - `posts_by_website_view`
  - `account_stats_view`
  - `upcoming_posts_view`

---

## 🤖 Automation Setup

### Option A: Supabase Edge Function (Recommended)

Create a cron job that runs every minute:

```typescript
// supabase/functions/process-schedules/index.ts
import { createClient } from '@supabase/supabase-js'

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Service role bypasses RLS
  )

  // Get queued posts that are due now
  const { data: schedules } = await supabase
    .from('post_schedules')
    .select(`
      *,
      posts (*),
      accounts (*)
    `)
    .eq('status', 'QUEUED')
    .lte('scheduled_at', new Date().toISOString())
    .limit(10)

  for (const schedule of schedules || []) {
    try {
      // TODO: Implement actual posting to social media
      const platformPostId = await postToSocialMedia(
        schedule.accounts.platform,
        schedule.posts.caption,
        schedule.posts.image_url,
        schedule.accounts.access_token
      )

      // Mark as published
      await supabase
        .from('post_schedules')
        .update({
          status: 'PUBLISHED',
          platform_post_id: platformPostId,
          published_at: new Date().toISOString()
        })
        .eq('id', schedule.id)

    } catch (error) {
      // Mark as failed
      await supabase
        .from('post_schedules')
        .update({
          status: 'FAILED',
          error_log: error.message
        })
        .eq('id', schedule.id)
    }
  }

  return new Response('Done')
})
```

**Set up cron:**
```bash
supabase functions deploy process-schedules --project-ref your-project-ref

# Add cron schedule in Supabase dashboard:
# Functions → process-schedules → Settings → Add cron schedule
# Schedule: */1 * * * * (every minute)
```

### Option B: Vercel Cron (Alternative)

Create an API route in Next.js:

```typescript
// app/api/cron/process-schedules/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = await createClient()
  
  // Process schedules...
  
  return NextResponse.json({ success: true })
}
```

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/process-schedules",
    "schedule": "* * * * *"
  }]
}
```

---

## 🛡️ Security Best Practices

### 1. Token Storage
Consider using Supabase Vault for production:

```sql
-- Store tokens in vault instead of plain text
INSERT INTO vault.secrets (name, secret)
VALUES ('facebook_token_user123', 'EAA...');

-- Reference in your table
UPDATE accounts
SET access_token_ref = 'facebook_token_user123'
WHERE id = 'account-uuid';
```

### 2. Environment Variables
Never commit `.env.local` to git. Use these in production:

- `NEXT_PUBLIC_SUPABASE_URL` → Public
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Public (protected by RLS)
- `SUPABASE_SERVICE_ROLE_KEY` → **Private** (use only server-side)

### 3. OAuth Token Refresh
Implement automatic token refresh:

```typescript
async function refreshTokenIfNeeded(account: Account) {
  const expiresAt = new Date(account.token_expires_at!)
  const now = new Date()
  const hoursUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  if (hoursUntilExpiry < 24) {
    // Refresh token logic here
    const newToken = await refreshPlatformToken(account.refresh_token)
    
    await supabase
      .from('accounts')
      .update({
        access_token: newToken.access_token,
        token_expires_at: newToken.expires_at
      })
      .eq('id', account.id)
  }
}
```

---

## 📚 Additional Resources

- **SQL Script**: [supabase-schema.sql](file:///d:/ToolsLiguns/supabase-schema.sql)
- **Documentation**: [DATABASE_SCHEMA.md](file:///d:/ToolsLiguns/DATABASE_SCHEMA.md)
- **TypeScript Types**: [src/types/index.ts](file:///d:/ToolsLiguns/src/types/index.ts)

---

## ✅ Checklist

- [ ] Run SQL schema in Supabase
- [ ] Verify tables were created
- [ ] Update `.env.local` with Supabase credentials
- [ ] Test Supabase client connection
- [ ] Create Storage bucket for images
- [ ] Implement OAuth flows for social platforms
- [ ] Build UI for website management
- [ ] Build UI for post scheduling
- [ ] Set up Edge Function for automation
- [ ] Implement token refresh logic

---

**You're all set! Start building your social media management platform.** 🚀
