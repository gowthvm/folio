-- Gamification Features for Folio

-- Badge types enum (must be created before badges table)
CREATE TYPE badge_type AS ENUM (
  'first_skill',
  'first_milestone',
  'streak_7',
  'skill_complete',
  'five_skills'
);

-- Profiles table for user XP and stats
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_date DATE,
  weekly_recap_dismissed_at TIMESTAMP WITH TIME ZONE
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type badge_type NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Badge policies
CREATE POLICY "Users can view own badges"
  ON badges FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_badges_user_id ON badges(user_id);
CREATE INDEX idx_badges_badge_type ON badges(badge_type);

-- Function to award XP
CREATE OR REPLACE FUNCTION award_xp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE skills
    SET total_xp = total_xp + NEW.xp_reward
    WHERE id = NEW.skill_id;
    
    -- Update profile XP
    UPDATE profiles
    SET total_xp = total_xp + NEW.xp_reward
    WHERE id = (SELECT user_id FROM skills WHERE id = NEW.skill_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to award XP on milestone completion
DROP TRIGGER IF EXISTS on_milestone_completed ON milestones;
CREATE TRIGGER on_milestone_completed
  AFTER UPDATE ON milestones
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION award_xp();

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_badges(user_id UUID, skill_id UUID)
RETURNS void AS $$
DECLARE
  skill_count INTEGER;
  completed_count INTEGER;
  milestone_count INTEGER;
BEGIN
  -- First skill badge
  PERFORM 1 FROM badges WHERE user_id = auth.uid() AND badge_type = 'first_skill';
  IF NOT FOUND THEN
    INSERT INTO badges (user_id, badge_type) VALUES (user_id, 'first_skill');
  END IF;
  
  -- First milestone badge
  PERFORM 1 FROM badges WHERE user_id = auth.uid() AND badge_type = 'first_milestone';
  IF NOT FOUND THEN
    INSERT INTO badges (user_id, badge_type) VALUES (user_id, 'first_milestone');
  END IF;
  
  -- 5 skills badge
  SELECT COUNT(*) INTO skill_count FROM skills WHERE user_id = auth.uid() AND archived_at IS NULL;
  IF skill_count >= 5 THEN
    PERFORM 1 FROM badges WHERE user_id = auth.uid() AND badge_type = 'five_skills';
    IF NOT FOUND THEN
      INSERT INTO badges (user_id, badge_type) VALUES (user_id, 'five_skills');
    END IF;
  END IF;
  
  -- Skill complete badge
  SELECT COUNT(*) INTO completed_count FROM milestones 
  WHERE skill_id = check_badges.skill_id AND status = 'completed';
  SELECT COUNT(*) INTO milestone_count FROM milestones WHERE skill_id = check_badges.skill_id;
  IF completed_count = milestone_count AND milestone_count > 0 THEN
    PERFORM 1 FROM badges WHERE user_id = auth.uid() AND badge_type = 'skill_complete';
    IF NOT FOUND THEN
      INSERT INTO badges (user_id, badge_type) VALUES (user_id, 'skill_complete');
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON badges TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;