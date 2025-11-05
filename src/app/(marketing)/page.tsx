import { AnimatedHero } from '@/components/marketing/AnimatedHero'
import { FeatureGrid } from '@/components/marketing/FeatureGrid'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { AIShowcase } from '@/components/marketing/AIShowcase'
import { Testimonials } from '@/components/marketing/Testimonials'
import { PricingTeaser, CTASection } from '@/components/marketing/CTASection'
import { CommunityShowcase } from '@/components/marketing/CommunityShowcase'

export default function LandingPage() {
  return (
    <>
      {/* Hero Section - Full height, no extra spacing */}
      <AnimatedHero />
      
      {/* Content Sections - Proper spacing between sections */}
      <div className="space-y-24 pb-24">
        <CommunityShowcase />
        <FeatureGrid />
        <HowItWorks />
        <AIShowcase />
        <Testimonials />
        <PricingTeaser />
        <CTASection />
      </div>
    </>
  )
}
