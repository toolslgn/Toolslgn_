-- =====================================================
-- ToolsLiguns - Supabase Database Schema
-- Social Media Management for Multiple Websites
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: websites
-- Purpose: Master list of websites being promoted
-- =====================================================
CREATE TABLE IF NOT EXISTS public.websites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON public.websites(user_id);
CREATE INDEX IF NOT EXISTS idx_websites_created_at ON public.websites(created_at DESC);

-- Enable RLS
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for websites
CREATE POLICY "Users can view their own websites"
    ON public.websites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own websites"
    ON public.websites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own websites"
    ON public.websites FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own websites"
    ON public.websites FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- Table: accounts
-- Purpose: Store social media platform credentials
-- =====================================================
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'linkedin', 'twitter', 'gmb', 'tiktok', 'youtube', 'pinterest')),
    account_name TEXT NOT NULL,
    account_id TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, platform, account_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_platform ON public.accounts(platform);
CREATE INDEX IF NOT EXISTS idx_accounts_is_active ON public.accounts(is_active);

-- Enable RLS
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accounts
CREATE POLICY "Users can view their own accounts"
    ON public.accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts"
    ON public.accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
    ON public.accounts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
    ON public.accounts FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- Table: posts
-- Purpose: Content master for all posts
-- =====================================================
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
    caption TEXT NOT NULL,
    image_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_website_id ON public.posts(website_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Users can view their own posts"
    ON public.posts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own posts"
    ON public.posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
    ON public.posts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
    ON public.posts FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- Table: post_schedules
-- Purpose: Execution queue for scheduled posts
-- =====================================================
CREATE TABLE IF NOT EXISTS public.post_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'QUEUED' NOT NULL CHECK (status IN ('QUEUED', 'PUBLISHED', 'FAILED', 'CANCELLED')),
    platform_post_id TEXT,
    error_log TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_post_schedules_user_id ON public.post_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_post_schedules_post_id ON public.post_schedules(post_id);
CREATE INDEX IF NOT EXISTS idx_post_schedules_account_id ON public.post_schedules(account_id);
CREATE INDEX IF NOT EXISTS idx_post_schedules_status ON public.post_schedules(status);
CREATE INDEX IF NOT EXISTS idx_post_schedules_scheduled_at ON public.post_schedules(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_post_schedules_status_scheduled ON public.post_schedules(status, scheduled_at) WHERE status = 'QUEUED';

-- Enable RLS
ALTER TABLE public.post_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for post_schedules
CREATE POLICY "Users can view their own schedules"
    ON public.post_schedules FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own schedules"
    ON public.post_schedules FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules"
    ON public.post_schedules FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedules"
    ON public.post_schedules FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- Functions: Auto-update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to auto-update updated_at
CREATE TRIGGER update_websites_updated_at
    BEFORE UPDATE ON public.websites
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON public.accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_post_schedules_updated_at
    BEFORE UPDATE ON public.post_schedules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- Helpful Views
-- =====================================================

-- View: Upcoming scheduled posts with all details
CREATE OR REPLACE VIEW public.upcoming_posts_view AS
SELECT 
    ps.id,
    ps.scheduled_at,
    ps.status,
    ps.platform_post_id,
    ps.published_at,
    p.caption,
    p.image_url,
    w.name AS website_name,
    w.url AS website_url,
    a.platform,
    a.account_name,
    ps.user_id
FROM public.post_schedules ps
JOIN public.posts p ON ps.post_id = p.id
JOIN public.websites w ON p.website_id = w.id
JOIN public.accounts a ON ps.account_id = a.id
WHERE ps.status = 'QUEUED'
ORDER BY ps.scheduled_at ASC;

-- View: Post analytics by website
CREATE OR REPLACE VIEW public.posts_by_website_view AS
SELECT 
    w.id AS website_id,
    w.name AS website_name,
    w.url AS website_url,
    COUNT(DISTINCT p.id) AS total_posts,
    COUNT(DISTINCT CASE WHEN ps.status = 'QUEUED' THEN ps.id END) AS queued_posts,
    COUNT(DISTINCT CASE WHEN ps.status = 'PUBLISHED' THEN ps.id END) AS published_posts,
    COUNT(DISTINCT CASE WHEN ps.status = 'FAILED' THEN ps.id END) AS failed_posts,
    w.user_id
FROM public.websites w
LEFT JOIN public.posts p ON w.id = p.website_id
LEFT JOIN public.post_schedules ps ON p.id = ps.post_id
GROUP BY w.id, w.name, w.url, w.user_id;

-- View: Account usage statistics
CREATE OR REPLACE VIEW public.account_stats_view AS
SELECT 
    a.id AS account_id,
    a.platform,
    a.account_name,
    a.is_active,
    COUNT(DISTINCT ps.id) AS total_scheduled,
    COUNT(DISTINCT CASE WHEN ps.status = 'PUBLISHED' THEN ps.id END) AS total_published,
    COUNT(DISTINCT CASE WHEN ps.status = 'FAILED' THEN ps.id END) AS total_failed,
    MAX(ps.published_at) AS last_published_at,
    a.user_id
FROM public.accounts a
LEFT JOIN public.post_schedules ps ON a.id = ps.account_id
GROUP BY a.id, a.platform, a.account_name, a.is_active, a.user_id;

-- =====================================================
-- Sample Data (Optional - Comment out for production)
-- =====================================================
/*
-- Insert sample websites (after user authentication)
INSERT INTO public.websites (user_id, name, url, description) VALUES
    (auth.uid(), 'Liguns Entertainment', 'https://liguns.com', 'Main entertainment website'),
    (auth.uid(), 'Beras Polos', 'https://beraspolos.online', 'Rice delivery service');

-- Insert sample accounts
INSERT INTO public.accounts (user_id, platform, account_name, account_id, access_token, token_expires_at) VALUES
    (auth.uid(), 'facebook', 'Liguns Official', 'fb_12345', 'sample_token_123', NOW() + INTERVAL '60 days'),
    (auth.uid(), 'instagram', '@liguns', 'ig_67890', 'sample_token_456', NOW() + INTERVAL '60 days');
*/

-- =====================================================
-- Completion Message
-- =====================================================
-- Schema created successfully!
-- Next steps:
-- 1. Enable Realtime for tables if needed
-- 2. Configure Supabase Storage bucket for images
-- 3. Set up Edge Functions for posting automation
-- =====================================================

COMMENT ON TABLE public.websites IS 'Master list of websites being promoted through social media';
COMMENT ON TABLE public.accounts IS 'Social media platform credentials and tokens';
COMMENT ON TABLE public.posts IS 'Content master containing all post data';
COMMENT ON TABLE public.post_schedules IS 'Execution queue for scheduled posts across platforms';
