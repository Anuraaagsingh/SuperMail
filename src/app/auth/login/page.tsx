'use client';

import { createSupabaseClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AuthLoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const code = searchParams.code as string;

  if (code) {
    // Only initialize Supabase client on the client side
    if (typeof window !== 'undefined') {
      const supabase = createSupabaseClient();
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  return redirect('/dashboard');
}