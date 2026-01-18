-- Brand Kit Migration: Add logo and color to websites table
-- Run this in Supabase SQL Editor

-- Add logo_url column
ALTER TABLE websites 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add primary_color column (stores hex color like #FF6B35)
ALTER TABLE websites 
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#3B82F6';

-- Add comment for documentation
COMMENT ON COLUMN websites.logo_url IS 'URL to website logo stored in Supabase Storage (website-logos bucket)';
COMMENT ON COLUMN websites.primary_color IS 'Brand primary color in hex format (e.g., #FF6B35)';

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'websites' 
  AND column_name IN ('logo_url', 'primary_color');
