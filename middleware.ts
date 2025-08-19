import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl.includes('your-project') || 
      supabaseAnonKey.includes('your-anon-key')) {
    console.warn('⚠️ Supabase not configured in middleware. Allowing all routes.')
    
    // If accessing protected routes without Supabase, redirect to setup page
    if (request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/notes') ||
        request.nextUrl.pathname.startsWith('/flashcards') ||
        request.nextUrl.pathname.startsWith('/study') ||
        request.nextUrl.pathname.startsWith('/settings')) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
    
    return response
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protected routes
    if (request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/notes') ||
        request.nextUrl.pathname.startsWith('/flashcards') ||
        request.nextUrl.pathname.startsWith('/study') ||
        request.nextUrl.pathname.startsWith('/settings')) {
      if (!user) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }
    }

    // Redirect authenticated users away from auth pages
    if (user && (
      request.nextUrl.pathname === '/sign-in' ||
      request.nextUrl.pathname === '/sign-up'
    )) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // If there's an error, allow the request to continue
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}