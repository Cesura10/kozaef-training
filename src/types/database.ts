// GENERADO con: npx supabase gen types typescript --linked > src/types/database.ts
// No editar a mano: regenerar tras cada migración y volver a añadir los atajos del final.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      applications: {
        Row: {
          answers: Json
          booking_token: string | null
          created_at: string
          email: string
          id: string
          lead_id: string | null
          name: string | null
          notes: string | null
          score: number
          status: Database["public"]["Enums"]["application_status"]
          token_used_at: string | null
          updated_at: string
        }
        Insert: {
          answers: Json
          booking_token?: string | null
          created_at?: string
          email: string
          id?: string
          lead_id?: string | null
          name?: string | null
          notes?: string | null
          score?: number
          status?: Database["public"]["Enums"]["application_status"]
          token_used_at?: string | null
          updated_at?: string
        }
        Update: {
          answers?: Json
          booking_token?: string | null
          created_at?: string
          email?: string
          id?: string
          lead_id?: string | null
          name?: string | null
          notes?: string | null
          score?: number
          status?: Database["public"]["Enums"]["application_status"]
          token_used_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      check_in_photos: {
        Row: {
          angle: string | null
          check_in_id: string
          id: string
          storage_path: string
        }
        Insert: {
          angle?: string | null
          check_in_id: string
          id?: string
          storage_path: string
        }
        Update: {
          angle?: string | null
          check_in_id?: string
          id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_in_photos_check_in_id_fkey"
            columns: ["check_in_id"]
            isOneToOne: false
            referencedRelation: "check_ins"
            referencedColumns: ["id"]
          },
        ]
      }
      check_ins: {
        Row: {
          client_id: string
          created_at: string
          id: string
          notes_client: string | null
          notes_trainer: string | null
          reviewed: boolean
          trainer_id: string
          waist_cm: number | null
          weight: number | null
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          notes_client?: string | null
          notes_trainer?: string | null
          reviewed?: boolean
          trainer_id: string
          waist_cm?: number | null
          weight?: number | null
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          notes_client?: string | null
          notes_trainer?: string | null
          reviewed?: boolean
          trainer_id?: string
          waist_cm?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "check_ins_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          author_id: string | null
          body: string | null
          created_at: string
          id: string
          post_id: string
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          post_id: string
        }
        Update: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string | null
          body: string | null
          created_at: string
          id: string
          media_url: string | null
          trainer_id: string | null
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          media_url?: string | null
          trainer_id?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          media_url?: string | null
          trainer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          client_id: string
          created_at: string
          id: string
          trainer_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          trainer_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_counters: {
        Row: {
          count: number
          day: string
          name: string
        }
        Insert: {
          count?: number
          day?: string
          name: string
        }
        Update: {
          count?: number
          day?: string
          name?: string
        }
        Relationships: []
      }
      diet_meals: {
        Row: {
          carbs_g: number | null
          description: string | null
          diet_id: string
          fat_g: number | null
          id: string
          kcal: number | null
          meal_block: string | null
          meal_order: number | null
          protein_g: number | null
        }
        Insert: {
          carbs_g?: number | null
          description?: string | null
          diet_id: string
          fat_g?: number | null
          id?: string
          kcal?: number | null
          meal_block?: string | null
          meal_order?: number | null
          protein_g?: number | null
        }
        Update: {
          carbs_g?: number | null
          description?: string | null
          diet_id?: string
          fat_g?: number | null
          id?: string
          kcal?: number | null
          meal_block?: string | null
          meal_order?: number | null
          protein_g?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "diet_meals_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diets"
            referencedColumns: ["id"]
          },
        ]
      }
      diets: {
        Row: {
          active: boolean
          carbs_g: number | null
          client_id: string
          created_at: string
          fat_g: number | null
          id: string
          kcal_target: number | null
          name: string | null
          protein_g: number | null
          trainer_id: string
        }
        Insert: {
          active?: boolean
          carbs_g?: number | null
          client_id: string
          created_at?: string
          fat_g?: number | null
          id?: string
          kcal_target?: number | null
          name?: string | null
          protein_g?: number | null
          trainer_id: string
        }
        Update: {
          active?: boolean
          carbs_g?: number | null
          client_id?: string
          created_at?: string
          fat_g?: number | null
          id?: string
          kcal_target?: number | null
          name?: string | null
          protein_g?: number | null
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diets_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_library: {
        Row: {
          created_at: string
          id: string
          instructions: string | null
          muscle_group: string | null
          name: string
          trainer_id: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          instructions?: string | null
          muscle_group?: string | null
          name: string
          trainer_id: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          instructions?: string | null
          muscle_group?: string | null
          name?: string
          trainer_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_library_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_logs: {
        Row: {
          client_id: string
          id: string
          logged_at: string
          reps_done: number | null
          routine_exercise_id: string
          rpe: number | null
          set_number: number | null
          weight: number | null
        }
        Insert: {
          client_id: string
          id?: string
          logged_at?: string
          reps_done?: number | null
          routine_exercise_id: string
          rpe?: number | null
          set_number?: number | null
          weight?: number | null
        }
        Update: {
          client_id?: string
          id?: string
          logged_at?: string
          reps_done?: number | null
          routine_exercise_id?: string
          rpe?: number | null
          set_number?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_logs_routine_exercise_id_fkey"
            columns: ["routine_exercise_id"]
            isOneToOne: false
            referencedRelation: "routine_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          enabled: boolean
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          enabled?: boolean
          key: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          enabled?: boolean
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
      lead_events: {
        Row: {
          created_at: string
          data: Json
          id: number
          lead_id: string
          type: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: never
          lead_id: string
          type: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: never
          lead_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          confirmed_at: string | null
          consent_at: string | null
          consent_text: string | null
          created_at: string
          email: string
          first_tool: string | null
          id: string
          locale: string
          marketing_consent: boolean
          source: string | null
          unsubscribed_at: string | null
          updated_at: string
          utm: Json
        }
        Insert: {
          confirmed_at?: string | null
          consent_at?: string | null
          consent_text?: string | null
          created_at?: string
          email: string
          first_tool?: string | null
          id?: string
          locale?: string
          marketing_consent?: boolean
          source?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
          utm?: Json
        }
        Update: {
          confirmed_at?: string | null
          consent_at?: string | null
          consent_text?: string | null
          created_at?: string
          email?: string
          first_tool?: string | null
          id?: string
          locale?: string
          marketing_consent?: boolean
          source?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
          utm?: Json
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string | null
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          body?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          body?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          trainer_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          trainer_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          trainer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          hits: number
          key: string
          window_start: string
        }
        Insert: {
          hits?: number
          key: string
          window_start?: string
        }
        Update: {
          hits?: number
          key?: string
          window_start?: string
        }
        Relationships: []
      }
      routine_days: {
        Row: {
          day_label: string | null
          day_order: number | null
          id: string
          routine_id: string
        }
        Insert: {
          day_label?: string | null
          day_order?: number | null
          id?: string
          routine_id: string
        }
        Update: {
          day_label?: string | null
          day_order?: number | null
          id?: string
          routine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_days_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_exercises: {
        Row: {
          exercise_id: string | null
          exercise_order: number | null
          id: string
          notes: string | null
          reps: string | null
          rest_seconds: number | null
          routine_day_id: string
          sets: number | null
        }
        Insert: {
          exercise_id?: string | null
          exercise_order?: number | null
          id?: string
          notes?: string | null
          reps?: string | null
          rest_seconds?: number | null
          routine_day_id: string
          sets?: number | null
        }
        Update: {
          exercise_id?: string | null
          exercise_order?: number | null
          id?: string
          notes?: string | null
          reps?: string | null
          rest_seconds?: number | null
          routine_day_id?: string
          sets?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "routine_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercise_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_exercises_routine_day_id_fkey"
            columns: ["routine_day_id"]
            isOneToOne: false
            referencedRelation: "routine_days"
            referencedColumns: ["id"]
          },
        ]
      }
      routines: {
        Row: {
          active: boolean
          client_id: string
          created_at: string
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          trainer_id: string
        }
        Insert: {
          active?: boolean
          client_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          trainer_id: string
        }
        Update: {
          active?: boolean
          client_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routines_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routines_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scoring_rules: {
        Row: {
          active: boolean
          answer: string
          id: number
          points: number
          question: string
        }
        Insert: {
          active?: boolean
          answer: string
          id?: never
          points: number
          question: string
        }
        Update: {
          active?: boolean
          answer?: string
          id?: never
          points?: number
          question?: string
        }
        Relationships: []
      }
      shows: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          summary: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          summary: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          summary?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      summaries: {
        Row: {
          clip_list: Json | null
          content_markdown: string | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          request_id: string | null
          version: number | null
        }
        Insert: {
          clip_list?: Json | null
          content_markdown?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          request_id?: string | null
          version?: number | null
        }
        Update: {
          clip_list?: Json | null
          content_markdown?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          request_id?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "summaries_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "summary_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      summary_requests: {
        Row: {
          created_at: string | null
          id: string
          mode: string | null
          show_id: string | null
          status: string | null
          up_to_episode: number | null
          up_to_season: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mode?: string | null
          show_id?: string | null
          status?: string | null
          up_to_episode?: number | null
          up_to_season?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mode?: string | null
          show_id?: string | null
          status?: string | null
          up_to_episode?: number | null
          up_to_season?: number | null
          user_id?: string
        }
        Relationships: []
      }
      tool_results: {
        Row: {
          created_at: string
          id: number
          inputs: Json
          lead_id: string | null
          outputs: Json
          tool: string
        }
        Insert: {
          created_at?: string
          id?: never
          inputs: Json
          lead_id?: string | null
          outputs: Json
          tool: string
        }
        Update: {
          created_at?: string
          id?: never
          inputs?: Json
          lead_id?: string | null
          outputs?: Json
          tool?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_results_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bump_daily_counter: {
        Args: { p_cap: number; p_name: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: { p_key: string; p_max: number; p_window_seconds: number }
        Returns: boolean
      }
      is_trainer: { Args: never; Returns: boolean }
      my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      my_trainer_id: { Args: never; Returns: string }
      owns_client: { Args: { target: string }; Returns: boolean }
    }
    Enums: {
      application_status:
        | "new"
        | "qualified"
        | "rejected"
        | "booked"
        | "won"
        | "lost"
        | "waitlist"
      user_role: "trainer" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      application_status: [
        "new",
        "qualified",
        "rejected",
        "booked",
        "won",
        "lost",
        "waitlist",
      ],
      user_role: ["trainer", "client"],
    },
  },
} as const

// --- Atajos del proyecto ------------------------------------------------------
/** Fila de una tabla pública. */
export type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type UserRole = Database['public']['Enums']['user_role'];
