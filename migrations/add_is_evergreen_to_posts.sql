-- Add is_evergreen column to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS is_evergreen BOOLEAN DEFAULT FALSE;

-- Update RLS policies if needed (though existing "Allow Full Access" should cover new columns automatically)
-- Just ensuring it's commented for clarity
COMMENT ON COLUMN posts.is_evergreen IS 'Flag to indicate if this post is evergreen content suitable for recycling';
