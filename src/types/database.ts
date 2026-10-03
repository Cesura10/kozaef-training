/**
 * Tipos de la base de datos (escritos a mano; reflejan supabase/migrations/).
 *
 * Cuando tengas la CLI conectada a un proyecto puedes regenerarlos con:
 *   npx supabase gen types typescript --linked > src/types/database.ts
 */

export type UserRole = 'trainer' | 'client';

type Timestamp = string;

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          trainer_id: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id: string;
          role?: UserRole;
          trainer_id?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: Timestamp;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      exercise_library: {
        Row: {
          id: string;
          trainer_id: string;
          name: string;
          muscle_group: string | null;
          video_url: string | null;
          instructions: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          name: string;
          muscle_group?: string | null;
          video_url?: string | null;
          instructions?: string | null;
          created_at?: Timestamp;
        };
        Update: Partial<Database['public']['Tables']['exercise_library']['Insert']>;
        Relationships: [];
      };
      routines: {
        Row: {
          id: string;
          client_id: string;
          trainer_id: string;
          name: string;
          active: boolean;
          start_date: string | null;
          end_date: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          client_id: string;
          trainer_id: string;
          name: string;
          active?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: Timestamp;
        };
        Update: Partial<Database['public']['Tables']['routines']['Insert']>;
        Relationships: [];
      };
      routine_days: {
        Row: {
          id: string;
          routine_id: string;
          day_label: string | null;
          day_order: number | null;
        };
        Insert: {
          id?: string;
          routine_id: string;
          day_label?: string | null;
          day_order?: number | null;
        };
        Update: Partial<Database['public']['Tables']['routine_days']['Insert']>;
        Relationships: [];
      };
      routine_exercises: {
        Row: {
          id: string;
          routine_day_id: string;
          exercise_id: string | null;
          sets: number | null;
          reps: string | null;
          rest_seconds: number | null;
          notes: string | null;
          exercise_order: number | null;
        };
        Insert: {
          id?: string;
          routine_day_id: string;
          exercise_id?: string | null;
          sets?: number | null;
          reps?: string | null;
          rest_seconds?: number | null;
          notes?: string | null;
          exercise_order?: number | null;
        };
        Update: Partial<Database['public']['Tables']['routine_exercises']['Insert']>;
        Relationships: [];
      };
      exercise_logs: {
        Row: {
          id: string;
          routine_exercise_id: string;
          client_id: string;
          set_number: number | null;
          weight: number | null;
          reps_done: number | null;
          rpe: number | null;
          logged_at: Timestamp;
        };
        Insert: {
          id?: string;
          routine_exercise_id: string;
          client_id: string;
          set_number?: number | null;
          weight?: number | null;
          reps_done?: number | null;
          rpe?: number | null;
          logged_at?: Timestamp;
        };
        Update: Partial<Database['public']['Tables']['exercise_logs']['Insert']>;
        Relationships: [];
      };
      diets: {
        Row: {
          id: string;
          client_id: string;
          trainer_id: string;
          name: string | null;
          kcal_target: number | null;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
          active: boolean;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          client_id: string;
          trainer_id: string;
          name?: string | null;
          kcal_target?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          active?: boolean;
          created_at?: Timestamp;
        };
        Update: Partial<Database['public']['Tables']['diets']['Insert']>;
        Relationships: [];
      };
      diet_meals: {
        Row: {
          id: string;
          diet_id: string;
          meal_block: string | null;
          description: string | null;
          kcal: number | null;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
          meal_order: number | null;
        };
        Insert: {
          id?: string;
          diet_id: string;
          meal_block?: string | null;
          description?: string | null;
          kcal?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          meal_order?: number | null;
        };
        Update: Partial<Database['public']['Tables']['diet_meals']['Insert']>;
        Relationships: [];
      };
      check_ins: {
        Row: {
          id: string;
          client_id: string;
          trainer_id: string;
          weight: number | null;
          waist_cm: number | null;
          notes_client: string | null;
          notes_trainer: string | null;
          reviewed: boolean;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          client_id: string;
          trainer_id: string;
          weight?: number | null;
          waist_cm?: number | null;
          notes_client?: string | null;
          notes_trainer?: string | null;
          reviewed?: boolean;
          created_at?: Timestamp;
        };
        Update: Partial<Database['public']['Tables']['check_ins']['Insert']>;
        Relationships: [];
      };
      check_in_photos: {
        Row: {
          id: string;
          check_in_id: string;
          storage_path: string;
          angle: string | null;
        };
        Insert: {
          id?: string;
          check_in_id: string;
          storage_path: string;
          angle?: string | null;
        };
        Update: Partial<Database['public']['Tables']['check_in_photos']['Insert']>;
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          client_id: string;
          trainer_id: string;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          client_id: string;
          trainer_id: string;
          created_at?: Timestamp;
        };
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string | null;
          read_at: Timestamp | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          body?: string | null;
          read_at?: Timestamp | null;
          created_at?: Timestamp;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
        Relationships: [];
      };
      community_posts: {
        Row: {
          id: string;
          author_id: string | null;
          trainer_id: string | null;
          body: string | null;
          media_url: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          author_id?: string | null;
          trainer_id?: string | null;
          body?: string | null;
          media_url?: string | null;
          created_at?: Timestamp;
        };
        Update: Partial<Database['public']['Tables']['community_posts']['Insert']>;
        Relationships: [];
      };
      community_comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string | null;
          body: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id?: string | null;
          body?: string | null;
          created_at?: Timestamp;
        };
        Update: Partial<Database['public']['Tables']['community_comments']['Insert']>;
        Relationships: [];
      };
      // Provisional hasta regenerar con la CLI (migración 20261003120000_leads_and_limits).
      feature_flags: {
        Row: { key: string; enabled: boolean; value: Json | null; updated_at: Timestamp };
        Insert: { key: string; enabled?: boolean; value?: Json | null; updated_at?: Timestamp };
        Update: Partial<Database['public']['Tables']['feature_flags']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      my_role: { Args: Record<string, never>; Returns: UserRole };
      is_trainer: { Args: Record<string, never>; Returns: boolean };
      my_trainer_id: { Args: Record<string, never>; Returns: string | null };
      owns_client: { Args: { target: string }; Returns: boolean };
      check_rate_limit: {
        Args: { p_key: string; p_max: number; p_window_seconds: number };
        Returns: boolean;
      };
      bump_daily_counter: { Args: { p_name: string; p_cap: number }; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
}

/** Atajo: fila de una tabla pública. */
export type Row<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
