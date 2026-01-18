# 🎯 TypeScript Database Types - Complete Guide

## 📦 File: `src/types/database.ts`

This file contains **strict TypeScript interfaces** that perfectly align with your Supabase database schema.

## 🔧 Type-Safe Supabase Client

Your Supabase clients are now fully type-safe:

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient() // ✅ Returns typed client

// TypeScript now knows ALL your tables, columns, and types!
const { data } = await supabase.from('websites').select('*')
// ✅ `data` is automatically typed as Website[]
```

---

## 📋 Core Types

### 1. Platform (Union Type)

```typescript
type Platform = 
  | 'facebook' 
  | 'instagram' 
  | 'linkedin' 
  | 'twitter' 
  | 'gmb' 
  | 'tiktok' 
  | 'youtube' 
  | 'pinterest';
```

**Usage:**
```typescript
const platform: Platform = 'facebook' // ✅ Valid
const invalid: Platform = 'reddit'    // ❌ TypeScript error!
```

### 2. ScheduleStatus (Union Type)

```typescript
type ScheduleStatus = 
  | 'QUEUED' 
  | 'PUBLISHED' 
  | 'FAILED' 
  | 'CANCELLED';
```

**Usage:**
```typescript
const status: ScheduleStatus = 'QUEUED' // ✅ Valid
const invalid: ScheduleStatus = 'PENDING' // ❌ TypeScript error!
```

---

## 📊 Table Interfaces

### `Website`

```typescript
interface Website {
  id: string;
  user_id: string;
  name: string;
  url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}
