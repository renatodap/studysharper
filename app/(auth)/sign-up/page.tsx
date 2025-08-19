'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Brain, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      if (data?.user) {
        toast.success('Account created! Check your email to verify your account.')
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up with Google')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-brand-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-900/50 backdrop-blur-lg rounded-2xl border border-gray-800 p-8">
          <div className="flex items-center justify-center mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-10 w-10 text-brand-400" />
              <span className="text-2xl font-bold text-white">StudySharper</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2">Create Account</h1>
          <p className="text-gray-400 text-center mb-8">Start your learning journey today</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="Create a password"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-500 hover:bg-brand-600 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-900/50 text-gray-400">Or continue with</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignUp}
              variant="outline"
              className="w-full mt-4 border-gray-700 hover:bg-dark-800"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-brand-400 hover:text-brand-300">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-brand-400 hover:text-brand-300">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-brand-400 hover:text-brand-300">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}