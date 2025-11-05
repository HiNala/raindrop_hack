'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Sparkles, Wand2, Loader2, ArrowRight, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
  const { isSignedIn, user } = useUser()
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState<'professional' | 'casual' | 'technical'>('professional')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [isGenerating, setIsGenerating] = useState(false)
  const [anonymousCount, setAnonymousCount] = useState(0)

  // Load anonymous post count from localStorage
  useEffect(() => {
    if (!isSignedIn) {
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
  }, [isSignedIn])

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
        // Anonymous user - save to localStorage
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
        
        setAnonymousCount(drafts.length)
        toast.success('Post generated! Saved to your drafts.')
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
    <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-20 overflow-hidden bg-[#0a0a0b]">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px]"></div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass-effect border border-teal-500/20">
            <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
            <span className="text-sm font-medium text-text-primary">
              AI-Powered Blog Generation
            </span>
            <Zap className="w-4 h-4 text-orange-400" />
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-gradient">
              Write Your Story
            </span>
            <br />
            <span className="text-text-primary">
              In Seconds
            </span>
          </h1>
          
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
            Describe your idea and let AI craft a compelling blog post. 
            <span className="text-teal-400 font-medium"> Edit, refine, and publish</span> in minutes.
          </p>

          {!isSignedIn && remainingPosts !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="bg-[#1a1a1d] text-teal-400 border-teal-500/30 text-sm py-1.5 px-4">
                <Sparkles className="w-3 h-3 inline mr-1.5" />
                {remainingPosts} free {remainingPosts === 1 ? 'post' : 'posts'} remaining
              </Badge>
            </motion.div>
          )}
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect p-8 relative overflow-hidden group gradient-border"
        >
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt" className="text-base font-semibold mb-3 block text-text-primary flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-teal-400" />
                What would you like to write about?
              </label>
              <Textarea
                id="prompt"
                placeholder="E.g., 'A comprehensive guide to building scalable web applications' or 'The future of AI in software development'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[140px] text-base resize-none bg-[#0a0a0b] border-[#27272a] focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 input"
                disabled={isGenerating}
              />
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary font-medium">Tone:</span>
                <div className="flex gap-2">
                  {(['professional', 'casual', 'technical'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      disabled={isGenerating}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        tone === t
                          ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                          : 'bg-[#1a1a1d] text-text-secondary border border-[#27272a] hover:border-teal-500/50 hover:text-text-primary'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary font-medium">Length:</span>
                <div className="flex gap-2">
                  {(['short', 'medium', 'long'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLength(l)}
                      disabled={isGenerating}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        length === l
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                          : 'bg-[#1a1a1d] text-text-secondary border border-[#27272a] hover:border-orange-500/50 hover:text-text-primary'
                      }`}
                    >
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                size="lg"
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white text-base font-semibold h-12 group shadow-glow-teal hover:shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Generate with AI
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => router.push('/editor/new')}
                disabled={isGenerating}
                size="lg"
                className="bg-[#1a1a1d] hover:bg-[#2a2a2d] text-text-primary border border-[#27272a] text-base font-medium h-12 px-6"
              >
                Write Manually
              </Button>
            </div>

            <p className="text-xs text-center text-text-secondary pt-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI-generated content is a starting point. Review and personalize before publishing.
            </p>
          </div>
        </motion.div>

        {/* Sign up CTA for anonymous users */}
        {!isSignedIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-text-secondary">
              Want unlimited posts and access to all features?{' '}
              <a
                href="/sign-up"
                className="font-semibold text-teal-400 hover:text-teal-300 transition-colors inline-flex items-center gap-1 group"
              >
                Sign up for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}