/**
 * Feature Showcase Component
 * For displaying individual features with detailed descriptions
 */

'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface FeatureShowcaseProps {
  title: string
  description: string
  image: string
  features: string[]
  reverse?: boolean
  cta?: { text: string; href: string }
}

export function FeatureShowcase({
  title,
  description,
  image: _image,
  features,
  reverse = false,
  cta
}: FeatureShowcaseProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`py-24 ${reverse ? 'bg-dark-card/30' : ''}`}
    >
      <div className="container mx-auto px-4">
        <div className={`grid items-center gap-16 lg:grid-cols-2 ${
          reverse ? 'lg:grid-flow-col-dense' : ''
        }`}>
          {/* Content */}
          <div className={`${reverse ? 'lg:col-start-2' : ''}`}>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">{title}</h2>
            <p className="mb-8 text-xl text-text-secondary">{description}</p>

            <ul className="mb-8 space-y-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-teal-400" />
                  <span className="text-text-secondary">{feature}</span>
                </li>
              ))}
            </ul>

            {cta && (
              <Button asChild>
                <Link href={cta.href}>{cta.text}</Link>
              </Button>
            )}
          </div>

          {/* Image */}
          <div className={`${reverse ? 'lg:col-start-1' : ''}`}>
            <div className="relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-400/20 to-orange-400/20 blur-3xl" />
              <div className="aspect-video rounded-2xl border border-dark-border bg-dark-card flex items-center justify-center">
                <p className="text-text-muted">Feature Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

/**
 * Comparison Table Component
 * Compare plans side by side
 */

export function ComparisonTable() {
  const features = [
    {
      feature: 'AI Content Generation',
      free: '5/day',
      pro: 'Unlimited',
      team: 'Unlimited',
    },
    {
      feature: 'Posts',
      free: '10',
      pro: 'Unlimited',
      team: 'Unlimited',
    },
    {
      feature: 'Analytics',
      free: 'Basic',
      pro: 'Advanced',
      team: 'Team Analytics',
    },
    {
      feature: 'Team Members',
      free: '1',
      pro: '1',
      team: 'Up to 5',
    },
    {
      feature: 'Custom Domain',
      free: '❌',
      pro: '✅',
      team: '✅',
    },
    {
      feature: 'Monetization',
      free: '❌',
      pro: '✅',
      team: '✅',
    },
    {
      feature: 'Priority Support',
      free: '❌',
      pro: '✅',
      team: '✅',
    },
    {
      feature: 'API Access',
      free: '❌',
      pro: '❌',
      team: '✅',
    },
  ]

  return (
    <section className="py-24 bg-dark-card/30">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Compare features
          </h2>
          <p className="text-xl text-text-secondary">
            See which plan is right for you
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="pb-4 text-left font-medium">Feature</th>
                <th className="pb-4 text-center font-medium">Free</th>
                <th className="pb-4 text-center font-medium">Pro</th>
                <th className="pb-4 text-center font-medium">Team</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, i) => (
                <tr key={i} className="border-b border-dark-border">
                  <td className="py-4 font-medium">{row.feature}</td>
                  <td className="py-4 text-center">{row.free}</td>
                  <td className="py-4 text-center text-teal-400">{row.pro}</td>
                  <td className="py-4 text-center text-orange-400">{row.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
