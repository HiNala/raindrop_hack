/**
 * Testimonials Component
 * Social proof with user testimonials
 */

'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Content Creator',
    avatar: '/avatars/sarah.jpg',
    content: 'This platform has 10x my content output. The AI writing assistant is incredible!',
    rating: 5,
  },
  {
    name: 'Mike Chen',
    role: 'Tech Blogger',
    avatar: '/avatars/mike.jpg',
    content: 'Best writing platform I\'ve used. The HN context feature is a game-changer for tech content.',
    rating: 5,
  },
  {
    name: 'Emily Davis',
    role: 'Marketing Manager',
    avatar: '/avatars/emily.jpg',
    content: 'The analytics dashboard helps me understand what resonates with my audience. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Alex Thompson',
    role: 'Freelance Writer',
    avatar: '/avatars/alex.jpg',
    content: 'I love the distraction-free editor and the AI suggestions. It helps me write better, faster.',
    rating: 5,
  },
  {
    name: 'Lisa Wang',
    role: 'Startup Founder',
    avatar: '/avatars/lisa.jpg',
    content: 'Perfect for our content marketing strategy. The team features and analytics are exactly what we needed.',
    rating: 5,
  },
  {
    name: 'David Miller',
    role: 'Indie Hacker',
    avatar: '/avatars/david.jpg',
    content: 'The monetization features helped me earn from my writing within the first month. Amazing platform!',
    rating: 5,
  },
]

export function Testimonials() {
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
            Loved by creators
          </h2>
          <p className="text-xl text-text-secondary">
            Join thousands of satisfied writers and creators
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-dark-border bg-dark-card p-6"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-orange-400 text-orange-400" />
                ))}
              </div>

              <p className="mb-4 text-text-secondary">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-orange-400" />
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-text-muted">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 rounded-2xl border border-dark-border bg-dark-card px-8 py-6">
            <div>
              <p className="text-3xl font-bold text-teal-400">10,000+</p>
              <p className="text-sm text-text-muted">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-400">50,000+</p>
              <p className="text-sm text-text-muted">Posts Published</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">1M+</p>
              <p className="text-sm text-text-muted">Monthly Readers</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
