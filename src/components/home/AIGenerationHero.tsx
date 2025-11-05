'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Sparkles, Wand2, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { generateAuthenticatedPost, generateAnonymousPost } from '@/app/actions/generate-post'
import toast from 'react-hot-toast'

interface AnonymousDraft {
  id: string
  title: string
  contentJson: object
  excerpt: string
  createdAt: string
  tags: string[]
}

export function AIGenerationHero() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState<'professional' | 'casual' | 'technical'>('professional')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [isGenerating, setIsGenerating] = useState(false)
  const [anonymousCount, setAnonymousCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Ensure client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load anonymous post count from localStorage (client-side only)
  useEffect(() => {
    if (!isSignedIn && isClient) {
      const drafts = localStorage.getItem('anonymousDrafts')
      if (drafts) {
        try {
          const parsed = JSON.parse(drafts) as AnonymousDraft[]
          setAnonymousCount(parsed.length)
        } catch (e) {
          setAnonymousCount(0)
        }
      }
    }
  }, [isSignedIn, isClient])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe what you want to write about')
      return
    }

    if (!isSignedIn && anonymousCount >= 3) {
      toast.error('Please sign in to generate more posts')
      return
    }

    setIsGenerating(true)

    try {
      const result = isSignedIn
        ? await generateAuthenticatedPost(prompt, { tone, length })
        : await generateAnonymousPost(prompt, { tone, length })

      if (!result.success) {
        toast.error(result.error || 'Failed to generate post')
        return
      }

      if (isSignedIn && result.data && 'postId' in result.data) {
        // Authenticated user - redirect to editor
        toast.success('Post generated! Opening editor...')
        router.push(`/editor/${result.data.postId}`)
      } else if (!isSignedIn && result.data) {
        // Anonymous user - save to localStorage (client-side only)
        if (typeof window !== 'undefined') {
          const draft: AnonymousDraft = {
            id: `anon_${Date.now()}`,
            title: result.data.title,
            contentJson: result.data.contentJson,
            excerpt: result.data.excerpt || '',
            createdAt: new Date().toISOString(),
            tags: result.data.suggestedTags || [],
          }

          const existingDrafts = localStorage.getItem('anonymousDrafts')
          const drafts: AnonymousDraft[] = existingDrafts ? JSON.parse(existingDrafts) : []
          drafts.push(draft)
          localStorage.setItem('anonymousDrafts', JSON.stringify(drafts))
        }

        setAnonymousCount(drafts.length)
        toast.success('Post generated! Saved to your drafts.')

        // Redirect to a preview page or show in modal
        // For now, let's show a success message
        setPrompt('')
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const remainingPosts = isSignedIn ? null : 3 - anonymousCount

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              AI-Powered Blog Generation
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            Write Your Story
            <br />
            In Seconds
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Describe your idea and let AI craft a compelling blog post. Edit, refine, and publish in
            minutes.
          </p>

          {!isSignedIn && (
            <div className="mb-4">
              <Badge variant="secondary" className="text-sm py-1 px-3">
                {remainingPosts} free posts remaining before sign-in
              </Badge>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8"
        >
          <div className="space-y-6">
            <div>
              <Label htmlFor="prompt" className="text-base font-semibold mb-3 block">
                What would you like to write about?
              </Label>
              <Textarea
                id="prompt"
                placeholder="E.g., 'A comprehensive guide to React Server Components' or 'The future of AI in web development'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] text-base resize-none"
                disabled={isGenerating}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tone:</span>
                {(['professional', 'casual', 'technical'] as const).map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={tone === t ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTone(t)}
                    disabled={isGenerating}
                    className="capitalize"
                  >
                    {t}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Length:</span>
                {(['short', 'medium', 'long'] as const).map((l) => (
                  <Button
                    key={l}
                    type="button"
                    variant={length === l ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLength(l)}
                    disabled={isGenerating}
                    className="capitalize"
                  >
                    {l}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push('/editor/new')}
                disabled={isGenerating}
              >
                Write Manually
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              ✨ AI-generated content is a starting point. Review and personalize before publishing.
            </p>
          </div>
        </motion.div>

        {!isSignedIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Want unlimited posts?{' '}
              <a
                href="/sign-up"
                className="font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400"
              >
                Sign up for free
              </a>
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
