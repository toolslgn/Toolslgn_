-- Migration: Add retry_count and platform_response columns to post_schedules

-- Add retry_count column (default 0)
ALTER TABLE post_schedules 
ADD COLUMN IF NOT EXISTS retry_count INTEGER NOT NULL DEFAULT 0;

-- Add platform_response column for storing full API responses
ALTER TABLE post_schedules 
ADD COLUMN IF NOT EXISTS platform_response JSONB;

-- Add comment
COMMENT ON COLUMN post_schedules.retry_count IS 'Number of retry attempts for failed posts';
COMMENT ON COLUMN post_schedules.platform_response IS 'Full JSON response from platform API for debugging';
