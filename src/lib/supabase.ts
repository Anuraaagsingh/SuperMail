import { createBrowserClient, createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.supermail_NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.supermail_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client for browser usage (public API)
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables not configured. Please set supermail_NEXT_PUBLIC_SUPABASE_URL and supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.');
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// Create a Supabase client for server usage (SSR)
export const createSupabaseServerClient = (cookieStore: any) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables not configured. Please set supermail_NEXT_PUBLIC_SUPABASE_URL and supermail_NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.');
  }
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};

// Create a Supabase client with service role for server usage (protected API)
export const createSupabaseServiceClient = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase service environment variables not configured. Please set supermail_NEXT_PUBLIC_SUPABASE_URL and supermail_SUPABASE_SERVICE_ROLE_KEY in your environment variables.');
  }
  
  return createServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // No-op for service client
      },
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
          recipients_to: string[];
          recipients_cc: string[] | null;
          recipients_bcc: string[] | null;
          attachments_meta: Record<string, any> | null;
          last_saved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          body_html: string;
          recipients_to: string[];
          recipients_cc?: string[] | null;
          recipients_bcc?: string[] | null;
          attachments_meta?: Record<string, any> | null;
          last_saved_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          body_html?: string;
          recipients_to?: string[];
          recipients_cc?: string[] | null;
          recipients_bcc?: string[] | null;
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
