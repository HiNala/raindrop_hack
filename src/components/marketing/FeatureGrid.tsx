/**
 * Feature Grid Component
 * Displays main features in a responsive grid
 */

'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, TrendingUp, Lock, Globe, DollarSign } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Writing',
    description: 'Generate high-quality content with AI assistance and Hacker News context enrichment.',
    color: 'from-teal-400 to-cyan-400'
  },
  {
    icon: Zap,
    title: 'Lightning Fast Editor',
    description: 'Rich text editor with autosave, markdown support, and real-time collaboration.',
    color: 'from-orange-400 to-red-400'
  },
  {
    icon: TrendingUp,
    title: 'Built-in Analytics',
    description: 'Track views, engagement, and revenue with detailed analytics dashboard.',
    color: 'from-purple-400 to-pink-400'
  },
  {
    icon: DollarSign,
    title: 'Monetization',
    description: 'Earn money from premium content, memberships, and newsletter subscriptions.',
    color: 'from-green-400 to-emerald-400'
  },
  {
    icon: Globe,
    title: 'SEO Optimized',
    description: 'Automatic SEO optimization with dynamic metadata and social sharing.',
    color: 'from-blue-400 to-indigo-400'
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-level security with 2FA, rate limiting, and data encryption.',
    color: 'from-yellow-400 to-orange-400'
  },
]

export function FeatureGrid() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-dark-card/30">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
            Everything you need to succeed
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto">
            Powerful features to help you create, grow, and monetize
          </p>
        </motion.div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-dark-border bg-dark-card p-6 transition-all hover:border-teal-400/50 min-h-[200px]"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-400/5 to-orange-400/5 opacity-0 transition-opacity group-hover:opacity-100" />

              <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${feature.color} p-3`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              <h3 className="mb-2 text-lg font-semibold sm:text-xl">{feature.title}</h3>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
