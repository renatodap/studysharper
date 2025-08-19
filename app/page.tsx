import Link from 'next/link'
import { ArrowRight, Brain, Clock, Target, Users, Zap, BookOpen, Trophy, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-brand-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
        
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-brand-400" />
            <span className="text-xl font-bold text-white">StudySharper</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-brand-500 hover:bg-brand-600">
                Start Free
              </Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center space-x-2 bg-brand-500/10 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-brand-400" />
            <span className="text-sm text-brand-300">AI-Powered Study Companion</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Study Smarter,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-400">
              {' '}Not Harder
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Transform your study sessions with AI-powered flashcards, smart notes, 
            and personalized learning plans. Join thousands of students achieving more in less time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/sign-up">
              <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-white px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                See How It Works
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 100 AI queries free • Cancel anytime
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need to Excel</h2>
            <p className="text-xl text-gray-400">Powerful tools designed for modern learners</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-8 w-8" />}
              title="AI Study Assistant"
              description="Get instant help with complex topics. Our AI explains concepts, generates practice questions, and adapts to your learning style."
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Smart Flashcards"
              description="Create flashcards from your notes automatically. Our spaced repetition algorithm ensures you remember what you learn."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Pomodoro Timer"
              description="Stay focused with built-in productivity tools. Track your study sessions and maintain perfect work-life balance."
            />
            <FeatureCard
              icon={<Target className="h-8 w-8" />}
              title="Goal Tracking"
              description="Set study goals and watch your progress. Get insights into your learning patterns and optimize your study time."
            />
            <FeatureCard
              icon={<Trophy className="h-8 w-8" />}
              title="Achievements & Streaks"
              description="Stay motivated with gamification. Earn badges, maintain streaks, and compete with friends on leaderboards."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Study Groups"
              description="Collaborate with classmates in real-time. Share notes, create group flashcards, and study together online."
            />
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 px-6 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-400">Choose the plan that fits your needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Free"
              price="$0"
              description="Perfect for getting started"
              features={[
                '100 AI queries per month',
                'Unlimited notes',
                'Basic flashcards',
                'Pomodoro timer',
                'Study tracking'
              ]}
              buttonText="Start Free"
              buttonHref="/sign-up"
            />
            <PricingCard
              title="Starter"
              price="$5"
              period="/month"
              description="For serious students"
              features={[
                '1,000 AI queries per month',
                'Advanced flashcards',
                'Priority support',
                'Export to PDF',
                'Study analytics',
                'No ads'
              ]}
              buttonText="Upgrade to Starter"
              buttonHref="/sign-up"
              highlighted
            />
            <PricingCard
              title="Pro"
              price="$10"
              period="/month"
              description="For power users"
              features={[
                'Unlimited AI queries',
                'Team collaboration',
                'API access',
                'Custom integrations',
                'Advanced analytics',
                'White-label options'
              ]}
              buttonText="Go Pro"
              buttonHref="/sign-up"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Study Game?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of students already using StudySharper to ace their exams
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-white px-8">
              Start Your Free Trial
              <Zap className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Brain className="h-6 w-6 text-brand-400" />
            <span className="text-lg font-semibold text-white">StudySharper</span>
          </div>
          
          <div className="flex space-x-6 text-gray-400">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/support" className="hover:text-white">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-dark-900/50 border border-gray-800 rounded-xl p-6 hover:border-brand-500/50 transition-colors">
      <div className="text-brand-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonHref,
  highlighted = false
}: {
  title: string
  price: string
  period?: string
  description: string
  features: string[]
  buttonText: string
  buttonHref: string
  highlighted?: boolean
}) {
  return (
    <div className={`rounded-xl p-6 ${highlighted ? 'bg-brand-500/10 border-2 border-brand-500' : 'bg-dark-900/50 border border-gray-800'}`}>
      {highlighted && (
        <div className="text-center mb-4">
          <span className="bg-brand-500 text-white text-sm font-semibold px-3 py-1 rounded-full">Most Popular</span>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <div className="text-4xl font-bold text-white">
          {price}
          {period && <span className="text-lg text-gray-400">{period}</span>}
        </div>
        <p className="text-gray-400 mt-2">{description}</p>
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="h-5 w-5 text-brand-400 mr-2 mt-0.5 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link href={buttonHref} className="block">
        <Button className={`w-full ${highlighted ? 'bg-brand-500 hover:bg-brand-600' : 'bg-dark-800 hover:bg-dark-700'}`}>
          {buttonText}
        </Button>
      </Link>
    </div>
  )
}