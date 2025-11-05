/**
 * How It Works Component
 * Shows the 3-step process in an engaging visual format
 */

'use client'

import { motion } from 'framer-motion'
import { Edit, Sparkles, Rocket } from 'lucide-react'

const steps = [
  {
    icon: Edit,
    title: 'Write or Generate',
    description: 'Start writing or let AI generate content based on your ideas',
    step: '01'
  },
  {
    icon: Sparkles,
    title: 'Enhance & Polish',
    description: 'Use AI assistant to improve, expand, and optimize your content',
    step: '02'
  },
  {
    icon: Rocket,
    title: 'Publish & Grow',
    description: 'Publish, share, and monetize your content with built-in tools',
    step: '03'
  },
]

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            How it works
          </h2>
          <p className="text-xl text-text-secondary">
            From idea to published post in minutes
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-teal-400 via-orange-400 to-teal-400 md:block" />

          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-4 text-6xl font-bold text-teal-400/20">
                    {step.step}
                  </div>
                  <h3 className="mb-2 text-2xl font-semibold">{step.title}</h3>
                  <p className="text-lg text-text-secondary">{step.description}</p>
                </div>

                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-gradient-to-br from-teal-400/20 to-orange-400/20 blur-xl" />
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dark-border bg-dark-card">
                    <step.icon className="h-10 w-10 text-teal-400" />
                  </div>
                </div>

                {/* Spacer for alignment */}
                <div className="hidden flex-1 md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
