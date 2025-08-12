import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

/**
 * Create a Supabase client for use in Server Components
 * This client will use the cookies to maintain auth state
 */
export const createSupabaseServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

export type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>