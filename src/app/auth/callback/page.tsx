'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AuthCallbackPage({
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