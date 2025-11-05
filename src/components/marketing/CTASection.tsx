/**
 * CTA Section Component
 * Final call-to-action section
 */

'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-400 via-orange-400 to-purple-400 p-px"
        >
          <div className="rounded-3xl bg-dark-bg p-12 md:p-16">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm text-orange-400"
              >
                <Zap className="h-4 w-4" />
                <span>Start your free trial today</span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-4xl font-bold md:text-6xl"
              >
                Ready to transform your
                <br />
                <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
                  content creation?
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mb-8 text-xl text-text-secondary"
              >
                Join thousands of writers, creators, and teams who are already
                using our platform to create amazing content faster than ever before.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <Button size="lg" className="group bg-gradient-to-r from-teal-400 to-orange-400 hover:from-teal-500 hover:to-orange-500" asChild>
                  <Link href="/sign-up">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <Link href="/pricing">
                    View Pricing
                  </Link>
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex flex-col items-center gap-6"
              >
                <div className="flex items-center gap-6 text-sm text-text-muted">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function PricingTeaser() {
  return (
    <section className="py-24 bg-dark-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Simple, transparent pricing
          </h2>
          <p className="mb-8 text-xl text-text-secondary">
            Start free, upgrade when you're ready
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <div className="rounded-xl border border-dark-border bg-dark-card p-6">
              <h3 className="text-2xl font-bold text-teal-400">$0</h3>
              <p className="text-text-muted">Free forever</p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li>5 AI generations/day</li>
                <li>Basic analytics</li>
                <li>Up to 10 posts</li>
              </ul>
            </div>
            <div className="rounded-xl border border-teal-400/30 bg-teal-400/5 p-6">
              <h3 className="text-2xl font-bold text-teal-400">$9</h3>
              <p className="text-text-muted">Per month</p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li>Unlimited AI generations</li>
                <li>Advanced analytics</li>
                <li>Unlimited posts</li>
                <li>Monetization tools</li>
              </ul>
            </div>
          </div>
          <Button className="mt-8" asChild>
            <Link href="/pricing">
              View All Plans
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
