# 🌱 Database Seed Script Guide

## Purpose
This seed script inserts test data into your database to verify that all tables and foreign key relationships are working correctly.

---

## 📦 What Gets Created

### ✅ 3 Websites
1. **Liguns Entertainment** - `https://liguns.com`
2. **Beras Polos** - `https://beraspolos.online`
3. **LuckyGen** - `https://luckygen.vercel.app`

### ✅ 1 Social Media Account
- **Platform**: Instagram
- **Account**: @ligunsofficial
- **Status**: Active
- **Token Expiry**: 60 days from now

### ✅ 1 Post
- **Linked to**: Liguns Entertainment
- **Caption**: Promotional content about new digital content launch
- **Image**: Sample Unsplash image

### ✅ 2 Scheduled Tasks
1. **Schedule 1**: Today + 2 hours (QUEUED)
2. **Schedule 2**: 30 days from now (QUEUED)

---

## 🚀 How to Run

### Option 1: Main Seed Script (Recommended)

1. **Make sure you're authenticated** in Supabase Dashboard
2. Go to **SQL Editor** in Supabase
3. Click **+ New query**
4. Copy & paste contents of **[supabase-seed.sql](file:///d:/ToolsLiguns/supabase-seed.sql)**
5. Click **Run** (or press `Ctrl+Enter`)

**Expected Output:**
```
NOTICE: Created websites:
NOTICE:   - Liguns Entertainment: uuid-here
NOTICE:   - Beras Polos: uuid-here
NOTICE:   - LuckyGen: uuid-here
NOTICE: Created account:
NOTICE:   - @ligunsofficial (Instagram): uuid-here
NOTICE: Created post:
NOTICE:   - Post ID: uuid-here
...
```

---

### Option 2: Simple Seed Script (Alternative)

If the main script doesn't work (some SQL editors don't support DO blocks), use the simple version:

1. Go to **SQL Editor** in Supabase
2. Open **[supabase-seed-simple.sql](file:///d:/ToolsLiguns/supabase-seed-simple.sql)**
3. Run each section **one at a time** (separated by comments)
4. Verify each step before moving to the next

---

## ✅ Verification

After running the seed script, verify the data was created:

### Check Websites
```sql
SELECT id, name, url 
FROM websites 
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

**Expected**: 3 rows (Liguns Entertainment, Beras Polos, LuckyGen)

---

### Check Accounts
```sql
SELECT id, platform, account_name, is_active
FROM accounts 
WHERE user_id = auth.uid();
```

**Expected**: 1 row (@ligunsofficial on Instagram)

---

### Check Posts
```sql
SELECT 
    p.id,
    p.caption,
    w.name AS website_name
FROM posts p
JOIN websites w ON p.website_id = w.id
WHERE p.user_id = auth.uid();
```

**Expected**: 1 row (linked to Liguns Entertainment)

---

### Check Schedules
```sql
SELECT 
    ps.scheduled_at,
    ps.status,
    a.platform,
    w.name AS website_name
FROM post_schedules ps
JOIN posts p ON ps.post_id = p.id
JOIN accounts a ON ps.account_id = a.id
JOIN websites w ON p.website_id = w.id
WHERE ps.user_id = auth.uid()
ORDER BY ps.scheduled_at;
```

**Expected**: 2 rows (one for today + 2hrs, one for +30 days)

---

### Use the View (Easiest)
```sql
SELECT * FROM upcoming_posts_view
WHERE user_id = auth.uid()
ORDER BY scheduled_at;
```

**Expected**: 2 rows with full details (post, account, website info)

---

## 🧪 Testing Foreign Keys

This seed script tests all foreign key relationships:

| Relationship | Test |
|--------------|------|
| **posts.website_id** → websites.id | ✅ Post links to Liguns Entertainment |
| **post_schedules.post_id** → posts.id | ✅ 2 schedules link to the same post |
| **post_schedules.account_id** → accounts.id | ✅ Schedules use Instagram account |
| **All tables.user_id** → auth.users.id | ✅ All rows link to authenticated user |

If any foreign key is broken, you'll get an error like:
```
ERROR: insert or update on table "posts" violates foreign key constraint
```

---

## 🗑️ Clean Up Test Data

If you want to remove the test data later:

```sql
-- Delete in reverse order (to respect foreign keys)
DELETE FROM post_schedules WHERE user_id = auth.uid();
DELETE FROM posts WHERE user_id = auth.uid();
DELETE FROM accounts WHERE user_id = auth.uid();
DELETE FROM websites WHERE user_id = auth.uid();
```

Or delete specific test data only:

```sql
-- Delete only the test data created by seed script
DELETE FROM post_schedules 
WHERE post_id IN (
    SELECT id FROM posts 
    WHERE caption LIKE '%Exciting news! Liguns Entertainment%'
);

DELETE FROM posts 
WHERE caption LIKE '%Exciting news! Liguns Entertainment%';

DELETE FROM accounts 
WHERE account_name = '@ligunsofficial';

DELETE FROM websites 
WHERE name IN ('Liguns Entertainment', 'Beras Polos', 'LuckyGen');
```

---

## 🚨 Troubleshooting

### Error: "relation does not exist"
- You haven't run the main schema yet
- Run [supabase-schema.sql](file:///d:/ToolsLiguns/supabase-schema.sql) first

### Error: "auth.uid() is null"
- You're not authenticated in Supabase
- Make sure you're logged into your Supabase dashboard

### Error: "violates foreign key constraint"
- Foreign key relationship is broken
- Check that the referenced table exists and has data

### Error: "duplicate key value"
- Data already exists
- Use the cleanup script above to remove old test data first

---

## 📊 Sample Output

After running the seed script successfully, you should see:

```
┌──────────┬───────────┬──────────┬───────────┬───────────┐
│  status  │ websites  │ accounts │   posts   │ schedules │
├──────────┼───────────┼──────────┼───────────┼───────────┤
│    ✅     │     3     │    1     │     1     │     2     │
└──────────┴───────────┴──────────┴───────────┴───────────┘
```

---

## 📚 Related Files

- **Main Seed Script**: [supabase-seed.sql](file:///d:/ToolsLiguns/supabase-seed.sql)
- **Simple Version**: [supabase-seed-simple.sql](file:///d:/ToolsLiguns/supabase-seed-simple.sql)
- **Database Schema**: [supabase-schema.sql](file:///d:/ToolsLiguns/supabase-schema.sql)
- **Schema Documentation**: [DATABASE_SCHEMA.md](file:///d:/ToolsLiguns/DATABASE_SCHEMA.md)

---

## ✅ Success Checklist

After running the seed script:

- [ ] 3 websites created (Liguns, Beras Polos, LuckyGen)
- [ ] 1 Instagram account created (@ligunsofficial)
- [ ] 1 post created (linked to Liguns Entertainment)
- [ ] 2 schedules created (today + next month)
- [ ] All verification queries return expected data
- [ ] No foreign key errors
- [ ] `upcoming_posts_view` shows 2 upcoming posts

---

**Your database structure is verified and ready for production! 🎉**
