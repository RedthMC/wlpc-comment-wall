-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    comment TEXT NOT NULL CHECK (char_length(comment) <= 200),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read comments
CREATE POLICY "Anyone can read comments"
    ON comments
    FOR SELECT
    USING (true);

-- Create policy to allow anyone to insert comments
CREATE POLICY "Anyone can insert comments"
    ON comments
    FOR INSERT
    WITH CHECK (true);

-- Create index on timestamp for faster ordering
CREATE INDEX IF NOT EXISTS comments_timestamp_idx ON comments(timestamp);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
