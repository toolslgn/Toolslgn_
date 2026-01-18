-- FINAL SECURITY LOCKDOWN SCRIPT (FIXED)
-- Run this in Supabase SQL Editor before Production
-- This script resets and enforces Row Level Security (RLS) on all tables.

-- 1. Enable RLS on all tables
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_schedules ENABLE ROW LEVEL SECURITY;
-- Note: 'caption_templates' and 'caption_variations' removed as they don't exist in current schema

-- 2. Drop EXISTING policies to ensure a clean slate (prevents conflicts)
DROP POLICY IF EXISTS "Allow All" ON websites;
DROP POLICY IF EXISTS "Allow All" ON accounts;
DROP POLICY IF EXISTS "Allow All" ON posts;
DROP POLICY IF EXISTS "Allow All" ON post_schedules;

DROP POLICY IF EXISTS "Authenticated Users Only" ON websites;
DROP POLICY IF EXISTS "Authenticated Users Only" ON accounts;
DROP POLICY IF EXISTS "Authenticated Users Only" ON posts;
DROP POLICY IF EXISTS "Authenticated Users Only" ON post_schedules;

-- 3. Create "Allow Full Access to Authenticated Users Only" policies
-- This ensures that standard users (anon) cannot access anything.
-- Only logged-in users (role = 'authenticated') can Select/Insert/Update/Delete.

-- WEBSITES
CREATE POLICY "Authenticated Users Only" ON websites
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ACCOUNTS
CREATE POLICY "Authenticated Users Only" ON accounts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- POSTS (Protects new is_evergreen column)
CREATE POLICY "Authenticated Users Only" ON posts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- POST_SCHEDULES
CREATE POLICY "Authenticated Users Only" ON post_schedules
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Verify RLS is actually enabled (Visual check in SQL output)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
