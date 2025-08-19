'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    },
  })
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Track page views
    const handleRouteChange = () => {
      posthog?.capture('$pageview')
    }

    // Listen to route changes
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}