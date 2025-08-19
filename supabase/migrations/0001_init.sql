-- StudySharper Database Schema
-- This migration can be run safely multiple times
-- Run this in Supabase SQL Editor after deleting tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop all tables if they exist (in correct order due to dependencies)
DROP TABLE IF EXISTS team_study_members CASCADE;
DROP TABLE IF EXISTS team_study_rooms CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS usage_tracking CASCADE;
DROP TABLE IF EXISTS pomodoro_sessions CASCADE;
DROP TABLE IF EXISTS study_streaks CASCADE;
DROP TABLE IF EXISTS study_goals CASCADE;
DROP TABLE IF EXISTS ai_conversations CASCADE;
DROP TABLE IF EXISTS flashcards CASCADE;
DROP TABLE IF EXISTS flashcard_decks CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop functions and triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at();

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro')),
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'inactive')),
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    ai_queries_used INTEGER DEFAULT 0,
    ai_queries_limit INTEGER DEFAULT 100,
    ai_queries_reset_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 days',
    monthly_cost DECIMAL(10, 2) DEFAULT 0.00,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create study_sessions table
CREATE TABLE study_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT,
    duration_minutes INTEGER NOT NULL,
    focus_score INTEGER CHECK (focus_score >= 0 AND focus_score <= 100),
    notes TEXT,
    techniques_used TEXT[],
    mood_before TEXT CHECK (mood_before IN ('excited', 'motivated', 'neutral', 'tired', 'stressed')),
    mood_after TEXT CHECK (mood_after IN ('accomplished', 'satisfied', 'neutral', 'frustrated', 'exhausted')),
    completed BOOLEAN DEFAULT false,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create notes table
CREATE TABLE notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_html TEXT,
    subject TEXT,
    tags TEXT[],
    is_public BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    study_session_id UUID REFERENCES study_sessions(id) ON DELETE SET NULL,
    ai_summary TEXT,
    key_concepts TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create flashcard_decks table first (no dependencies)
CREATE TABLE flashcard_decks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT,
    is_public BOOLEAN DEFAULT false,
    card_count INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create flashcards table (references flashcard_decks)
CREATE TABLE flashcards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    deck_id UUID REFERENCES flashcard_decks(id) ON DELETE CASCADE,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    notes TEXT,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    last_reviewed TIMESTAMP WITH TIME ZONE,
    next_review TIMESTAMP WITH TIME ZONE,
    review_count INTEGER DEFAULT 0,
    success_rate DECIMAL(3, 2) DEFAULT 0.00,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create ai_conversations table
CREATE TABLE ai_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    context TEXT,
    messages JSONB NOT NULL DEFAULT '[]',
    tokens_used INTEGER DEFAULT 0,
    model TEXT DEFAULT 'claude-3-sonnet',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create study_goals table
CREATE TABLE study_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_hours INTEGER,
    target_sessions INTEGER,
    deadline DATE,
    subject TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
    progress_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create study_streaks table
CREATE TABLE study_streaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_study_date DATE,
    total_study_days INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create pomodoro_sessions table
CREATE TABLE pomodoro_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    study_session_id UUID REFERENCES study_sessions(id) ON DELETE CASCADE,
    work_duration INTEGER DEFAULT 25,
    break_duration INTEGER DEFAULT 5,
    cycles_completed INTEGER DEFAULT 0,
    total_focus_time INTEGER DEFAULT 0,
    interruptions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create usage_tracking table
CREATE TABLE usage_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    action TEXT NOT NULL,
    metadata JSONB,
    cost_usd DECIMAL(10, 6) DEFAULT 0.000000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create referrals table
CREATE TABLE referrals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    referred_email TEXT NOT NULL,
    referred_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
    reward_claimed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(referrer_id, referred_email)
);

-- Create achievements table
CREATE TABLE achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    UNIQUE(user_id, type)
);

-- Create team_study_rooms table
CREATE TABLE team_study_rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    max_members INTEGER DEFAULT 10,
    current_members INTEGER DEFAULT 1,
    subject TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create team_study_members table
