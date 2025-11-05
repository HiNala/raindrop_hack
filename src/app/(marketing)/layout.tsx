import { ReactNode } from 'react'

interface MarketingLayoutProps {
  children: ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  // Simple passthrough - root layout already provides Header/Footer
  return <>{children}</>
}
