/**
 * AI Showcase Component
 * Interactive demo of AI generation capabilities
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function AIShowcase() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState('')

  const examples = [
    'How to build a SaaS product in 2024',
    'The future of AI in content creation',
    'Best practices for remote team management',
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setGenerated(`# ${prompt}\n\nThis is an AI-generated article about ${prompt}. With our platform, you can create high-quality content like this in seconds...\n\n## Key Points\n\n1. First important point\n2. Second important point\n3. Third important point`)
    setIsGenerating(false)
  }

  return (
    <section id="demo" className="py-24 bg-dark-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            See AI in action
          </h2>
          <p className="text-xl text-text-secondary">
            Try it yourself - generate content in seconds
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-dark-border bg-dark-card p-8">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                What do you want to write about?
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your topic or idea..."
                className="min-h-[100px]"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-text-muted">Try:</span>
                {examples.map((example) => (
                  <button
                    key={example}
                    onClick={() => setPrompt(example)}
                    className="rounded-lg border border-dark-border px-3 py-1 text-sm transition-colors hover:border-teal-400/50 hover:text-teal-400"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate with AI
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <AnimatePresence>
              {generated && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="rounded-lg border border-teal-400/30 bg-teal-400/5 p-6">
                    <div className="mb-3 flex items-center gap-2 text-sm text-teal-400">
                      <Sparkles className="h-4 w-4" />
                      <span>AI-Generated Content</span>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-text-secondary">
                      {generated}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