CREATE TABLE team_study_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES team_study_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_stripe_customer ON profiles(stripe_customer_id);
CREATE INDEX idx_study_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_notes_user ON notes(user_id);
CREATE INDEX idx_notes_subject ON notes(subject);
CREATE INDEX idx_flashcards_user ON flashcards(user_id);
CREATE INDEX idx_flashcards_deck ON flashcards(deck_id);
CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_usage_tracking_user ON usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_created ON usage_tracking(created_at);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_study_members ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Study sessions policies
CREATE POLICY "Users can view own study sessions" ON study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own study sessions" ON study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study sessions" ON study_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own study sessions" ON study_sessions FOR DELETE USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Users can view own notes" ON notes FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can create own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);

-- Flashcards policies
CREATE POLICY "Users can view own flashcards" ON flashcards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own flashcards" ON flashcards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcards" ON flashcards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own flashcards" ON flashcards FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other tables
CREATE POLICY "Users can manage own flashcard decks" ON flashcard_decks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own AI conversations" ON ai_conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own study goals" ON study_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own study streaks" ON study_streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own pomodoro sessions" ON pomodoro_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own usage tracking" ON usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own referrals" ON referrals FOR ALL USING (auth.uid() = referrer_id);
CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);

-- Team study room policies
CREATE POLICY "Users can view public rooms or rooms they're in" ON team_study_rooms 
    FOR SELECT USING (
        is_public = true OR 
        owner_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM team_study_members WHERE room_id = id AND user_id = auth.uid())
    );
CREATE POLICY "Users can create rooms" ON team_study_rooms FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their rooms" ON team_study_rooms FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete their rooms" ON team_study_rooms FOR DELETE USING (auth.uid() = owner_id);

-- Team members policies
CREATE POLICY "Members can view room members" ON team_study_members 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM team_study_members tsm WHERE tsm.room_id = room_id AND tsm.user_id = auth.uid())
    );
CREATE POLICY "Users can join rooms" ON team_study_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave rooms" ON team_study_members FOR DELETE USING (auth.uid() = user_id);

-- Create functions for triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_study_sessions_updated_at BEFORE UPDATE ON study_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON flashcards FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_flashcard_decks_updated_at BEFORE UPDATE ON flashcard_decks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_study_goals_updated_at BEFORE UPDATE ON study_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_study_streaks_updated_at BEFORE UPDATE ON study_streaks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_team_study_rooms_updated_at BEFORE UPDATE ON team_study_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    
    INSERT INTO study_streaks (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Verification: Check that all tables were created
DO $$
DECLARE
    table_count INTEGER;
    expected_tables TEXT[] := ARRAY[
        'profiles', 'study_sessions', 'notes', 'flashcards', 'flashcard_decks',
        'ai_conversations', 'study_goals', 'study_streaks', 'pomodoro_sessions',
        'usage_tracking', 'referrals', 'achievements', 'team_study_rooms', 'team_study_members'
    ];
    missing_tables TEXT[] := ARRAY[]::TEXT[];
    current_table TEXT;
BEGIN
    -- Check each expected table
    FOREACH current_table IN ARRAY expected_tables
    LOOP
        SELECT COUNT(*) INTO table_count
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = current_table;
        
        IF table_count = 0 THEN
            missing_tables := array_append(missing_tables, current_table);
        END IF;
    END LOOP;
    
    -- Report results
    IF array_length(missing_tables, 1) IS NULL THEN
        RAISE NOTICE '✅ SUCCESS: All % tables created successfully!', array_length(expected_tables, 1);
        RAISE NOTICE '📊 Created tables: %', array_to_string(expected_tables, ', ');
    ELSE
        RAISE EXCEPTION '❌ MISSING TABLES: %', array_to_string(missing_tables, ', ');
    END IF;
END
$$;

-- Final summary
SELECT 
    'StudySharper Database Migration Complete!' as message,
    COUNT(*) as tables_created
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'profiles', 'study_sessions', 'notes', 'flashcards', 'flashcard_decks',
    'ai_conversations', 'study_goals', 'study_streaks', 'pomodoro_sessions',
    'usage_tracking', 'referrals', 'achievements', 'team_study_rooms', 'team_study_members'
);