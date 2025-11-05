import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastProvider } from '@/components/ui/toast'
import { Header } from '@/components/layout/Header'
import { CommandPalette, useCommandPalette } from '@/components/search/CommandPalette'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Blog App - Modern Publishing Platform',
  description: 'A beautifully designed blog application for sharing your stories with the world.',
  keywords: 'blog, writing, publishing, nextjs, react',
  authors: [{ name: 'Blog App Team' }],
  openGraph: {
    title: 'Blog App - Modern Publishing Platform',
    description: 'A beautifully designed blog application for sharing your stories with the world.',
    type: 'website',
  },
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useCommandPalette()

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="relative">{children}</main>
      </div>
      <CommandPalette isOpen={isOpen} onClose={close} />
    </>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <body className="font-sans antialiased">
          <ToastProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}