import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase client for browser usage (public API)
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Create a Supabase client with service role for server usage (protected API)
export const createSupabaseServerClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });
};

// Database types based on our schema
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          google_id: string;
          name: string;
          avatar_url: string;
          created_at: string;
          settings: Record<string, any> | null;
        };
        Insert: {
          id?: string;
          email: string;
          google_id: string;
          name: string;
          avatar_url?: string;
          created_at?: string;
          settings?: Record<string, any> | null;
        };
        Update: {
          id?: string;
          email?: string;
          google_id?: string;
          name?: string;
          avatar_url?: string;
          created_at?: string;
          settings?: Record<string, any> | null;
        };
      };
      tokens: {
        Row: {
          id: string;
          user_id: string;
          encrypted_refresh_token: string;
          access_token: string | null;
          expires_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          encrypted_refresh_token: string;
          access_token?: string | null;
          expires_at: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          encrypted_refresh_token?: string;
          access_token?: string | null;
          expires_at?: string;
        };
      };
      snoozes: {
        Row: {
          id: string;
          user_id: string;
          message_id: string;
          snoozed_until: string;
          original_labels: Record<string, any> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message_id: string;
          snoozed_until: string;
          original_labels?: Record<string, any> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          message_id?: string;
          snoozed_until?: string;
          original_labels?: Record<string, any> | null;
          created_at?: string;
        };
      };
      scheduled_sends: {
        Row: {
          id: string;
          user_id: string;
          draft_id: string;
          scheduled_at: string;
          status: 'pending' | 'sent' | 'failed';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          draft_id: string;
          scheduled_at: string;
          status?: 'pending' | 'sent' | 'failed';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          draft_id?: string;
          scheduled_at?: string;
          status?: 'pending' | 'sent' | 'failed';
          created_at?: string;
        };
      };
      drafts: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          body_html: string;
          to: string[];
          cc: string[] | null;
          bcc: string[] | null;
          attachments_meta: Record<string, any> | null;
          last_saved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          body_html: string;
          to: string[];
          cc?: string[] | null;
          bcc?: string[] | null;
          attachments_meta?: Record<string, any> | null;
          last_saved_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          body_html?: string;
          to?: string[];
          cc?: string[] | null;
          bcc?: string[] | null;
          attachments_meta?: Record<string, any> | null;
          last_saved_at?: string;
        };
      };
      actions_log: {
        Row: {
          id: string;
          user_id: string;
          action_type: string;
          payload: Record<string, any> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action_type: string;
          payload?: Record<string, any> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action_type?: string;
          payload?: Record<string, any> | null;
          created_at?: string;
        };
      };
    };
  };
};
