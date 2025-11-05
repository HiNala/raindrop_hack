import { AnimatedHero } from '@/components/marketing/AnimatedHero'
import { FeatureGrid } from '@/components/marketing/FeatureGrid'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { AIShowcase } from '@/components/marketing/AIShowcase'
import { Testimonials } from '@/components/marketing/Testimonials'
import { PricingTeaser, CTASection } from '@/components/marketing/CTASection'
import { CommunityShowcase } from '@/components/marketing/CommunityShowcase'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <AnimatedHero />
      <CommunityShowcase />
      <FeatureGrid />
      <HowItWorks />
      <AIShowcase />
      <Testimonials />
      <PricingTeaser />
      <CTASection />
    </div>
  )
}
