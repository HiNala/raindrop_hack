'use client'

import { SignUp } from '@clerk/nextjs'
import { Sparkles, Zap } from 'lucide-react'

export default function SignUpPage() {
  return (
    <main className="flex min-h-[85vh] items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full glass-card border border-teal-500/30">
            <Zap className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium text-text-primary">Get Started Free</span>
            <Sparkles className="w-4 h-4 text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Join{' '}
            <span className="text-gradient-primary">Blog App</span>
          </h1>
          <p className="text-text-secondary">
            Start writing and sharing your stories today
          </p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="glass-card p-1">
          <SignUp
            routing="path"
            path="/sign-up"
            appearance={{
              variables: {
                colorPrimary: '#14b8a6',
                colorBackground: '#1a1a1d',
                colorInputBackground: '#0a0a0b',
                colorInputText: '#fafafa',
                colorText: '#fafafa',
                colorTextSecondary: '#a1a1aa',
                colorDanger: '#f97316',
                borderRadius: '0.75rem',
              },
              elements: {
                rootBox: 'w-full',
                card: 'bg-dark-card shadow-none border-0',
                headerTitle: 'text-text-primary',
                headerSubtitle: 'text-text-secondary',
                socialButtonsBlockButton: 'bg-dark-bg border-dark-border text-text-primary hover:bg-dark-hover hover:border-teal-500/50',
                formFieldInput: 'bg-dark-bg border-dark-border text-text-primary focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
                formButtonPrimary: 'bg-teal-500 hover:bg-teal-600 shadow-lg hover:shadow-glow-teal',
                footerActionLink: 'text-teal-400 hover:text-teal-300',
              },
            }}
          />
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="glass-card p-4">
            <div className="text-2xl font-bold text-teal-400 mb-1">∞</div>
            <div className="text-xs text-text-secondary">Unlimited Posts</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-2xl font-bold text-orange-400 mb-1">AI</div>
            <div className="text-xs text-text-secondary">Powered</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-2xl font-bold text-teal-400 mb-1">Free</div>
            <div className="text-xs text-text-secondary">Forever</div>
          </div>
        </div>
      </div>
    </main>
  )
}
