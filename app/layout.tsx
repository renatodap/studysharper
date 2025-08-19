import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0B0D' },
  ],
}

export const metadata: Metadata = {
  title: 'StudySharper - AI-Powered Study Companion',
  description: 'Transform your study sessions with AI-powered flashcards, smart notes, and personalized learning plans.',
  keywords: 'study, learning, AI, flashcards, notes, education, pomodoro, study companion',
  authors: [{ name: 'StudySharper' }],
  creator: 'StudySharper',
  publisher: 'StudySharper',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://studysharper.com',
    title: 'StudySharper - AI-Powered Study Companion',
    description: 'Transform your study sessions with AI-powered flashcards, smart notes, and personalized learning plans.',
    siteName: 'StudySharper',
    images: [
      {
        url: 'https://studysharper.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StudySharper',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudySharper - AI-Powered Study Companion',
    description: 'Transform your study sessions with AI',
    images: ['https://studysharper.com/og-image.png'],
    creator: '@studysharper',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--card)',
                color: 'var(--card-foreground)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}