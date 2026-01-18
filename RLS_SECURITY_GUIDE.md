# 🔐 Row Level Security (RLS) - Guide

## Overview

Strict database security ensuring only authenticated users can access their own data.

---

## 🛡️ Security Model

**Principle:** Zero Trust
- ❌ Anonymous users: **ZERO** access
- ✅ Authenticated users: Access **ONLY** their own data
- ✅ Service role (cron): Bypass RLS for automation

---

## 📋 RLS Status

### Tables Protected (4)
1. `websites` - User websites
2. `accounts` - Social media accounts
3. `posts` - Post content
4. `post_schedules` - Scheduled posts

### Policy Applied
**Name:** "Allow Admin Access"

**Logic:**
```sql
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

**Effect:**
- Users see only their own data
- Users can only modify their own data
- No cross-user data leakage

---

## 🚀 Quick Setup

### 1. Run RLS Script
**File:** `migrations/enable_rls_security.sql`

**Execute in Supabase SQL Editor:**
```sql
-- Copy entire file contents
-- Paste in SQL Editor
-- Click "Run"
```

### 2. Verify RLS Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables
WHERE tablename IN ('websites', 'accounts', 'posts', 'post_schedules');

-- Expected: rowsecurity = true
```

### 3. Verify Policies Created
```sql
SELECT tablename, policyname 
FROM pg_policies
WHERE tablename IN ('websites', 'accounts', 'posts', 'post_schedules');

-- Expected: "Allow Admin Access" for each table
```

---

## 🔍 How It Works

### Example: User A tries to access data

**Query:**
```sql
SELECT * FROM websites;
```

**RLS Filters:**
```sql
-- Automatic filter added by RLS
SELECT * FROM websites 
WHERE user_id = auth.uid(); -- User A's ID
```

**Result:** Only User A's websites returned

---

## 🤖 Cron Jobs & Service Role

**Problem:** Cron needs to access all users' data

**Solution:** Service Role bypasses RLS

**In Code:**
```typescript
// Cron job uses service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Bypasses RLS
);
```

**Security:**
- ✅ `SUPABASE_SERVICE_ROLE_KEY` stored securely
- ✅ Only server-side code has access
- ✅ Never exposed to client

---

## 🧪 Testing

### Test 1: Anonymous Access (Should Fail)
```bash
curl -X GET "https://your-project.supabase.co/rest/v1/websites" \
  -H "apikey: ANON_KEY"

# Expected: [] (empty array)
```

### Test 2: Authenticated Access (Should Work)
```bash
curl -X GET "https://your-project.supabase.co/rest/v1/websites" \
  -H "apikey: ANON_KEY" \
  -H "Authorization: Bearer USER_JWT_TOKEN"

# Expected: User's websites
```

### Test 3: Service Role (Should Bypass)
```bash
curl -X GET "https://your-project.supabase.co/rest/v1/websites" \
  -H "apikey: SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer SERVICE_ROLE_KEY"

# Expected: ALL websites
```

---

## 🚨 Security Guarantees

### Enforced
- ✅ No anonymous access to any table
- ✅ Users cannot see other users' data
- ✅ Users cannot modify other users' data
- ✅ Policies enforced at database level (not just app)

### Bypassed
- Service role (for cron jobs)
- Postgres role (database admin)

---

## 📊 Policy Details

### Policy Structure
```sql
CREATE POLICY "Allow Admin Access"
ON table_name
FOR ALL                      -- All operations (SELECT, INSERT, UPDATE, DELETE)
TO authenticated             -- Only authenticated users
USING (auth.uid() = user_id) -- Read check
WITH CHECK (auth.uid() = user_id); -- Write check
```

### Operations Covered
- `SELECT` - Reading data
- `INSERT` - Creating data
- `UPDATE` - Modifying data
- `DELETE` - Removing data

---

## 🔧 Troubleshooting

### "No rows returned" after enabling RLS
**Cause:** Frontend using anon key without auth

**Fix:** Ensure user is logged in via Supabase Auth

### Cron job fails after RLS
**Cause:** Using anon key instead of service role key

**Fix:** Verify `SUPABASE_SERVICE_ROLE_KEY` is set

### Can't access data after login
**Cause:** `user_id` not set correctly

**Fix:** Ensure `user_id` column matches `auth.uid()`

---

## 📚 Related Files

- **RLS Script**: [migrations/enable_rls_security.sql](file:///d:/ToolsLiguns/migrations/enable_rls_security.sql)
- **Supabase Client**: [src/lib/supabase/server.ts](file:///d:/ToolsLiguns/src/lib/supabase/server.ts)

---

**Your data is now secure!** 🔐
