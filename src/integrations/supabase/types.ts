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
  public: {
    Tables: {
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      lesson_attachments: {
        Row: {
          created_at: string
          file_url: string
          id: string
          lesson_id: string
          mime: string | null
          name: string
          position: number
          size_bytes: number | null
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          lesson_id: string
          mime?: string | null
          name: string
          position?: number
          size_bytes?: number | null
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          lesson_id?: string
          mime?: string | null
          name?: string
          position?: number
          size_bytes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_attachments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_ctas: {
        Row: {
          created_at: string
          id: string
          label: string
          lesson_id: string
          position: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          lesson_id: string
          position?: number
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          lesson_id?: string
          position?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_ctas_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          last_watched_at: string
          lesson_id: string
          updated_at: string
          user_id: string
          watched_seconds: number
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          last_watched_at?: string
          lesson_id: string
          updated_at?: string
          user_id: string
          watched_seconds?: number
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          last_watched_at?: string
          lesson_id?: string
          updated_at?: string
          user_id?: string
          watched_seconds?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content_mode: string
          created_at: string
          cta_enabled: boolean
          cta_label: string | null
          cta_url: string | null
          description: string | null
          duration_seconds: number | null
          header_image_url: string | null
          id: string
          module_id: string
          position: number
          published: boolean
          release_days: number
          status: string
          text_content: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          vturb_optimization_code: string | null
          vturb_player_id: string | null
          youtube_id: string | null
          youtube_url: string | null
        }
        Insert: {
          content_mode?: string
          created_at?: string
          cta_enabled?: boolean
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          duration_seconds?: number | null
          header_image_url?: string | null
          id?: string
          module_id: string
          position?: number
          published?: boolean
          release_days?: number
          status?: string
          text_content?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          vturb_optimization_code?: string | null
          vturb_player_id?: string | null
          youtube_id?: string | null
          youtube_url?: string | null
        }
        Update: {
          content_mode?: string
          created_at?: string
          cta_enabled?: boolean
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          duration_seconds?: number | null
          header_image_url?: string | null
          id?: string
          module_id?: string
          position?: number
          published?: boolean
          release_days?: number
          status?: string
          text_content?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          vturb_optimization_code?: string | null
          vturb_player_id?: string | null
          youtube_id?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      member_access: {
        Row: {
          active: boolean
          area_id: string | null
          granted_at: string
          id: string
          order_id: string | null
          product: string
          user_id: string
        }
        Insert: {
          active?: boolean
          area_id?: string | null
          granted_at?: string
          id?: string
          order_id?: string | null
          product?: string
          user_id: string
        }
        Update: {
          active?: boolean
          area_id?: string | null
          granted_at?: string
          id?: string
          order_id?: string | null
          product?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_access_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      member_areas: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          product: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          product: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          product?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      meta_capi_log: {
        Row: {
          created_at: string
          error: string | null
          event_id: string | null
          event_name: string
          id: string
          meta_response: Json | null
          order_id: string | null
          session_id: string | null
          status_code: number | null
          success: boolean
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          value: number | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          event_id?: string | null
          event_name: string
          id?: string
          meta_response?: Json | null
          order_id?: string | null
          session_id?: string | null
          status_code?: number | null
          success?: boolean
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string
          error?: string | null
          event_id?: string | null
          event_name?: string
          id?: string
          meta_response?: Json | null
          order_id?: string | null
          session_id?: string | null
          status_code?: number | null
          success?: boolean
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          value?: number | null
        }
        Relationships: []
      }
      module_categories: {
        Row: {
          area_id: string | null
          created_at: string
          id: string
          name: string
          position: number
          product: string | null
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          created_at?: string
          id?: string
          name: string
          position?: number
          product?: string | null
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          created_at?: string
          id?: string
          name?: string
          position?: number
          product?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          area_id: string | null
          category: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          kind: string
          position: number
          price_cents: number | null
          product: string
          published: boolean
          release_days: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          position?: number
          price_cents?: number | null
          product?: string
          published?: boolean
          release_days?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          position?: number
          price_cents?: number | null
          product?: string
          published?: boolean
          release_days?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount_cents: number
          area_id: string | null
          created_at: string
          customer_cpf: string
          customer_email: string
          customer_name: string
          customer_phone: string
          efi_charge_id: string | null
          efi_txid: string | null
          event_id_purchase: string | null
          gateway_txid: string | null
          id: string
          installments: number | null
          meta_purchase_sent_at: string | null
          paid_at: string | null
          payment_method: string
          pix_gateway: string | null
          product: string
          raw: Json | null
          session_id: string | null
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          amount_cents: number
          area_id?: string | null
          created_at?: string
          customer_cpf: string
          customer_email: string
          customer_name: string
          customer_phone: string
          efi_charge_id?: string | null
          efi_txid?: string | null
          event_id_purchase?: string | null
          gateway_txid?: string | null
          id?: string
          installments?: number | null
          meta_purchase_sent_at?: string | null
          paid_at?: string | null
          payment_method: string
          pix_gateway?: string | null
          product: string
          raw?: Json | null
          session_id?: string | null
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          amount_cents?: number
          area_id?: string | null
          created_at?: string
          customer_cpf?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          efi_charge_id?: string | null
          efi_txid?: string | null
          event_id_purchase?: string | null
          gateway_txid?: string | null
          id?: string
          installments?: number | null
          meta_purchase_sent_at?: string | null
          paid_at?: string | null
          payment_method?: string
          pix_gateway?: string | null
          product?: string
          raw?: Json | null
          session_id?: string | null
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      payment_settings: {
        Row: {
          active_pix_gateway: string
          efi_cert_pem: string | null
          efi_client_id: string | null
          efi_client_secret: string | null
          efi_key_pem: string | null
          efi_payee_code: string | null
          efi_pix_key: string | null
          id: number
          updated_at: string
          updated_by: string | null
          zzgate_client_id: string | null
          zzgate_client_secret: string | null
        }
        Insert: {
          active_pix_gateway?: string
          efi_cert_pem?: string | null
          efi_client_id?: string | null
          efi_client_secret?: string | null
          efi_key_pem?: string | null
          efi_payee_code?: string | null
          efi_pix_key?: string | null
          id?: number
          updated_at?: string
          updated_by?: string | null
          zzgate_client_id?: string | null
          zzgate_client_secret?: string | null
        }
        Update: {
          active_pix_gateway?: string
          efi_cert_pem?: string | null
          efi_client_id?: string | null
          efi_client_secret?: string | null
          efi_key_pem?: string | null
          efi_payee_code?: string | null
          efi_pix_key?: string | null
          id?: number
          updated_at?: string
          updated_by?: string | null
          zzgate_client_id?: string | null
          zzgate_client_secret?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      rp_close_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          instagram: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          instagram: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          instagram?: string
          name?: string
        }
        Relationships: []
      }
      share_links: {
        Row: {
          area_id: string | null
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          label: string | null
          token: string
        }
        Insert: {
          area_id?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          label?: string | null
          token: string
        }
        Update: {
          area_id?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          label?: string | null
          token?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          category_color: string | null
          category_color_enabled: boolean
          footer_gradient_color: string | null
          footer_gradient_enabled: boolean
          hero_description: string | null
          hero_description_html: string | null
          hero_media_type: string | null
          hero_media_url: string | null
          hero_title: string | null
          hero_title_html: string | null
          id: number
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category_color?: string | null
          category_color_enabled?: boolean
          footer_gradient_color?: string | null
          footer_gradient_enabled?: boolean
          hero_description?: string | null
          hero_description_html?: string | null
          hero_media_type?: string | null
          hero_media_url?: string | null
          hero_title?: string | null
          hero_title_html?: string | null
          id?: number
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category_color?: string | null
          category_color_enabled?: boolean
          footer_gradient_color?: string | null
          footer_gradient_enabled?: boolean
          hero_description?: string | null
          hero_description_html?: string | null
          hero_media_type?: string | null
          hero_media_url?: string | null
          hero_title?: string | null
          hero_title_html?: string | null
          id?: number
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tracking_pixels: {
        Row: {
          access_token: string | null
          active: boolean
          area_id: string | null
          created_at: string
          id: string
          label: string | null
          pixel_id: string
          platform: string
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          active?: boolean
          area_id?: string | null
          created_at?: string
          id?: string
          label?: string | null
          pixel_id: string
          platform: string
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          active?: boolean
          area_id?: string | null
          created_at?: string
          id?: string
          label?: string | null
          pixel_id?: string
          platform?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_sessions: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          event_id_initiate: string | null
          event_id_initiate_tt: string | null
          event_id_pageview: string | null
          event_id_pageview_tt: string | null
          event_id_purchase_tt: string | null
          external_id: string | null
          fbc: string | null
          fbclid: string | null
          fbp: string | null
          first_name: string | null
          id: string
          ip_address: string | null
          last_name: string | null
          page_location: string | null
          phone: string | null
          sck: string
          state: string | null
          ttclid: string | null
          ttp: string | null
          updated_at: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          event_id_initiate?: string | null
          event_id_initiate_tt?: string | null
          event_id_pageview?: string | null
          event_id_pageview_tt?: string | null
          event_id_purchase_tt?: string | null
          external_id?: string | null
          fbc?: string | null
          fbclid?: string | null
          fbp?: string | null
          first_name?: string | null
          id?: string
          ip_address?: string | null
          last_name?: string | null
          page_location?: string | null
          phone?: string | null
          sck: string
          state?: string | null
          ttclid?: string | null
          ttp?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          event_id_initiate?: string | null
          event_id_initiate_tt?: string | null
          event_id_pageview?: string | null
          event_id_pageview_tt?: string | null
          event_id_purchase_tt?: string | null
          external_id?: string | null
          fbc?: string | null
          fbclid?: string | null
          fbp?: string | null
          first_name?: string | null
          id?: string
          ip_address?: string | null
          last_name?: string | null
          page_location?: string | null
          phone?: string | null
          sck?: string
          state?: string | null
          ttclid?: string | null
          ttp?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      webauthn_challenges: {
        Row: {
          challenge: string
          created_at: string
          email: string | null
          expires_at: string
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          challenge: string
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          challenge?: string
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      webauthn_credentials: {
        Row: {
          counter: number
          created_at: string
          credential_id: string
          device_name: string | null
          id: string
          last_used_at: string | null
          public_key: string
          transports: string[] | null
          user_id: string
        }
        Insert: {
          counter?: number
          created_at?: string
          credential_id: string
          device_name?: string | null
          id?: string
          last_used_at?: string | null
          public_key: string
          transports?: string[] | null
          user_id: string
        }
        Update: {
          counter?: number
          created_at?: string
          credential_id?: string
          device_name?: string | null
          id?: string
          last_used_at?: string | null
          public_key?: string
          transports?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_active_tracking_pixels: {
        Args: never
        Returns: {
          id: string
          pixel_id: string
          platform: string
        }[]
      }
      get_lesson_module_meta: {
        Args: { _lesson_id: string }
        Returns: {
          lesson_id: string
          lesson_published: boolean
          lesson_title: string
          module_id: string
          module_kind: string
          module_price_cents: number
          module_published: boolean
          module_title: string
        }[]
      }
      get_user_id_by_email: { Args: { _email: string }; Returns: string }
      has_active_access: {
        Args: { _product?: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_drip_unlocked: {
        Args: { _product: string; _release_days: number; _user_id: string }
        Returns: boolean
      }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      user_owns_area: {
        Args: { _area_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student" | "master" | "super_admin"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "student", "master", "super_admin"],
    },
  },
} as const
