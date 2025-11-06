import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { InstallBanner } from '@/components/layout/InstallBanner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Raindrop - AI-Powered Writing Platform',
  description:
    'Create compelling blog posts in seconds with AI. Share your stories with the world.',
  keywords: 'blog, writing, publishing, AI, nextjs, react',
  authors: [{ name: 'Raindrop Team' }],
  openGraph: {
    title: 'Raindrop - AI-Powered Writing Platform',
    description:
      'Create compelling blog posts in seconds with AI. Share your stories with the world.',
    type: 'website',
  },
  // Temporarily disabled to prevent icon requests
  // manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  maximumScale: 5,
  userScalable: true,
  themeColor: '#14b8a6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#14b8a6',
          colorBackground: '#1a1a1d',
          colorInputBackground: '#0a0a0b',
          colorInputText: '#fafafa',
          colorText: '#fafafa',
          colorTextSecondary: '#a1a1aa',
        },
        elements: {
          card: 'glass-effect',
          formButtonPrimary: 'bg-teal-500 hover:bg-teal-600',
        },
      }}
    >
      <html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>
        <body className="font-sans antialiased bg-[#0a0a0b] text-[#fafafa] overflow-x-hidden">
          {/* ServiceWorkerRegister temporarily disabled - causing reload loop */}
          {/* <ServiceWorkerRegister /> */}
          <div className="min-h-[100dvh] flex flex-col">
            {/* Install banner - mobile/tablet only */}
            <div className="lg:hidden">
              <InstallBanner />
            </div>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Suspense
              fallback={
                <div className="h-32 bg-gray-900 border-t border-gray-800 animate-pulse" />
              }
            >
              <Footer />
            </Suspense>
            {/* Bottom navigation - mobile only */}
            <div className="md:hidden">
              <BottomNavigation />
            </div>
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1a1a1d',
                border: '1px solid #27272a',
                color: '#fafafa',
                maxWidth: 'calc(100vw - 2rem)',
              },
              className: 'safe-px',
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}