```

**Insert Type:**
```typescript
interface WebsiteInsert {
  id?: string;                    // Optional (auto-generated)
  user_id: string;                // Required
  name: string;                   // Required
  url: string;                    // Required
  description?: string | null;    // Optional
  created_at?: string;            // Optional (auto-generated)
  updated_at?: string;            // Optional (auto-generated)
}
```

**Update Type:**
```typescript
interface WebsiteUpdate {
  name?: string;
  url?: string;
  description?: string | null;
  updated_at?: string;
}
```

---

### `Account`

```typescript
interface Account {
  id: string;
  user_id: string;
  platform: Platform;
  account_name: string;
  account_id: string;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

**Insert Type:**
```typescript
interface AccountInsert {
  id?: string;
  user_id: string;
  platform: Platform;              // ✅ Type-safe platform
  account_name: string;
  account_id: string;
  access_token: string;
  refresh_token?: string | null;
  token_expires_at?: string | null;
  is_active?: boolean;             // Defaults to true
  created_at?: string;
  updated_at?: string;
}
```

---

### `Post`

```typescript
interface Post {
  id: string;
  user_id: string;
  website_id: string;
  caption: string;
  image_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
```

**Insert Type:**
```typescript
interface PostInsert {
  id?: string;
  user_id: string;
  website_id: string;              // Foreign key to websites
  caption: string;
  image_url?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}
```

---

### `PostSchedule`

```typescript
interface PostSchedule {
  id: string;
  user_id: string;
  post_id: string;
  account_id: string;
  scheduled_at: string;
  status: ScheduleStatus;
  platform_post_id: string | null;
  error_log: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
```

**Insert Type:**
```typescript
interface PostScheduleInsert {
  id?: string;
  user_id: string;
  post_id: string;                 // Foreign key to posts
  account_id: string;              // Foreign key to accounts
  scheduled_at: string;            // ISO 8601 timestamp
  status?: ScheduleStatus;         // Defaults to 'QUEUED'
  platform_post_id?: string | null;
  error_log?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
```

---

## 👀 View Types

### `UpcomingPostView`

```typescript
interface UpcomingPostView {
  id: string;
  scheduled_at: string;
  status: ScheduleStatus;
  platform_post_id: string | null;
  published_at: string | null;
  caption: string;
  image_url: string | null;
  website_name: string;
  website_url: string;
  platform: Platform;
  account_name: string;
  user_id: string;
}
```

**Query:**
```typescript
const { data } = await supabase
  .from('upcoming_posts_view')
  .select('*')
  .gte('scheduled_at', new Date().toISOString())

// ✅ `data` is typed as UpcomingPostView[]
```

### `PostsByWebsiteView`

```typescript
interface PostsByWebsiteView {
  website_id: string;
  website_name: string;
  website_url: string;
  total_posts: number;
  queued_posts: number;
  published_posts: number;
  failed_posts: number;
  user_id: string;
}
```

### `AccountStatsView`

```typescript
interface AccountStatsView {
  account_id: string;
  platform: Platform;
  account_name: string;
  is_active: boolean;
  total_scheduled: number;
  total_published: number;
  total_failed: number;
  last_published_at: string | null;
  user_id: string;
}
```

---

## 🔗 Joined/Related Types

### `PostWithWebsite`

```typescript
interface PostWithWebsite extends Post {
  website: Website;
}
```

**Query:**
```typescript
const { data } = await supabase
  .from('posts')
  .select('*, website:websites(*)')
  
// ✅ Returns posts with nested website data
```

### `PostScheduleWithDetails`

```typescript
interface PostScheduleWithDetails extends PostSchedule {
  post: Post;
  account: Account;
  website: Website;
}
```

**Query:**
```typescript
const { data } = await supabase
  .from('post_schedules')
  .select(`
    *,
    post:posts(*),
    account:accounts(*),
    website:posts(website:websites(*))
  `)
```

---

## 💡 Usage Examples

### Example 1: Create a Website (Type-Safe)

```typescript
import { createClient } from '@/lib/supabase/client'
import type { WebsiteInsert, Website } from '@/types/database'

const supabase = createClient()

const newWebsite: WebsiteInsert = {
  user_id: user.id,
  name: 'Beras Polos',
  url: 'https://beraspolos.online',
  description: 'Premium rice delivery'
}

const { data, error } = await supabase
  .from('websites')
  .insert(newWebsite)
  .select()
  .single()

if (data) {
  console.log(data.name) // ✅ TypeScript knows `name` exists
  console.log(data.invalid) // ❌ TypeScript error!
}
```

### Example 2: Schedule a Post

```typescript
import type { PostScheduleInsert, ScheduleStatus } from '@/types/database'

const schedule: PostScheduleInsert = {
  user_id: user.id,
  post_id: 'post-uuid',
  account_id: 'account-uuid',
  scheduled_at: new Date('2026-12-25T10:00:00Z').toISOString(),
  status: 'QUEUED' // ✅ Type-safe status
}

const { data } = await supabase
  .from('post_schedules')
  .insert(schedule)
  .select()
  .single()
```

### Example 3: Update Schedule Status

```typescript
import type { ScheduleStatus } from '@/types/database'

const newStatus: ScheduleStatus = 'PUBLISHED'

await supabase
  .from('post_schedules')
  .update({ 
    status: newStatus,
    platform_post_id: 'fb_123456',
    published_at: new Date().toISOString()
  })
  .eq('id', 'schedule-uuid')
```

### Example 4: Filter by Platform

```typescript
import type { Platform } from '@/types/database'

const platform: Platform = 'instagram'

const { data } = await supabase
  .from('upcoming_posts_view')
  .select('*')
  .eq('platform', platform) // ✅ Type-safe
```

---

## 🚀 Advanced: Full Type Safety

### Type-Safe Database Schema

```typescript
import type { Database } from '@/types/database'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient<Database>(url, key)

// Now ALL queries are fully type-safe!
```

### Generic Database Response

```typescript
import type { DatabaseResponse } from '@/types/database'

async function getWebsites(): Promise<DatabaseResponse<Website[]>> {
  const { data, error } = await supabase
    .from('websites')
    .select('*')
  
  return { data, error }
}
```

---

## 📚 Complete Examples

See [src/lib/supabase/examples.ts](file:///d:/ToolsLiguns/src/lib/supabase/examples.ts) for 15+ real-world usage examples including:

1. ✅ Create a website
2. ✅ Get all websites
3. ✅ Add social media account
4. ✅ Create a post
5. ✅ Schedule a post
6. ✅ Get upcoming posts
7. ✅ Update schedule status
8. ✅ Filter by platform
9. ✅ Get posts by status
10. ✅ Get account statistics
11. ✅ Bulk schedule posts
12. ✅ Cancel scheduled post
13. ✅ Get expiring tokens
14. ✅ And more...

---

## 🎯 Benefits of Type Safety

### ✅ Autocomplete

TypeScript autocompletes table names, columns, and values:

```typescript
const { data } = await supabase
  .from('we...')  // ✅ Autocompletes to 'websites'
  .select('na...) // ✅ Autocompletes to 'name'
```

### ✅ Compile-Time Errors

Catch mistakes before runtime:

```typescript
// ❌ TypeScript error: 'invalid_table' doesn't exist
const { data } = await supabase.from('invalid_table').select('*')

// ❌ TypeScript error: 'invalid_column' doesn't exist
const { data } = await supabase.from('websites').select('invalid_column')

// ❌ TypeScript error: 'reddit' is not a valid Platform
const platform: Platform = 'reddit'
```

### ✅ Refactoring Safety

Change a column name in the database? TypeScript will show all places that need updating.

---

## 🔄 Keeping Types in Sync

### Option 1: Manual Updates
When you change the SQL schema, update `src/types/database.ts` manually.

### Option 2: Auto-Generate (Recommended)
Use Supabase CLI to auto-generate types:

```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.generated.ts
```

Then import into your `database.ts`:

```typescript
export * from './database.generated'
export type { Platform, ScheduleStatus } // Your custom types
```

---

## 📖 Related Files

- **SQL Schema**: [supabase-schema.sql](file:///d:/ToolsLiguns/supabase-schema.sql)
- **Type Definitions**: [src/types/database.ts](file:///d:/ToolsLiguns/src/types/database.ts)
- **Usage Examples**: [src/lib/supabase/examples.ts](file:///d:/ToolsLiguns/src/lib/supabase/examples.ts)
- **Client (Browser)**: [src/lib/supabase/client.ts](file:///d:/ToolsLiguns/src/lib/supabase/client.ts)
- **Client (Server)**: [src/lib/supabase/server.ts](file:///d:/ToolsLiguns/src/lib/supabase/server.ts)

---

**Your database is now fully type-safe! Enjoy autocomplete and compile-time error checking! 🎉**
