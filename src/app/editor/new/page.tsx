'use client'

import { EnhancedEditor } from '@/components/editor/EnhancedEditor'
import { useUser } from '@clerk/nextjs'
import { useAnonymousPosts } from '@/hooks/useAnonymousPosts'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Lock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function NewEditorPage() {
  const { isSignedIn } = useUser()
  const { canCreatePost, remainingPosts, isClient } = useAnonymousPosts()

  // Show loading state while checking client-side
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-text-muted">Loading editor...</div>
      </div>
    )
  }

  // If not signed in and no remaining posts, show upgrade prompt
  if (!isSignedIn && !canCreatePost) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <Card className="max-w-lg p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-teal-500" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Free Trial Complete! 🎉
            </h2>
            <p className="text-text-secondary">
              You've created 3 amazing blog posts! Ready to unlock unlimited writing?
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-text-primary">Unlimited Posts</p>
                <p className="text-sm text-text-muted">Write as much as you want</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-text-primary">AI Assistance</p>
                <p className="text-sm text-text-muted">Generate content with AI</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-text-primary">Analytics & Insights</p>
                <p className="text-sm text-text-muted">Track your post performance</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 bg-teal-500 hover:bg-teal-600">
              <Link href="/sign-up">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started Free
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>

          <p className="mt-4 text-xs text-text-muted">
            Already have an account? <Link href="/sign-in" className="text-teal-500 hover:underline">Sign in</Link>
          </p>
        </Card>
      </div>
    )
  }

  // Show remaining posts badge for anonymous users
  return (
    <div>
      {!isSignedIn && (
        <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border-b border-teal-500/20 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-teal-500" />
              <span className="text-sm font-medium text-text-primary">
                Free Trial: {remainingPosts} post{remainingPosts !== 1 ? 's' : ''} remaining
              </span>
            </div>
            <Button asChild size="sm" className="bg-teal-500 hover:bg-teal-600">
              <Link href="/sign-up">Unlock Unlimited</Link>
            </Button>
          </div>
        </div>
      )}
      <EnhancedEditor />
    </div>
  )
}
