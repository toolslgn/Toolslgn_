# 🔐 Supabase Connection Configuration Guide

## ✅ Status: Already Configured!

Good news! Your Supabase client helpers are **already set up** and ready to use with Next.js 14/15 App Router.

---

## 📋 Step 1: Get Your Supabase Credentials

### Where to Find Them

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project (or create a new one)
3. Click **Project Settings** (gear icon in sidebar)
4. Go to **API** section
5. Copy the following values:

```
Project URL  →  NEXT_PUBLIC_SUPABASE_URL
anon public  →  NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 📋 Step 2: Configure Environment Variables

### Create `.env.local` File

```bash
# In the root of your project
cp .env.example .env.local
```

### Add Your Credentials

Open `.env.local` and replace the placeholder values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE5NTY1NzEyMDB9.example_token_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> [!IMPORTANT]
> **NEVER commit `.env.local` to git!** It's already in `.gitignore`.

---

## 🛠️ Step 3: Supabase Client Files (Already Created!)

### ✅ Client-Side: `src/lib/supabase/client.ts`

**Use in Client Components** (`"use client"`)

```typescript
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Features:**
- ✅ Type-safe with your database schema
- ✅ Automatically handles authentication state
- ✅ Works in Client Components
- ✅ Optimized for browser environment

---

### ✅ Server-Side: `src/lib/supabase/server.ts`

**Use in Server Components, Server Actions, and Route Handlers**

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Safely ignore if called from Server Component
          }
        },
      },
    }
  );
}
```

**Features:**
- ✅ Type-safe with your database schema
- ✅ Properly handles cookies for authentication
- ✅ Works in Server Components, Server Actions, Route Handlers
- ✅ Compatible with Next.js 15's async cookies API

---

## 💡 Usage Examples

### Example 1: Client Component

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Website } from '@/types/database'

export function WebsiteList() {
  const [websites, setWebsites] = useState<Website[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function loadWebsites() {
      const { data } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) {
        setWebsites(data)
      }
    }

    loadWebsites()
  }, [])

  return (
    <div>
      {websites.map((website) => (
        <div key={website.id}>{website.name}</div>
      ))}
    </div>
  )
}
```

---

### Example 2: Server Component

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function WebsitesPage() {
  const supabase = await createClient()
  
  const { data: websites } = await supabase
    .from('websites')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1>Websites</h1>
      {websites?.map((website) => (
        <div key={website.id}>{website.name}</div>
      ))}
    </div>
  )
}
```

---

### Example 3: Server Action

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { WebsiteInsert } from '@/types/database'

export async function createWebsite(formData: FormData) {
  const supabase = await createClient()

  const newWebsite: WebsiteInsert = {
    user_id: 'user-uuid', // Get from auth
    name: formData.get('name') as string,
    url: formData.get('url') as string,
    description: formData.get('description') as string
  }

  const { error } = await supabase
    .from('websites')
    .insert(newWebsite)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/websites')
}
```

---

### Example 4: API Route Handler

```typescript
// app/api/websites/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: websites, error } = await supabase
    .from('websites')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ websites })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('websites')
    .insert(body)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ website: data })
}
```

---

## 🔑 When to Use Which Client?

| Context | Use | Import |
|---------|-----|--------|
| **Client Components** (`"use client"`) | `client.ts` | `import { createClient } from '@/lib/supabase/client'` |
| **Server Components** | `server.ts` | `import { createClient } from '@/lib/supabase/server'` |
| **Server Actions** (`"use server"`) | `server.ts` | `import { createClient } from '@/lib/supabase/server'` |
| **API Route Handlers** | `server.ts` | `import { createClient } from '@/lib/supabase/server'` |
| **Middleware** | Special setup | See below |

---

## 🔐 Optional: Middleware for Auth Refresh

If you're using Supabase Auth, create `middleware.ts` to refresh tokens:

```typescript
// middleware.ts (root of project)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## ✅ Verification Checklist

- [ ] Created `.env.local` file
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Files exist:
  - [ ] `src/lib/supabase/client.ts`
  - [ ] `src/lib/supabase/server.ts`
- [ ] Ran SQL schema in Supabase dashboard
- [ ] Tested connection (see below)

---

## 🧪 Test Your Connection

Create a test file to verify the connection:

```typescript
// app/test-db/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  const supabase = await createClient()
  
  // Try to fetch from websites table
  const { data, error } = await supabase
    .from('websites')
    .select('count')
    .single()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      {error ? (
        <div className="text-red-500">
          ❌ Error: {error.message}
          <p className="mt-2 text-sm">
            Make sure you've run the SQL schema and your credentials are correct.
          </p>
        </div>
      ) : (
        <div className="text-green-500">
          ✅ Connected successfully!
          <p className="mt-2">Database is ready to use.</p>
        </div>
      )}
    </div>
  )
}
```

Visit `http://localhost:3000/test-db` to test.

---

## 🚨 Troubleshooting

### Error: "Invalid API key"
- Check that your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Make sure you copied the **anon public** key, not the service_role key

### Error: "relation 'websites' does not exist"
- You haven't run the SQL schema yet
- Go to Supabase Dashboard → SQL Editor
- Run the contents of `supabase-schema.sql`

### Error: "Network request failed"
- Check that your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Make sure your Supabase project is active

### TypeScript Errors
- Restart your TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- Make sure all packages are installed: `npm install`

---

## 📚 Related Documentation

- **Database Schema**: [supabase-schema.sql](file:///d:/ToolsLiguns/supabase-schema.sql)
- **TypeScript Types**: [src/types/database.ts](file:///d:/ToolsLiguns/src/types/database.ts)
- **Usage Examples**: [src/lib/supabase/examples.ts](file:///d:/ToolsLiguns/src/lib/supabase/examples.ts)
- **Supabase Docs**: https://supabase.com/docs/guides/auth/server-side/nextjs

---

## 🎉 You're All Set!

Your Supabase connection is configured and ready to use. Start building your social media management SaaS! 🚀
