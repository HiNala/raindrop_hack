'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const communityProjects = [
  {
    id: 1,
    title: 'Tech Insights',
    description: 'A blog about emerging technologies',
    author: {
      name: 'Alex Chen',
      avatar: 'AC',
    },
    image: '/api/placeholder/400/300',
    category: 'Technology',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    title: 'Startup Stories',
    description: 'Real stories from founders',
    author: {
      name: 'Sarah Johnson',
      avatar: 'SJ',
    },
    image: '/api/placeholder/400/300',
    category: 'Business',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    title: 'Design Chronicles',
    description: 'UI/UX design best practices',
    author: {
      name: 'Mike Torres',
      avatar: 'MT',
    },
    image: '/api/placeholder/400/300',
    category: 'Design',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 4,
    title: 'Code & Coffee',
    description: 'Programming tutorials and tips',
    author: {
      name: 'Emma Davis',
      avatar: 'ED',
    },
    image: '/api/placeholder/400/300',
    category: 'Development',
    gradient: 'from-teal-500 to-green-500',
  },
]

export function CommunityShowcase() {
  return (
    <section className="relative py-24">
      {/* Dark background like Capacity */}
      <div className="absolute inset-0 bg-dark-bg" />

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            From the Community
          </h2>
          <div className="flex gap-2">
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-dark-bg">
              Recent
            </button>
            <button className="rounded-lg bg-dark-card px-4 py-2 text-sm font-medium text-text-secondary hover:bg-dark-border">
              Trending
            </button>
            <button className="rounded-lg bg-dark-card px-4 py-2 text-sm font-medium text-text-secondary hover:bg-dark-border">
              Popular
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {communityProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link
                href={`/blog/${project.id}`}
                className="block overflow-hidden rounded-2xl bg-dark-card transition-all hover:shadow-2xl"
              >
                {/* Project Image with Gradient Overlay */}
                <div className="relative aspect-[4/3] overflow-hidden bg-dark-border">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`mx-auto mb-3 h-16 w-16 rounded-full bg-gradient-to-br ${project.gradient}`} />
                      <p className="text-sm text-text-muted">{project.category}</p>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <div className="flex h-full items-center justify-center">
                      <ExternalLink className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-5">
                  <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-teal-400">
                    {project.title}
                  </h3>
                  <p className="mb-4 text-sm text-text-secondary">
                    {project.description}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${project.gradient} text-xs font-medium text-white`}>
                      {project.author.avatar}
                    </div>
                    <span className="text-sm text-text-muted">
                      built by <span className="text-white">{project.author.name}</span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full bg-dark-card px-6 py-3 text-white transition-all hover:bg-dark-border"
          >
            View all projects
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

