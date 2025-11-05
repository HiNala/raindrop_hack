'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const competitors = [
  { name: 'Blog Platform', isUs: true },
  { name: 'Medium', isUs: false },
  { name: 'Substack', isUs: false },
  { name: 'Ghost', isUs: false },
]

const features = [
  {
    name: 'AI Writing Assistant',
    blogPlatform: true,
    medium: false,
    substack: false,
    ghost: false,
  },
  {
    name: 'Built-in Analytics',
    blogPlatform: true,
    medium: true,
    substack: true,
    ghost: true,
  },
  {
    name: 'Newsletter System',
    blogPlatform: true,
    medium: false,
    substack: true,
    ghost: false,
  },
  {
    name: 'Monetization Tools',
    blogPlatform: true,
    medium: true,
    substack: true,
    ghost: false,
  },
  {
    name: 'Team Collaboration',
    blogPlatform: true,
    medium: false,
    substack: false,
    ghost: true,
  },
  {
    name: 'Custom Domain',
    blogPlatform: true,
    medium: false,
    substack: false,
    ghost: true,
  },
]

export function ComparisonTable() {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold">
            Compare the features
          </h2>
          <p className="text-xl text-muted-foreground">
            See how we stack up against the competition
          </p>
        </motion.div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Features
                </th>
                {competitors.map((competitor) => (
                  <th
                    key={competitor.name}
                    className={`px-6 py-4 text-center text-sm font-medium ${
                      competitor.isUs
                        ? 'text-teal-400'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {competitor.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <motion.tr
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    {feature.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {feature.blogPlatform && (
                      <Check className="mx-auto h-5 w-5 text-teal-400" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {feature.medium ? (
                      <Check className="mx-auto h-5 w-5 text-green-400" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-muted-foreground" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {feature.substack ? (
                      <Check className="mx-auto h-5 w-5 text-green-400" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-muted-foreground" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {feature.ghost ? (
                      <Check className="mx-auto h-5 w-5 text-green-400" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-muted-foreground" />
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Ready to experience the difference?
          </p>
          <a href="/sign-up" className="inline-flex items-center justify-center rounded-lg bg-teal-400 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-500">
            Get Started Free
          </a>
        </div>
      </div>
    </section>
  )
}
