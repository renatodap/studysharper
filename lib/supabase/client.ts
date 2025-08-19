import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project')) {
    console.warn('⚠️  Supabase not configured. Please set up environment variables.')
    // Return a mock client for development
    return createBrowserClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }
  
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}