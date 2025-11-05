'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Wand2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export function AIGenerationHero() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please describe what you want to write about')
      return
    }

    setIsGenerating(true)
    
    // Simulate generation for now
    setTimeout(() => {
      setIsGenerating(false)
      setPrompt('')
      router.push('/editor/new')
    }, 2000)
  }

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-8">
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
            Describe your idea and let AI craft a compelling blog post. Edit, refine, and publish in minutes.
          </p>

          <div className="mb-4">
            <Badge variant="secondary" className="text-sm py-1 px-3">
              Demo Mode - Sign in for full features
            </Badge>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8">
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
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Want unlimited posts?{' '}
            <a
              href="/sign-up"
              className="font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400"
            >
              Sign up for free
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}