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
      skills: {
        Row: {
          id: string
          user_id: string
          title: string
          category: 'music' | 'fitness' | 'learning' | 'creative' | 'other'
          description: string | null
          created_at: string
          archived_at: string | null
          target_date: string | null
          total_xp: number
          streak_count: number
          last_active_at: string | null
          cover_emoji: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category: 'music' | 'fitness' | 'learning' | 'creative' | 'other'
          description?: string | null
          created_at?: string
          archived_at?: string | null
          target_date?: string | null
          total_xp?: number
          streak_count?: number
          last_active_at?: string | null
          cover_emoji?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: 'music' | 'fitness' | 'learning' | 'creative' | 'other'
          description?: string | null
          created_at?: string
          archived_at?: string | null
          target_date?: string | null
          total_xp?: number
          streak_count?: number
          last_active_at?: string | null
          cover_emoji?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'skills_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      milestones: {
        Row: {
          id: string
          skill_id: string
          title: string
          description: string | null
          weight_percent: number
          order_index: number
          status: 'not_started' | 'in_progress' | 'completed'
          is_locked: boolean
          unlock_after_milestone_id: string | null
          estimated_minutes: number | null
          completed_at: string | null
          xp_reward: number
        }
        Insert: {
          id?: string
          skill_id: string
          title: string
          description?: string | null
          weight_percent: number
          order_index: number
          status?: 'not_started' | 'in_progress' | 'completed'
          is_locked?: boolean
          unlock_after_milestone_id?: string | null
          estimated_minutes?: number | null
          completed_at?: string | null
          xp_reward?: number
        }
        Update: {
          id?: string
          skill_id?: string
          title?: string
          description?: string | null
          weight_percent?: number
          order_index?: number
          status?: 'not_started' | 'in_progress' | 'completed'
          is_locked?: boolean
          unlock_after_milestone_id?: string | null
          estimated_minutes?: number | null
          completed_at?: string | null
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: 'milestones_skill_id_fkey'
            columns: ['skill_id']
            referencedRelation: 'skills'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'milestones_unlock_after_milestone_id_fkey'
            columns: ['unlock_after_milestone_id']
            referencedRelation: 'milestones'
            referencedColumns: ['id']
          }
        ]
      }
      sessions: {
        Row: {
          id: string
          milestone_id: string
          user_id: string
          note: string | null
          mood: 'great' | 'okay' | 'struggled' | null
          created_at: string
          duration_minutes: number | null
        }
        Insert: {
          id?: string
          milestone_id: string
          user_id: string
          note?: string | null
          mood?: 'great' | 'okay' | 'struggled' | null
          created_at?: string
          duration_minutes?: number | null
        }
        Update: {
          id?: string
          milestone_id?: string
          user_id?: string
          note?: string | null
          mood?: 'great' | 'okay' | 'struggled' | null
          created_at?: string
          duration_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'sessions_milestone_id_fkey'
            columns: ['milestone_id']
            referencedRelation: 'milestones'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sessions_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      skill_category: 'music' | 'fitness' | 'learning' | 'creative' | 'other'
      milestone_status: 'not_started' | 'in_progress' | 'completed'
      session_mood: 'great' | 'okay' | 'struggled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Insert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type Update<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Skill = Tables<'skills'>
export type Milestone = Tables<'milestones'>
export type Session = Tables<'sessions'>
