'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
        setEmail('')
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full px-4"
        >
          <div className="text-center">
            <div className="mb-6 inline-flex rounded-full bg-green-400/10 p-4">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>

            <h1 className="mb-4 text-3xl font-bold">You're on the list!</h1>

            <p className="mb-8 text-text-secondary">
              Thanks for joining our waitlist! We'll notify you as soon as we launch. Keep an eye on
              your inbox for updates and early access opportunities.
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border border-dark-border bg-dark-card p-4">
                <p className="text-sm text-text-muted mb-2">What's next?</p>
                <ul className="text-sm text-text-secondary space-y-1 text-left">
                  <li>✅ You'll receive a confirmation email shortly</li>
                  <li>✅ Get exclusive early access when we launch</li>
                  <li>✅ Be the first to know about new features</li>
                </ul>
              </div>

              <Button asChild className="w-full">
                <Link href="/">Explore Our Features</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-24">
      <div className="w-full max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex rounded-full bg-teal-400/10 p-4">
              <Mail className="h-12 w-12 text-teal-400" />
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold">Join the Waitlist</h1>

            {/* Description */}
            <p className="mb-8 text-text-secondary">
              Be the first to know when we launch. Get exclusive early access and special founding
              member perks.
            </p>

            {/* Benefits */}
            <div className="mb-8 rounded-2xl border border-dark-border bg-dark-card p-6">
              <h3 className="mb-4 font-semibold text-teal-400">
                <Sparkles className="mr-2 inline h-4 w-4" />
                Early Access Benefits
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>🎁 50% off your first 3 months</li>
                <li>🚀 Priority access to new features</li>
                <li>💬 Direct line to our founding team</li>
                <li>👑 Exclusive founding member badge</li>
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-lg border border-red-400/30 bg-red-400/5 p-3"
                  >
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" disabled={!email.trim() || loading} className="w-full h-12">
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Joining...
                  </>
                ) : (
                  <>
                    Join Waitlist
                    <Mail className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Trust indicators */}
            <div className="mt-8 text-center">
              <p className="text-xs text-text-muted mb-4">Join 1,247 creators waiting for access</p>

              <div className="flex justify-center gap-6 text-xs text-text-muted">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <span>No spam, ever</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <span>Unsubscribe anytime</span>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="mt-8 pt-8 border-t border-dark-border">
              <p className="text-sm text-text-muted mb-4">As seen on</p>
              <div className="flex justify-center gap-4 opacity-60">
                {['Product Hunt', 'Hacker News', 'Indie Hackers', 'Twitter'].map((platform) => (
                  <span key={platform} className="text-sm font-medium">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
