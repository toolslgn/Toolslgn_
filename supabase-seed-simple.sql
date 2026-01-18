-- =====================================================
-- ToolsLiguns - Simple Seed Script (Alternative)
-- Use this if the main seed script doesn't work in SQL Editor
-- =====================================================
--
-- IMPORTANT: You must be authenticated before running this
-- This uses auth.uid() which returns your current user ID
--
-- =====================================================

-- Step 1: Insert 3 Websites
-- =====================================================

INSERT INTO public.websites (user_id, name, url, description)
VALUES 
    (auth.uid(), 'Liguns Entertainment', 'https://liguns.com', 'Premier entertainment and media company'),
    (auth.uid(), 'Beras Polos', 'https://beraspolos.online', 'Premium organic rice delivery service'),
    (auth.uid(), 'LuckyGen', 'https://luckygen.vercel.app', 'AI-powered Twitch username generator');

-- Check websites were created
SELECT id, name, url FROM websites WHERE user_id = auth.uid();

-- =====================================================
-- Step 2: Insert 1 Instagram Account
-- =====================================================

INSERT INTO public.accounts (
    user_id,
    platform,
    account_name,
    account_id,
    access_token,
    refresh_token,
    token_expires_at,
    is_active
)
VALUES (
    auth.uid(),
    'instagram',
    '@ligunsofficial',
    'ig_12345678901234567',
    'IGQVJTest_Access_Token_Sample',
    'IGQVJTest_Refresh_Token_Sample',
    NOW() + INTERVAL '60 days',
    true
);

-- Check account was created
SELECT id, platform, account_name FROM accounts WHERE user_id = auth.uid();

-- =====================================================
-- Step 3: Insert 1 Post linked to Liguns Entertainment
-- =====================================================

-- First, get the Liguns Entertainment website ID
-- Replace 'your-website-id-here' with the actual ID from the SELECT above
-- OR use this query to get it:

WITH liguns_website AS (
    SELECT id FROM websites WHERE name = 'Liguns Entertainment' AND user_id = auth.uid() LIMIT 1
)
INSERT INTO public.posts (
    user_id,
    website_id,
    caption,
    image_url,
    notes
)
SELECT 
    auth.uid(),
    liguns_website.id,
    '🎬 Exciting news! Liguns Entertainment is launching new digital content! Follow us for exclusive updates. #LigunsEntertainment #NewRelease',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
    'Test post for database verification'
FROM liguns_website;

-- Check post was created
SELECT id, caption, website_id FROM posts WHERE user_id = auth.uid();

-- =====================================================
-- Step 4: Insert 2 Scheduled Tasks
-- =====================================================

-- Schedule 1: Today + 2 hours
-- Schedule 2: 30 days from now

WITH 
    test_post AS (
        SELECT id FROM posts WHERE user_id = auth.uid() LIMIT 1
    ),
    test_account AS (
        SELECT id FROM accounts WHERE user_id = auth.uid() LIMIT 1
    )
INSERT INTO public.post_schedules (
    user_id,
    post_id,
    account_id,
    scheduled_at,
    status
)
SELECT 
    auth.uid(),
    test_post.id,
    test_account.id,
    NOW() + INTERVAL '2 hours',
    'QUEUED'
FROM test_post, test_account
UNION ALL
SELECT 
    auth.uid(),
    test_post.id,
    test_account.id,
    NOW() + INTERVAL '30 days',
    'QUEUED'
FROM test_post, test_account;

-- =====================================================
-- Verify All Data
-- =====================================================

-- Summary count
SELECT 
    'Summary' AS info,
    (SELECT COUNT(*) FROM websites WHERE user_id = auth.uid()) AS websites,
    (SELECT COUNT(*) FROM accounts WHERE user_id = auth.uid()) AS accounts,
    (SELECT COUNT(*) FROM posts WHERE user_id = auth.uid()) AS posts,
    (SELECT COUNT(*) FROM post_schedules WHERE user_id = auth.uid()) AS schedules;

-- View all schedules with details
SELECT 
    ps.scheduled_at,
    ps.status,
    a.platform,
    a.account_name,
    w.name AS website_name,
    SUBSTRING(p.caption, 1, 60) AS caption_preview
FROM post_schedules ps
JOIN posts p ON ps.post_id = p.id
JOIN accounts a ON ps.account_id = a.id
JOIN websites w ON p.website_id = w.id
WHERE ps.user_id = auth.uid()
ORDER BY ps.scheduled_at;

-- Use the convenient upcoming_posts_view
SELECT * FROM upcoming_posts_view 
WHERE user_id = auth.uid()
ORDER BY scheduled_at;
