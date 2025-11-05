import { motion } from 'framer-motion'

const team = [
  {
    name: 'Alex Johnson',
    role: 'CEO & Founder',
    bio: 'Former content creator with 10+ years of experience. Passionate about helping writers succeed.',
    avatar: '/avatars/alex.jpg',
    twitter: '@alexj',
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    bio: 'AI and ML expert from Google. Building the future of content creation with cutting-edge technology.',
    avatar: '/avatars/sarah.jpg',
    twitter: '@sarahc',
  },
  {
    name: 'Mike Williams',
    role: 'Head of Product',
    bio: 'Product leader focused on creating delightful user experiences. Previously at Stripe and Airbnb.',
    avatar: '/avatars/mike.jpg',
    twitter: '@mikew',
  },
  {
    name: 'Emily Davis',
    role: 'Head of Design',
    bio: 'Award-winning designer obsessed with making complex tools simple and beautiful.',
    avatar: '/avatars/emily.jpg',
    twitter: '@emilyd',
  },
]

const values = [
  {
    title: 'Empower Creators',
    description:
      'We believe everyone has a story to tell. Our mission is to provide the tools that help creators share their voice with the world.',
    icon: '🎯',
  },
  {
    title: 'Innovation First',
    description:
      "We push the boundaries of what's possible with AI and technology to create the best writing platform.",
    icon: '🚀',
  },
  {
    title: 'Community Driven',
    description:
      'Our community is at the heart of everything we do. We listen, learn, and build together.',
    icon: '🤝',
  },
  {
    title: 'Quality Matters',
    description:
      'We obsess over every detail to ensure our platform is reliable, fast, and delightful to use.',
    icon: '⭐',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center"
        >
          <h1 className="mb-6 text-5xl font-bold">
            About{' '}
            <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
              Our Platform
            </span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            We&apos;re building the future of content creation. Our platform combines the power of AI
            with a beautiful, intuitive interface to help creators focus on what matters most -
            their ideas.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="mb-8 text-3xl font-bold text-center">Our Mission</h2>
          <div className="rounded-2xl border border-dark-border bg-dark-card p-8 text-center">
            <p className="text-xl text-text-secondary leading-relaxed">
              To empower every creator with AI-powered tools that make content creation faster,
              easier, and more enjoyable - enabling anyone to share their story with the world.
            </p>
          </div>
        </motion.section>

        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="mb-8 text-3xl font-bold text-center">Our Story</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-text-secondary leading-relaxed">
              Founded in 2024, we set out to solve a problem we experienced firsthand: creating
              quality content is time-consuming and difficult. As creators ourselves, we struggled
              with writer's block, SEO optimization, and finding the right audience.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              We believed AI could be the answer, but existing tools were either too complex or
              produced generic, soulless content. So we decided to build something better - a
              platform that combines human creativity with AI intelligence, making the writing
              process more joyful and productive.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              Today, thousands of creators trust our platform to share their stories, grow their
              audience, and build their businesses. We&apos;re just getting started.
            </p>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="mb-12 text-3xl font-bold text-center">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-dark-border bg-dark-card p-6"
              >
                <div className="mb-4 text-4xl">{value.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                <p className="text-text-secondary">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-12 text-3xl font-bold text-center">Our Team</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="mb-4 h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-orange-400" />
                <h3 className="mb-1 font-semibold">{member.name}</h3>
                <p className="mb-3 text-sm text-teal-400">{member.role}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{member.bio}</p>
                {member.twitter && (
                  <a
                    href={`https://twitter.com/${member.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-text-muted hover:text-teal-400"
                  >
                    {member.twitter}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold">Join Our Journey</h2>
          <p className="mb-8 text-xl text-text-secondary">
            We&apos;re looking for talented people who share our passion for empowering creators.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <div className="rounded-xl border border-dark-border bg-dark-card p-6">
              <h3 className="mb-2 font-semibold">Careers</h3>
              <p className="mb-4 text-sm text-text-secondary">View open positions</p>
              <a
                href="/careers"
                className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300"
              >
                View Jobs →
              </a>
            </div>
            <div className="rounded-xl border border-dark-border bg-dark-card p-6">
              <h3 className="mb-2 font-semibold">Contact</h3>
              <p className="mb-4 text-sm text-text-secondary">Get in touch with us</p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300"
              >
                Reach Out →
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
