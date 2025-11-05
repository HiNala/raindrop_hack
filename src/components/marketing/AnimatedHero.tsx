'use client'

import { TurbulentFlowBackground } from '@/components/ui/turbulent-flow'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function AnimatedHero() {
  return (
    <TurbulentFlowBackground>
      <div className="relative flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Logo/Brand */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 px-4 py-2 content-glass-light rounded-full border border-white/20"
            >
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span className="text-white font-medium">AI-Powered Writing Platform</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight tracking-tight">
              <span className="text-white drop-shadow-[0_0_30px_rgba(20,184,166,0.5)]" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3), 0 0 40px rgba(20,184,166,0.4)' }}>
                Write Better,
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(20,184,166,0.8)]" style={{ WebkitTextStroke: '1px rgba(20,184,166,0.2)' }}>
                Create Faster
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white mb-12 max-w-2xl mx-auto leading-relaxed font-medium" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              Transform your ideas into compelling content with AI assistance.
              Join thousands of creators building their audience.
            </p>

            {/* Enhanced CTA Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-12"
            >
              {/* Input-style CTA - Capacity inspired */}
              <div className="relative mx-auto max-w-2xl">
                <div className="content-glass rounded-2xl p-2 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Create a blog about..."
                      className="flex-1 rounded-xl bg-transparent px-6 py-4 text-lg text-white placeholder-white/60 outline-none"
                    />
                    <Button
                      size="lg"
                      className="rounded-xl btn-turbulent px-8"
                      asChild
                    >
                      <Link href="/sign-up">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {['AI Writer', 'SEO Tools', 'Analytics', 'Monetization'].map((feature) => (
                  <button
                    key={feature}
                    className="rounded-full content-glass px-5 py-2.5 text-sm text-white/90 transition-all hover:bg-white/20 hover:text-white"
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="#demo">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 content-glass-light rounded-xl font-semibold text-lg border border-white/20 transition-all"
                >
                  Watch Demo
                </motion.button>
              </Link>
            </div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-16 flex flex-col items-center gap-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-teal-400 to-purple-500"
                  />
                ))}
              </div>
              <p className="text-white/70 text-sm text-shadow-subtle">
                Join 10,000+ creators already using Raindrop
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </TurbulentFlowBackground>
  )
}

// Alternative components for different sections
export function DashboardBackground({ children }: { children: React.ReactNode }) {
  return (
    <TurbulentFlowBackground>
      <div className="min-h-screen p-8">
        <div className="card-turbulent rounded-2xl p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </TurbulentFlowBackground>
  )
}

export function AuthBackground({ children }: { children: React.ReactNode }) {
  return (
    <TurbulentFlowBackground>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md content-glass rounded-2xl p-8 border border-white/10">
          {children}
        </div>
      </div>
    </TurbulentFlowBackground>
  )
}