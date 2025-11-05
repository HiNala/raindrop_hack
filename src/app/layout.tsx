import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { InstallBanner } from '@/components/layout/InstallBanner'
import { ServiceWorkerRegister } from '@/components/layout/ServiceWorkerRegister'
import { ResponsiveTest } from '@/components/test/ResponsiveTest'
import { HydrationTest } from '@/components/test/HydrationTest'
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
  manifest: '/manifest.json',
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
          <ServiceWorkerRegister />
          <div className="min-h-[100dvh] flex flex-col">
            <InstallBanner />
            <Header />
            <main className="flex-1 pb-[calc(4rem+var(--safe-bottom,0px))] relative">
              <Suspense
                fallback={
                  <div className="container-responsive py-responsive">
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-gray-800 rounded w-3/4" />
                      <div className="h-4 bg-gray-800 rounded w-1/2" />
                      <div className="h-32 bg-gray-800 rounded" />
                    </div>
                  </div>
                }
              >
                <div className="container-responsive py-responsive">
                  {children}
                </div>
              </Suspense>
            </main>
            <Suspense
              fallback={
                <div className="h-32 bg-gray-900 border-t border-gray-800 animate-pulse" />
              }
            >
              <Footer />
            </Suspense>
            <BottomNavigation />
            <HydrationTest />
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
