import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardNav } from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-dark-950">
      <DashboardNav user={user} profile={profile} />
      <main className="pl-64 pt-16">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}