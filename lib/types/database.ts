export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'starter' | 'pro'
          subscription_status: 'active' | 'canceled' | 'past_due' | 'inactive'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_end: string | null
          ai_queries_used: number
          ai_queries_limit: number
          ai_queries_reset_at: string
          monthly_cost: number
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'starter' | 'pro'
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'inactive'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          ai_queries_used?: number
          ai_queries_limit?: number
          ai_queries_reset_at?: string
          monthly_cost?: number
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'starter' | 'pro'
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'inactive'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          ai_queries_used?: number
          ai_queries_limit?: number
          ai_queries_reset_at?: string
          monthly_cost?: number
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          subject: string | null
          duration_minutes: number
          focus_score: number | null
          notes: string | null
          techniques_used: string[] | null
          mood_before: 'excited' | 'motivated' | 'neutral' | 'tired' | 'stressed' | null
          mood_after: 'accomplished' | 'satisfied' | 'neutral' | 'frustrated' | 'exhausted' | null
          completed: boolean
          started_at: string
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          subject?: string | null
          duration_minutes: number
          focus_score?: number | null
          notes?: string | null
          techniques_used?: string[] | null
          mood_before?: 'excited' | 'motivated' | 'neutral' | 'tired' | 'stressed' | null
          mood_after?: 'accomplished' | 'satisfied' | 'neutral' | 'frustrated' | 'exhausted' | null
          completed?: boolean
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          subject?: string | null
          duration_minutes?: number
          focus_score?: number | null
          notes?: string | null
          techniques_used?: string[] | null
          mood_before?: 'excited' | 'motivated' | 'neutral' | 'tired' | 'stressed' | null
          mood_after?: 'accomplished' | 'satisfied' | 'neutral' | 'frustrated' | 'exhausted' | null
          completed?: boolean
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          content_html: string | null
          subject: string | null
          tags: string[] | null
          is_public: boolean
          is_archived: boolean
          study_session_id: string | null
          ai_summary: string | null
          key_concepts: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          content_html?: string | null
          subject?: string | null
          tags?: string[] | null
          is_public?: boolean
          is_archived?: boolean
          study_session_id?: string | null
          ai_summary?: string | null
          key_concepts?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          content_html?: string | null
          subject?: string | null
          tags?: string[] | null
          is_public?: boolean
          is_archived?: boolean
          study_session_id?: string | null
          ai_summary?: string | null
          key_concepts?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      flashcards: {
        Row: {
          id: string
          user_id: string
          deck_id: string | null
          front: string
          back: string
          notes: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          last_reviewed: string | null
          next_review: string | null
          review_count: number
          success_rate: number
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          deck_id?: string | null
          front: string
          back: string
          notes?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number
          success_rate?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          deck_id?: string | null
          front?: string
          back?: string
          notes?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number
          success_rate?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      flashcard_decks: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          subject: string | null
          is_public: boolean
          card_count: number
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          subject?: string | null
          is_public?: boolean
          card_count?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          subject?: string | null
          is_public?: boolean
          card_count?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          context: string | null
          messages: Json
          tokens_used: number
          model: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          context?: string | null
          messages?: Json
          tokens_used?: number
          model?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          context?: string | null
          messages?: Json
          tokens_used?: number
          model?: string
          created_at?: string
          updated_at?: string
        }
      }
      study_goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          target_hours: number | null
          target_sessions: number | null
          deadline: string | null
          subject: string | null
          status: 'active' | 'completed' | 'paused' | 'abandoned'
          progress_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target_hours?: number | null
          target_sessions?: number | null
          deadline?: string | null
          subject?: string | null
          status?: 'active' | 'completed' | 'paused' | 'abandoned'
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          target_hours?: number | null
          target_sessions?: number | null
          deadline?: string | null
          subject?: string | null
          status?: 'active' | 'completed' | 'paused' | 'abandoned'
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      study_streaks: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          longest_streak: number
          last_study_date: string | null
          total_study_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_study_date?: string | null
          total_study_days?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_study_date?: string | null
          total_study_days?: number
          created_at?: string
          updated_at?: string
        }
      }
      pomodoro_sessions: {
        Row: {
          id: string
          user_id: string
          study_session_id: string | null
          work_duration: number
          break_duration: number
          cycles_completed: number
          total_focus_time: number
          interruptions: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          study_session_id?: string | null
          work_duration?: number
          break_duration?: number
          cycles_completed?: number
          total_focus_time?: number
          interruptions?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          study_session_id?: string | null
          work_duration?: number
          break_duration?: number
          cycles_completed?: number
          total_focus_time?: number
          interruptions?: number
          created_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          user_id: string
          feature: string
          action: string
          metadata: Json | null
          cost_usd: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          feature: string
          action: string
          metadata?: Json | null
          cost_usd?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          feature?: string
          action?: string
          metadata?: Json | null
          cost_usd?: number
          created_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_email: string
          referred_id: string | null
          status: 'pending' | 'completed' | 'expired'
          reward_claimed: boolean
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_email: string
          referred_id?: string | null
          status?: 'pending' | 'completed' | 'expired'
          reward_claimed?: boolean
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_email?: string
          referred_id?: string | null
          status?: 'pending' | 'completed' | 'expired'
          reward_claimed?: boolean
          created_at?: string
          completed_at?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          type: string
          name: string
          description: string | null
          earned_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          name: string
          description?: string | null
          earned_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          name?: string
          description?: string | null
          earned_at?: string
          metadata?: Json | null
        }
      }
      team_study_rooms: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          is_public: boolean
          max_members: number
          current_members: number
          subject: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          is_public?: boolean
          max_members?: number
          current_members?: number
          subject?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          is_public?: boolean
          max_members?: number
          current_members?: number
          subject?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      team_study_members: {
        Row: {
          id: string
          room_id: string
          user_id: string
          role: 'owner' | 'moderator' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          role?: 'owner' | 'moderator' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          role?: 'owner' | 'moderator' | 'member'
          joined_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}