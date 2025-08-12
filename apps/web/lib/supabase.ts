import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Create a Supabase client for use in Client Components
 * This client will automatically handle auth state changes
 */
export const createSupabaseClient = () => {
  return createClientComponentClient<Database>()
}


/**
 * Create a basic Supabase client (for general use)
 * Use this when you don't need auth helpers
 */
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null

/**
 * Get the current user from the client
 */
export const getCurrentUser = async () => {
  const supabase = createSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  
  return user
}

/**
 * Get the current session from the client
 */
export const getCurrentSession = async () => {
  const supabase = createSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting current session:', error)
    return null
  }
  
  return session
}

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async (redirectTo?: string) => {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  
  if (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
  
  return data
}

/**
 * Sign out the current user
 */
export const signOut = async () => {
  const supabase = createSupabaseClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Auth state change listener
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  const supabase = createSupabaseClient()
  
  return supabase.auth.onAuthStateChange(callback)
}

/**
 * Utility function to handle auth errors
 */
export const handleAuthError = (error: any): string => {
  if (error?.message) {
    // Common auth error messages that can be made user-friendly
    const message = error.message.toLowerCase()
    
    if (message.includes('invalid login credentials')) {
      return 'Invalid email or password. Please try again.'
    }
    
    if (message.includes('email not confirmed')) {
      return 'Please check your email and click the confirmation link.'
    }
    
    if (message.includes('signup disabled')) {
      return 'Account registration is currently disabled.'
    }
    
    if (message.includes('email already registered')) {
      return 'An account with this email already exists.'
    }
    
    if (message.includes('password should be at least')) {
      return 'Password should be at least 6 characters long.'
    }
    
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Types for better TypeScript support
 */
export type SupabaseClient = ReturnType<typeof createSupabaseClient>