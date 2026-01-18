-- =====================================================
-- ToolsLiguns - Database Seed Script (Robust Version)
-- Inserts a test user AND test data
-- =====================================================

DO $$
DECLARE
    target_user_id UUID;
    liguns_website_id UUID;
    beras_website_id UUID;
    luckygen_website_id UUID;
    test_account_id UUID;
    test_post_id UUID;
BEGIN
    -- 1. Get the first user ID OR Create one if missing
    SELECT id INTO target_user_id FROM auth.users LIMIT 1;

    IF target_user_id IS NULL THEN
        RAISE NOTICE '⚠️ No users found. Creating a test user...';
        
        target_user_id := '00000000-0000-0000-0000-000000000001'; -- Fixed Test ID
        
        -- Insert a dummy user directly into auth.users
        -- Password is 'password123'
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            target_user_id,
            'authenticated',
            'authenticated',
            'test@example.com',
            crypt('password123', gen_salt('bf')), -- Requires pgcrypto extension
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{}',
            NOW(),
            NOW()
        );
        
        -- Also insert into public.users if you have a public profile table triggered
        -- (Assuming Supabase standard setup handles specific triggers, or we skip if not needed)
        
        RAISE NOTICE '✅ Created test user: test@example.com / password123';
    ELSE
        RAISE NOTICE 'ℹ️ Found existing user ID: %', target_user_id;
    END IF;

    -- 2. Insert Websites
    INSERT INTO public.websites (user_id, name, url, description)
    VALUES (
        target_user_id,
        'Liguns Entertainment',
        'https://liguns.com',
        'Premier entertainment and media company specializing in digital content creation'
    )
    RETURNING id INTO liguns_website_id;

    INSERT INTO public.websites (user_id, name, url, description)
    VALUES (
        target_user_id,
        'Beras Polos',
        'https://beraspolos.online',
        'Premium organic rice delivery service - Fresh from farm to your door'
    )
    RETURNING id INTO beras_website_id;

    INSERT INTO public.websites (user_id, name, url, description)
    VALUES (
        target_user_id,
        'LuckyGen',
        'https://luckygen.vercel.app',
        'AI-powered Twitch username generator for content creators'
    )
    RETURNING id INTO luckygen_website_id;

    -- 3. Insert Social Account
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
        target_user_id,
        'instagram',
        '@ligunsofficial',
        'ig_12345678901234567',
        'IGQVJTest_Access_Token_Dummy',
        'IGQVJTest_Refresh_Token_Dummy',
        NOW() + INTERVAL '60 days',
        true
    )
    RETURNING id INTO test_account_id;

    -- 4. Insert Post (linked to Liguns Ent)
    INSERT INTO public.posts (
        user_id,
        website_id,
        caption,
        image_url,
        notes,
        is_evergreen
    )
    VALUES (
        target_user_id,
        liguns_website_id,
        '🎬 Exciting news! Liguns Entertainment is launching new digital content this month! #LigunsEntertainment',
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
        'Test post for verification',
        true
    )
    RETURNING id INTO test_post_id;

    -- 5. Insert Scheduled Tasks
    INSERT INTO public.post_schedules (
        user_id,
        post_id,
        account_id,
        scheduled_at,
        status
    )
    VALUES (
        target_user_id,
        test_post_id,
        test_account_id,
        NOW() + INTERVAL '2 hours',
        'QUEUED'
    );

    INSERT INTO public.post_schedules (
        user_id,
        post_id,
        account_id,
        scheduled_at,
        status
    )
    VALUES (
        target_user_id,
        test_post_id,
        test_account_id,
        NOW() + INTERVAL '30 days',
        'QUEUED'
    );

    RAISE NOTICE '✅ Seed data created successfully for user %', target_user_id;

END $$;
