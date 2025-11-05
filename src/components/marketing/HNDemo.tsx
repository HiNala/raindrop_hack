'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Sparkles, ExternalLink, TrendingUp, MessageSquare, Info, Zap } from 'lucide-react'
import Link from 'next/link'

export function HNDemo() {
  const [enabled, setEnabled] = useState(false)

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-orange-500">New Feature</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Hacker News Context
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Enrich your content with relevant Hacker News discussions and citations automatically
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Live Demo Card */}
          <Card className="p-6 bg-white dark:bg-gray-900 border-2 border-orange-200 dark:border-orange-800">
            <div className="flex flex-col space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Try It Out
                  </h3>
                </div>
                <Badge variant={enabled ? 'default' : 'secondary'} className={enabled ? 'bg-orange-500' : ''}>
                  {enabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Toggle */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Switch
                  checked={enabled}
                  onCheckedChange={setEnabled}
                  className={enabled ? 'bg-orange-500' : ''}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Enable HN Context
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Automatically find relevant discussions
                  </p>
                </div>
              </div>

              {/* Preview */}
              {enabled && (
                <div className="space-y-3 animate-in slide-in-from-top-4">
                  <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Citations will appear as inline markers like{' '}
                      <span className="inline-block bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-1.5 py-0.5 rounded font-mono text-xs">
                        [HN-1]
                      </span>{' '}
                      with links to discussions.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-orange-500" />
                      Sample Citation
                    </h4>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        "Show HN: AI-Powered Writing Tool"
                      </h5>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          234 points
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          89 comments
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open('https://news.ycombinator.com', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Browse Hacker News
                  </Button>
                </div>
              )}

              {/* CTA */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                  <Link href="/editor/new">
                    <Zap className="w-4 h-4 mr-2" />
                    Start Writing with HN Context
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Why Use HN Context?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Credibility Boost
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Back your content with real discussions from the tech community
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Stay Current
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Reference latest trends and discussions happening right now
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Community Insights
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Leverage insights from thousands of tech professionals
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Automatic Citations
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      No manual work - citations are added automatically as you write
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-orange-600 dark:text-orange-400">Pro tip:</strong> Enable HN context when writing about technology, startups, or anything discussed on Hacker News for the most relevant citations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

