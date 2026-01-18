-- ============================================
-- ToolsLiguns - Row Level Security (RLS)
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor
-- IMPORTANT: Execute BEFORE going live!

-- ============================================
-- Step 1: Enable RLS on ALL tables
-- ============================================

ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_schedules ENABLE ROW LEVEL SECURITY;
-- Check if these tables exist before running (ignore errors if they don't)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'caption_templates') THEN
        ALTER TABLE caption_templates ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'caption_variations') THEN
        ALTER TABLE caption_variations ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ============================================
-- Step 2: Drop existing policies (Clean Slate)
-- ============================================

DROP POLICY IF EXISTS "Allow Full Access for Authenticated Users" ON websites;
DROP POLICY IF EXISTS "Allow Admin Access" ON websites;

DROP POLICY IF EXISTS "Allow Full Access for Authenticated Users" ON accounts;
DROP POLICY IF EXISTS "Allow Admin Access" ON accounts;

DROP POLICY IF EXISTS "Allow Full Access for Authenticated Users" ON posts;
DROP POLICY IF EXISTS "Allow Admin Access" ON posts;

DROP POLICY IF EXISTS "Allow Full Access for Authenticated Users" ON post_schedules;
DROP POLICY IF EXISTS "Allow Admin Access" ON post_schedules;

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'caption_templates') THEN
        DROP POLICY IF EXISTS "Allow Full Access for Authenticated Users" ON caption_templates;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'caption_variations') THEN
        DROP POLICY IF EXISTS "Allow Full Access for Authenticated Users" ON caption_variations;
    END IF;
END $$;

-- ============================================
-- Step 3: Create Strict Policies
-- Logic: Authenticated users = FULL ACCESS
--        Anonymous users = ZERO ACCESS
-- ============================================

-- Websites Table
CREATE POLICY "Allow Full Access for Authenticated Users"
ON websites
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Accounts Table
CREATE POLICY "Allow Full Access for Authenticated Users"
ON accounts
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Posts Table
CREATE POLICY "Allow Full Access for Authenticated Users"
ON posts
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Post Schedules Table
CREATE POLICY "Allow Full Access for Authenticated Users"
ON post_schedules
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Coupon/Caption Templates (Conditional creation to strict avoid errors if table missing)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'caption_templates') THEN
        EXECUTE 'CREATE POLICY "Allow Full Access for Authenticated Users" ON caption_templates FOR ALL TO authenticated USING (auth.role() = ''authenticated'') WITH CHECK (auth.role() = ''authenticated'')';
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'caption_variations') THEN
        EXECUTE 'CREATE POLICY "Allow Full Access for Authenticated Users" ON caption_variations FOR ALL TO authenticated USING (auth.role() = ''authenticated'') WITH CHECK (auth.role() = ''authenticated'')';
    END IF;
END $$;

-- ============================================
-- Step 4: Verification
-- ============================================

SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('websites', 'accounts', 'posts', 'post_schedules', 'caption_templates', 'caption_variations')
ORDER BY tablename;
