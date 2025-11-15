-- Create shots table
CREATE TABLE IF NOT EXISTS shots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  display_order TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index on scene_id for faster queries
CREATE INDEX IF NOT EXISTS idx_shots_scene_id ON shots(scene_id);
-- Create index on display_order for sorting
CREATE INDEX IF NOT EXISTS idx_shots_display_order ON shots(scene_id, display_order);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_shots_updated_at
  BEFORE UPDATE ON shots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

