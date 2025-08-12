"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signInWithGoogle, handleAuthError } from "@/lib/supabase"
import { toast } from "sonner"

interface LoginFormProps {
  redirectTo?: string
  className?: string
}

/**
 * Google OAuth login form component
 * Handles authentication flow with Supabase and proper error handling
 */
export function LoginForm({ redirectTo, className }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      
      await signInWithGoogle(redirectTo)
      
      // Note: The actual redirect happens in the OAuth flow
      // This will only execute if there's an error
      toast.success("Redirecting to Google...")
      
    } catch (error: any) {
      console.error("Sign in error:", error)
      const errorMessage = handleAuthError(error)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome to StudySharper</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          loading={isLoading}
          className="w-full"
          size="lg"
        >
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Secure authentication powered by Supabase
            </span>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Minimal login button for use in headers or other compact spaces
 */
export function LoginButton({ 
  redirectTo, 
  variant = "default",
  size = "default",
  className 
}: {
  redirectTo?: string
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle(redirectTo)
      toast.success("Redirecting to Google...")
    } catch (error: any) {
      console.error("Sign in error:", error)
      const errorMessage = handleAuthError(error)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      loading={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      Sign in with Google
    </Button>
  )
}

/**
 * Auth callback handler component
 * Use this on your /auth/callback page
 */
export function AuthCallback() {
  const router = useRouter()

  React.useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current URL and extract any error or success parameters
        const urlParams = new URLSearchParams(window.location.search)
        const error = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')

        if (error) {
          console.error('Auth callback error:', error, errorDescription)
          toast.error(errorDescription || 'Authentication failed')
          router.push('/login')
        } else {
          // Success - redirect to the intended destination or dashboard
          const redirectTo = urlParams.get('redirectTo') || '/dashboard'
          toast.success('Successfully signed in!')
          router.push(redirectTo)
        }
      } catch (error) {
        console.error('Auth callback handling error:', error)
        toast.error('An error occurred during authentication')
        router.push('/login')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Completing sign in...</CardTitle>
          <CardDescription className="text-center">
            Please wait while we set up your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    </div>
  )
}