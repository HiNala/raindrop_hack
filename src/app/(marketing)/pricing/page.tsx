/**
 * Pricing Page
 * Display pricing plans with annual toggle and FAQ
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out the platform',
    icon: Sparkles,
    features: [
      '5 AI generations per day',
      'Basic analytics',
      'Up to 10 posts',
      'Community support',
      'Basic editor features',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: 9,
    description: 'For serious content creators',
    icon: Zap,
    features: [
      'Unlimited AI generations',
      'Advanced analytics',
      'Unlimited posts',
      'Priority support',
      'Advanced editor features',
      'HN context enrichment',
      'Custom domain',
      'Newsletter & monetization',
      'Remove branding',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: 29,
    description: 'For teams and organizations',
    icon: Crown,
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Collaborative editing',
      'Team analytics',
      'Advanced permissions',
      'White-label options',
      'Dedicated support',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">Simple, transparent pricing</h1>
          <p className="mb-8 text-xl text-text-secondary">Choose the plan that's right for you</p>

          {/* Annual toggle */}
          <div className="inline-flex items-center gap-4 rounded-full border border-dark-border bg-dark-card p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-6 py-2 transition-all ${
                !annual ? 'bg-teal-400 text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-6 py-2 transition-all ${
                annual ? 'bg-teal-400 text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Annual
              <span className="ml-2 rounded-full bg-orange-400 px-2 py-1 text-xs text-white">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl border p-8 ${
                plan.popular ? 'border-teal-400 bg-teal-400/5' : 'border-dark-border bg-dark-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="rounded-full bg-gradient-to-r from-teal-400 to-orange-400 px-4 py-1 text-sm font-medium text-white">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div
                  className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${
                    plan.name === 'Free'
                      ? 'from-teal-400 to-cyan-400'
                      : plan.name === 'Pro'
                        ? 'from-orange-400 to-red-400'
                        : 'from-purple-400 to-pink-400'
                  } p-3`}
                >
                  <plan.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                <p className="text-text-secondary">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">
                    ${annual ? Math.floor(plan.price * 0.8) : plan.price}
                  </span>
                  <span className="text-text-secondary">/month</span>
                </div>
                {annual && plan.price > 0 && (
                  <p className="mt-1 text-sm text-teal-400">
                    Billed annually (${Math.floor(plan.price * 0.8 * 12)}/year)
                  </p>
                )}
              </div>

              <Button
                className="mb-6 w-full"
                variant={plan.popular ? 'default' : 'outline'}
                asChild
              >
                <Link href="/sign-up">{plan.cta}</Link>
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-teal-400" />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h2 className="mb-8 text-center text-3xl font-bold">Frequently asked questions</h2>
          <div className="mx-auto max-w-3xl">
            <FAQ />
          </div>
        </motion.div>

        {/* Money-back guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="mx-auto max-w-2xl rounded-2xl border border-teal-400/30 bg-teal-400/5 p-8">
            <h3 className="mb-4 text-2xl font-bold">30-day money-back guarantee</h3>
            <p className="text-text-secondary">
              Try our platform risk-free. If you&apos;re not completely satisfied, we&apos;ll refund your
              purchase - no questions asked.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function FAQ() {
  const faqs = [
    {
      q: 'Can I change plans later?',
      a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards (Visa, MasterCard, AmEx) via Stripe.',
    },
    {
      q: 'Is there a free trial?',
      a: 'Yes! Pro plan comes with a 14-day free trial. No credit card required.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Absolutely. You can cancel your subscription at any time from your account settings.',
    },
    {
      q: 'What happens to my content if I downgrade?',
      a: "Your content remains safe. You'll keep all your posts, but some features may be limited.",
    },
    {
      q: 'Do you offer custom plans?',
      a: 'Yes! We offer custom plans for enterprises and large teams. Contact sales for details.',
    },
  ]

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <details key={i} className="group rounded-xl border border-dark-border bg-dark-card p-6">
          <summary className="cursor-pointer text-lg font-semibold">{faq.q}</summary>
          <p className="mt-3 text-text-secondary">{faq.a}</p>
        </details>
      ))}
    </div>
  )
}
