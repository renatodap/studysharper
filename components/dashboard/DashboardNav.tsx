'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Brain, 
  BookOpen, 
  Clock, 
  Target, 
  Users, 
  Settings,
  LogOut,
  Home,
  CreditCard,
  Trophy,
  FileText
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/flashcards', label: 'Flashcards', icon: BookOpen },
  { href: '/study', label: 'Study Sessions', icon: Clock },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/teams', label: 'Study Groups', icon: Users },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
]

const bottomItems: NavItem[] = [
  { href: '/pricing', label: 'Upgrade', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function DashboardNav({ user, profile }: { user: any; profile: any }) {
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-dark-900/80 backdrop-blur-lg border-b border-gray-800 z-40">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-2 pl-56">
            <Brain className="h-8 w-8 text-brand-400" />
            <span className="text-xl font-bold text-white">StudySharper</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-white font-medium">{profile?.full_name || user?.email}</p>
              <p className="text-xs text-gray-400">
                {profile?.subscription_tier === 'free' ? 'Free Plan' : 
                 profile?.subscription_tier === 'starter' ? 'Starter Plan' : 'Pro Plan'}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-brand-500/20 flex items-center justify-center">
              <span className="text-brand-400 font-semibold">
                {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-16 bottom-0 w-64 bg-dark-900/50 backdrop-blur-lg border-r border-gray-800 z-30">
        <nav className="flex flex-col h-full">
          {/* Main Navigation */}
          <div className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-brand-500/20 text-brand-400'
                      : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Usage Stats */}
          <div className="px-4 py-4 border-t border-gray-800">
            <div className="bg-dark-800 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-2">AI Usage This Month</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white font-medium">
                  {profile?.ai_queries_used || 0} / {profile?.ai_queries_limit || 100}
                </span>
                <span className="text-xs text-brand-400">
                  {Math.round(((profile?.ai_queries_used || 0) / (profile?.ai_queries_limit || 100)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div 
                  className="bg-brand-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min(100, ((profile?.ai_queries_used || 0) / (profile?.ai_queries_limit || 100)) * 100)}%` 
                  }}
                />
              </div>
              {profile?.subscription_tier === 'free' && (
                <Link href="/pricing">
                  <Button size="sm" className="w-full mt-3 bg-brand-500 hover:bg-brand-600">
                    Upgrade for More
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="px-4 py-4 space-y-1 border-t border-gray-800">
            {bottomItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-brand-500/20 text-brand-400'
                      : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
            
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-400 hover:bg-dark-800 hover:text-white w-full"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}