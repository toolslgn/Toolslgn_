# 🎯 Database Schema - Quick Reference

## Visual Schema

![Database Schema Diagram](../../../C:/Users/akung/.gemini/antigravity/brain/fffe847e-61fc-43dd-b0db-07df61472e57/database_schema_diagram_1768741428275.png)

## 📦 Files Created

| File | Purpose |
|------|---------|
| [supabase-schema.sql](file:///d:/ToolsLiguns/supabase-schema.sql) | **Run this in Supabase SQL Editor** |
| [DATABASE_SETUP.md](file:///d:/ToolsLiguns/DATABASE_SETUP.md) | Quick start guide with examples |
| [DATABASE_SCHEMA.md](file:///d:/ToolsLiguns/DATABASE_SCHEMA.md) | Complete documentation |
| [src/types/index.ts](file:///d:/ToolsLiguns/src/types/index.ts) | TypeScript types for type-safe queries |

## ⚡ Quick Setup (3 Steps)

### 1. Run SQL in Supabase
```bash
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of supabase-schema.sql
3. Paste and Run
```

### 2. Update Environment
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Test Connection
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data } = await supabase.from('websites').select('*')
console.log(data) // Should work!
```

## 📊 Tables at a Glance

### `websites` - Your Promoted Websites
```typescript
{
  id: "uuid",
  name: "Beras Polos",
  url: "https://beraspolos.online",
  description: "Rice delivery service"
}
```

### `accounts` - Social Media Credentials
```typescript
{
  id: "uuid",
  platform: "facebook" | "instagram" | "linkedin" | "twitter" | "gmb",
  account_name: "Beras Polos Official",
  access_token: "EAAxxxxx...",
  token_expires_at: "2026-03-20T10:00:00Z"
}
```

### `posts` - Content Master
```typescript
{
  id: "uuid",
  website_id: "uuid",
  caption: "Fresh organic rice delivered! 🌾",
  image_url: "https://supabase.co/storage/.../rice.jpg",
  notes: "Internal notes here"
}
```

### `post_schedules` - Execution Queue
```typescript
{
  id: "uuid",
  post_id: "uuid",
  account_id: "uuid",
  scheduled_at: "2026-12-25T10:00:00Z", // Up to 1 year!
  status: "QUEUED" | "PUBLISHED" | "FAILED" | "CANCELLED",
  platform_post_id: "fb_123456789" // After publishing
}
```

## 🔥 Common Queries

### Get All Websites
```typescript
const { data: websites } = await supabase
  .from('websites')
  .select('*')
  .order('created_at', { ascending: false })
```

### Get Upcoming Posts (Next 7 Days)
```typescript
const nextWeek = new Date()
nextWeek.setDate(nextWeek.getDate() + 7)

const { data: upcoming } = await supabase
  .from('upcoming_posts_view')
  .select('*')
  .gte('scheduled_at', new Date().toISOString())
  .lte('scheduled_at', nextWeek.toISOString())
  .order('scheduled_at', { ascending: true })
```

### Schedule a Post
```typescript
const { data: schedule } = await supabase
  .from('post_schedules')
  .insert({
    user_id: user.id,
    post_id: 'post-uuid',
    account_id: 'account-uuid',
    scheduled_at: '2026-12-25T10:00:00Z',
    status: 'QUEUED'
  })
  .select()
  .single()
```

### Mark Post as Published
```typescript
await supabase
  .from('post_schedules')
  .update({
    status: 'PUBLISHED',
    platform_post_id: 'fb_987654321',
    published_at: new Date().toISOString()
  })
  .eq('id', schedule.id)
```

## 🎨 Built-in Views

### `upcoming_posts_view`
All queued posts with full details (website, account, platform).

### `posts_by_website_view`
Analytics: total/queued/published/failed posts per website.

### `account_stats_view`
Account usage statistics: total scheduled, published, failed, last published.

## 🚀 What's Next?

1. ✅ Database schema is ready
2. 🎨 Build UI components with Shadcn
3. 🔐 Implement OAuth flows for social platforms
4. 📅 Create scheduler dashboard
5. 🤖 Set up Edge Function for automation
6. 📊 Build analytics with the views

## 📚 Full Documentation

- **Quick Start**: [DATABASE_SETUP.md](file:///d:/ToolsLiguns/DATABASE_SETUP.md)
- **Complete Docs**: [DATABASE_SCHEMA.md](file:///d:/ToolsLiguns/DATABASE_SCHEMA.md)
- **SQL Script**: [supabase-schema.sql](file:///d:/ToolsLiguns/supabase-schema.sql)
- **TypeScript Types**: [src/types/index.ts](file:///d:/ToolsLiguns/src/types/index.ts)

---

**Your database is ready to power a professional social media management SaaS! 🎉**
