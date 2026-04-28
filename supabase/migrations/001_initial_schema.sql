-- Folio Skill Tracker Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE skill_category AS ENUM ('music', 'fitness', 'learning', 'creative', 'other');
CREATE TYPE milestone_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE session_mood AS ENUM ('great', 'okay', 'struggled');

-- Skills table
CREATE TABLE skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category skill_category NOT NULL DEFAULT 'other',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived_at TIMESTAMP WITH TIME ZONE,
  target_date DATE,
  total_xp INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE,
  cover_emoji TEXT
);

-- Milestones table
CREATE TABLE milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  weight_percent NUMERIC(5,2) NOT NULL CHECK (weight_percent > 0 AND weight_percent <= 100),
  order_index INTEGER NOT NULL DEFAULT 0,
  status milestone_status NOT NULL DEFAULT 'not_started',
  is_locked BOOLEAN DEFAULT FALSE,
  unlock_after_milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
  estimated_minutes INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  xp_reward INTEGER GENERATED ALWAYS AS (ROUND(weight_percent * 0.1)) STORED,
  
  -- Ensure unlock_after references a milestone in the same skill
  CONSTRAINT valid_unlock_reference CHECK (
    unlock_after_milestone_id IS NULL OR 
    unlock_after_milestone_id != id
  )
);

-- Sessions table
CREATE TABLE sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT,
  mood session_mood,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_minutes INTEGER
);

-- Indexes for performance
CREATE INDEX idx_skills_user_id ON skills(user_id);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_archived_at ON skills(archived_at) WHERE archived_at IS NULL;
CREATE INDEX idx_milestones_skill_id ON milestones(skill_id);
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_sessions_milestone_id ON sessions(milestone_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);

-- Row Level Security Policies

-- Skills RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own skills"
  ON skills
  FOR ALL
  USING (auth.uid() = user_id);

-- Milestones RLS
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access milestones for their skills"
  ON milestones
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM skills
      WHERE skills.id = milestones.skill_id
      AND skills.user_id = auth.uid()
    )
  );

-- Sessions RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own sessions"
  ON sessions
  FOR ALL
  USING (auth.uid() = user_id);

-- Function to update skill XP and streak
CREATE OR REPLACE FUNCTION update_skill_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update skill total_xp and last_active_at when milestone is completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE skills
    SET 
      total_xp = total_xp + NEW.xp_reward,
      last_active_at = NOW()
    WHERE id = NEW.skill_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update skill stats on milestone completion
CREATE TRIGGER on_milestone_completed
  AFTER UPDATE ON milestones
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION update_skill_stats();

-- Function to validate milestone weights sum to 100 per skill
CREATE OR REPLACE FUNCTION validate_milestone_weights()
RETURNS TRIGGER AS $$
DECLARE
  total_weight NUMERIC;
BEGIN
  SELECT COALESCE(SUM(weight_percent), 0)
  INTO total_weight
  FROM milestones
  WHERE skill_id = NEW.skill_id
  AND id != NEW.id;
  
  IF (total_weight + NEW.weight_percent) > 100 THEN
    RAISE EXCEPTION 'Total weight for skill milestones cannot exceed 100%%. Current total would be: %', (total_weight + NEW.weight_percent);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to validate weights before insert/update
CREATE TRIGGER validate_weights_on_insert
  BEFORE INSERT ON milestones
  FOR EACH ROW
  EXECUTE FUNCTION validate_milestone_weights();

CREATE TRIGGER validate_weights_on_update
  BEFORE UPDATE OF weight_percent ON milestones
  FOR EACH ROW
  EXECUTE FUNCTION validate_milestone_weights();

-- Grant permissions to authenticated users
GRANT ALL ON skills TO authenticated;
GRANT ALL ON milestones TO authenticated;
GRANT ALL ON sessions TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
