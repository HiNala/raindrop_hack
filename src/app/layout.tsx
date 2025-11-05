import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Header } from '@/components/layout/Header'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Raindrop - AI-Powered Writing Platform',
  description: 'Create compelling blog posts in seconds with AI. Share your stories with the world.',
  keywords: 'blog, writing, publishing, AI, nextjs, react',
  authors: [{ name: 'Raindrop Team' }],
  openGraph: {
    title: 'Raindrop - AI-Powered Writing Platform',
    description: 'Create compelling blog posts in seconds with AI. Share your stories with the world.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        <body className="font-sans antialiased bg-[#0a0a0b] text-[#fafafa]">
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
