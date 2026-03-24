import { createClient } from '@supabase/supabase-js';

export type Topic = {
  id: string;
  title: string;
  summary: string | null;
  source_url: string | null;
  source_name: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export type Newsletter = {
  id: string;
  subject: string | null;
  content_html: string | null;
  content_text: string | null;
  status: 'draft' | 'sent';
  slug: string | null;
  sent_at: string | null;
  created_at: string;
};

export type NewsletterTopic = {
  newsletter_id: string;
  topic_id: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client (uses service role key)
export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
