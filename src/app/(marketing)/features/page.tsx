import { FeatureShowcase } from '@/components/marketing/FeatureShowcase'
import { ComparisonTable } from '@/components/marketing/FeatureShowcase'

const features = [
  {
    title: 'AI Writing Assistant',
    description:
      'Generate content, improve writing, and get suggestions with GPT-4 powered AI. Transform your ideas into polished articles in minutes.',
    image: '/images/ai-assistant.png',
    features: [
      'Smart content generation based on your prompts',
      'Grammar and style improvements',
      'SEO optimization suggestions',
      'Hacker News context enrichment for tech content',
      'Multiple writing styles and tones',
      'Real-time collaboration with AI assistant',
    ],
    cta: { text: 'Try AI Writing', href: '#demo' },
  },
  {
    title: 'Rich Text Editor',
    description:
      'Beautiful, distraction-free editor with all the features you need for professional content creation.',
    image: '/images/editor.png',
    features: [
      'Markdown support with live preview',
      'Real-time autosave and version history',
      'Code syntax highlighting',
      'Drag & drop image uploads',
      'Table of contents generation',
      'Export to multiple formats',
    ],
    reverse: true,
    cta: { text: 'Start Writing', href: '/editor/new' },
  },
  {
    title: 'Advanced Analytics',
    description: 'Understand your audience with detailed insights and performance metrics.',
    image: '/images/analytics.png',
    features: [
      'Real-time view and engagement tracking',
      'Reader demographics and behavior',
      'Content performance comparison',
      'Traffic source analysis',
      'Email campaign tracking',
      'Custom reports and exports',
    ],
    cta: { text: 'View Analytics', href: '/dashboard' },
  },
  {
    title: 'Monetization Tools',
    description: 'Earn money from your content with built-in monetization features.',
    image: '/images/monetization.png',
    features: [
      'Premium content with paywall',
      'Newsletter subscriptions',
      'Donation and tipping system',
      'Sponsored content management',
      'Affiliate link tracking',
      'Multi-currency support',
    ],
    reverse: true,
    cta: { text: 'Start Earning', href: '/pricing' },
  },
  {
    title: 'SEO Optimization',
    description: 'Get discovered with automatic SEO optimization and social media integration.',
    image: '/images/seo.png',
    features: [
      'Automatic meta tag generation',
      'Social media preview optimization',
      'XML sitemap generation',
      'Schema markup for rich snippets',
      'Google Search Console integration',
      'Performance monitoring',
    ],
    cta: { text: 'Learn SEO', href: '/blog/seo-guide' },
  },
  {
    title: 'Team Collaboration',
    description: 'Work together with your team on content creation and management.',
    image: '/images/team.png',
    features: [
      'Role-based permissions',
      'Collaborative editing',
      'Content approval workflows',
      'Team analytics dashboard',
      'Comment and review system',
      'Custom workflows',
    ],
    reverse: true,
    cta: { text: 'Build Team', href: '/pricing' },
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold">Powerful features for modern creators</h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Everything you need to create, publish, and grow your audience. From AI-powered writing
            to advanced analytics, we&apos;ve got you covered.
          </p>
        </div>

        {features.map((feature, i) => (
          <FeatureShowcase key={i} {...feature} />
        ))}

        <ComparisonTable />
      </div>
    </div>
  )
}
