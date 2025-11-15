-- Add image_url column to shots table
ALTER TABLE shots ADD COLUMN IF NOT EXISTS image_url TEXT;

