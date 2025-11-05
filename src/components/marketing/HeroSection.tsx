/**
 * Hero Section Component
 * Main landing hero with CTA and animated elements
 */

'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TurbulentFlowBackground } from '@/components/ui/turbulent-flow'

export function HeroSection() {
  return (
    <TurbulentFlowBackground>
      <section className="relative overflow-hidden py-32 md:py-48">

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl text-center"
        >
          {/* Headline - Large serif font like Capacity */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-6xl font-normal leading-tight tracking-tight text-white md:text-8xl"
            style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            Turn any idea into a
            <br />
            <span className="font-light">working blog</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12 text-xl text-white/80 md:text-2xl"
          >
            AI-powered writing platform that helps you create compelling content in seconds.
          </motion.p>

          {/* Input-style CTA - Capacity style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-auto max-w-2xl"
          >
            <div className="relative rounded-2xl bg-black/60 p-2 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Create a blog about..."
                  className="flex-1 rounded-xl bg-transparent px-6 py-4 text-lg text-white placeholder-white/60 outline-none"
                />
                <Button
                  size="lg"
                  className="rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-8 hover:from-teal-600 hover:to-teal-700"
                  asChild
                >
                  <Link href="/sign-up">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {['AI Writer', 'SEO Tools', 'Analytics', 'Monetization'].map((feature) => (
              <button
                key={feature}
                className="rounded-full bg-black/40 px-5 py-2.5 text-sm text-white/90 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white"
              >
                {feature}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
    </TurbulentFlowBackground>
  )
}

export function SocialProof() {
  return (
    <section className="py-16 bg-dark-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm font-medium text-text-muted uppercase tracking-wider">
            Trusted by leading creators
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-8 opacity-60">
            {/* Placeholder for company logos */}
            {['TechCorp', 'StartupHub', 'CreatorLab', 'ContentPro', 'BlogFlow'].map((company) => (
              <div key={company} className="text-2xl font-bold text-text-muted">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
