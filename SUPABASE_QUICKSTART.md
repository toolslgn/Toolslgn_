# 🚀 Supabase Setup - Quick Reference

## ✅ TL;DR - 3 Steps to Get Started

### 1️⃣ Copy `.env.example` to `.env.local`
```bash
cp .env.example .env.local
```

### 2️⃣ Add Your Supabase Credentials
```env
# Get these from https://app.supabase.com → Your Project → Settings → API

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_key_here
```

### 3️⃣ Run the SQL Schema
1. Go to Supabase Dashboard → **SQL Editor**
2. Copy & paste [supabase-schema.sql](file:///d:/ToolsLiguns/supabase-schema.sql)
3. Click **Run**

**Done! Start coding.** 🎉

---

## 📦 Required Environment Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key | Project Settings → API → anon public |

> [!WARNING]
> Use the **anon public** key, NOT the service_role key!

---

## 🛠️ Client Files (Already Created!)

### Client-Side (`"use client"`)
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
```

### Server-Side (Server Components, Server Actions, API Routes)
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
```

---

## 💡 Quick Examples

### Fetch Data (Server Component)
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.from('websites').select('*')
  
  return <div>{/* render data */}</div>
}
```

### Fetch Data (Client Component)
```typescript
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function Component() {
  const [data, setData] = useState([])
  const supabase = createClient()
  
  useEffect(() => {
    supabase.from('websites').select('*').then(({ data }) => {
      setData(data || [])
    })
  }, [])
  
  return <div>{/* render data */}</div>
}
```

### Insert Data (Server Action)
```typescript
'use server'
import { createClient } from '@/lib/supabase/server'

export async function createWebsite(formData: FormData) {
  const supabase = await createClient()
  
  await supabase.from('websites').insert({
    user_id: 'user-uuid',
    name: formData.get('name'),
    url: formData.get('url')
  })
}
```

---

## 🔍 Test Connection

Visit this URL after setup:
```
http://localhost:3000/test-db
```

Or create `app/test-db/page.tsx`:
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('websites').select('count')
  
  return (
    <div className="p-8">
      {error ? '❌ Error' : '✅ Connected!'}
    </div>
  )
}
```

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid API key" | Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct |
| "relation does not exist" | Run the SQL schema in Supabase Dashboard |
| "Network request failed" | Check `NEXT_PUBLIC_SUPABASE_URL` is correct |
| TypeScript errors | Restart TS server: `Ctrl+Shift+P` → "Restart TS Server" |

---

## 📚 Full Documentation

- **Complete Setup Guide**: [SUPABASE_CONFIG.md](file:///d:/ToolsLiguns/SUPABASE_CONFIG.md)
- **Database Schema**: [DATABASE_SETUP.md](file:///d:/ToolsLiguns/DATABASE_SETUP.md)
- **TypeScript Types**: [TYPESCRIPT_TYPES.md](file:///d:/ToolsLiguns/TYPESCRIPT_TYPES.md)

---

**You're ready to build! 🚀**
