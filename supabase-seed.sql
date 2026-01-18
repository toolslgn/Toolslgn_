-- =====================================================
-- ToolsLiguns - Admin User Seeder (Fixed)
-- Creates specific admin users if they don't exist
-- =====================================================

DO $$
DECLARE
    -- Using distinct variable names to avoid ambiguity with column names
    target_emails text[] := ARRAY[
        'Muchamad.guntur04@gmail.com',
        'Muchamad.guntur97@gmail.com',
        'Ligunsentertain@gmail.com'
    ];
    target_password text := 'Konciimah04';
    
    -- Loop variable renamed to avoid conflict with 'email' column
    current_email text;
    
    found_user_id uuid;
    first_admin_id uuid;
BEGIN
    -- Ensure pgcrypto extension is available for password hashing
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    FOREACH current_email IN ARRAY target_emails
    LOOP
        -- Check if user exists (using explicit variable name)
        SELECT id INTO found_user_id FROM auth.users WHERE email = current_email;

        IF found_user_id IS NULL THEN
            found_user_id := gen_random_uuid();
            
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
                updated_at,
                confirmation_token,
                recovery_token
            ) VALUES (
                '00000000-0000-0000-0000-000000000000',
                found_user_id,
                'authenticated',
                'authenticated',
                current_email,
                crypt(target_password, gen_salt('bf')),
                NOW(),
                '{"provider":"email","providers":["email"]}',
                '{}',
                NOW(),
                NOW(),
                '',
                ''
            );
            
            RAISE NOTICE '✅ Created Admin User: %', current_email;
        ELSE
            RAISE NOTICE 'ℹ️ Admin User already exists: %', current_email;
        END IF;

        -- Capture the first user ID to link sample data to
        IF first_admin_id IS NULL THEN
            first_admin_id := found_user_id;
        END IF;
    END LOOP;

    -- =====================================================
    -- Optional: Seed Sample Data linked to the first admin
    -- =====================================================
    -- Only run if websites table is empty to avoid duplicates
    IF NOT EXISTS (SELECT 1 FROM public.websites) THEN
        INSERT INTO public.websites (user_id, name, url, description)
        VALUES 
            (first_admin_id, 'Liguns Entertainment', 'https://liguns.com', 'Premier entertainment media'),
            (first_admin_id, 'Beras Polos', 'https://beraspolos.online', 'Premium organic rice'),
            (first_admin_id, 'LuckyGen', 'https://luckygen.vercel.app', 'AI username generator');
            
        RAISE NOTICE '✅ Seeded sample websites for user: %', first_admin_id;
    END IF;

END $$;
