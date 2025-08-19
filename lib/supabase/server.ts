import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/types/database'

export async function createClient() {
  const cookieStore = await cookies()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project')) {
    console.warn('⚠️  Supabase not configured. Please set up environment variables.')
    // Use placeholder for development
    return createServerClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        cookies: {
          async get() { return undefined },
          async set() {},
          async remove() {},
        },
      }
    )
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        async get(name: string) {
          return cookieStore.get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('your-project')) {
    console.warn('⚠️  Supabase service client not configured.')
    return createServerClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-service-key',
      {
        cookies: {},
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  }
  
  return createServerClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      cookies: {},
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}