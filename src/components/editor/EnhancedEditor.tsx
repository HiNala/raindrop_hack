'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Wand2, 
  Settings,
  Image,
  Tag,
  HelpCircle,
  Sparkles,
  Search,
  ExternalLink,
  Toggle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface AIGenerationOptions {
  audience: 'beginners' | 'intermediate' | 'experts'
  tone: 'casual' | 'professional' | 'technical' | 'creative'
  length: 'short' | 'medium' | 'long'
  includeHnContext: boolean
}

interface HnSource {
  id: string
  title: string
  url: string
  author: string
  points: number
  createdAt: string
  snippet: string
}

export function EnhancedEditor({ postId }: { postId?: string }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState('')
  const [status, setStatus] = useState<'draft' | 'autosaved' | 'published'>('draft')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [showAssistPanel, setShowAssistPanel] = useState(true)
  const [hnSources, setHnSources] = useState<HnSource[]>([])
  const autosaveTimeoutRef = useRef<NodeJS.Timeout>()

  const [aiOptions, setAiOptions] = useState<AIGenerationOptions>({
    audience: 'intermediate',
    tone: 'professional',
    length: 'medium',
    includeHnContext: false
  })

  // Autosave functionality
  useEffect(() => {
    if (title || content) {
      setStatus('autosaved')
      
      // Clear existing timeout
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current)
      }
      
      // Set new autosave timeout
      autosaveTimeoutRef.current = setTimeout(() => {
        handleSave(true) // Silent autosave
      }, 3000) // 3 seconds after last change
    }

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current)
      }
    }
  }, [title, content])

  const handleSave = async (silent = false) => {
    try {
      // TODO: Implement actual save logic
      setStatus('autosaved')
      if (!silent) {
        // Show success toast
        console.log('Saved successfully')
      }
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const handlePublish = async () => {
    try {
      // TODO: Implement publish logic
      setStatus('published')
      console.log('Published successfully')
    } catch (error) {
      console.error('Publish failed:', error)
    }
  }

  const searchHackerNews = async (query: string) => {
    try {
      // Search by relevance
      const relevanceResponse = await fetch(
        `http://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=5`
      )
      const relevanceData = await relevanceResponse.json()
      
      // Search by date for recent discussion
      const dateResponse = await fetch(
        `http://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=5`
      )
      const dateData = await dateResponse.json()
      
      // Combine and de-duplicate
      const allHits = [...relevanceData.hits, ...dateData.hits]
      const uniqueHits = allHits.filter((hit, index, self) => 
        index === self.findIndex((h) => h.objectID === hit.objectID)
      )
      
      const sources: HnSource[] = uniqueHits.slice(0, 5).map((hit: any) => ({
        id: hit.objectID,
        title: hit.title,
        url: hit.url,
        author: hit.author,
        points: hit.points,
        createdAt: hit.created_at,
        snippet: hit.story_text || hit._highlightResult?.title?.value || ''
      }))
      
      setHnSources(sources)
      return sources
    } catch (error) {
      console.error('Hacker News search failed:', error)
      return []
    }
  }

  const generateWithAI = async (prompt: string) => {
    setIsGenerating(true)
    
    try {
      let contextPack = []
      
      // Get Hacker News context if enabled
      if (aiOptions.includeHnContext) {
        const keywords = prompt.split(' ').slice(0, 5).join(' ') // Simple keyword extraction
        contextPack = await searchHackerNews(keywords)
      }
      
      // TODO: Call your AI generation API
      // For now, simulate generation
      setTimeout(() => {
        const generatedTitle = `AI Generated: ${prompt.substring(0, 50)}...`
        const generatedContent = generateMockContent(prompt, contextPack)
        
        setTitle(generatedTitle)
        setContent(generatedContent)
        setIsGenerating(false)
        setShowAiModal(false)
        
        // Add citations if HN context was used
        if (contextPack.length > 0) {
          const citationsSection = generateCitationsSection(contextPack)
          setContent(prev => prev + citationsSection)
        }
      }, 3000)
      
    } catch (error) {
      console.error('AI generation failed:', error)
      setIsGenerating(false)
    }
  }

  const generateMockContent = (prompt: string, hnSources: HnSource[]) => {
    let content = `# ${prompt.substring(0, 50)}...\n\n`
    content += `This is an AI-generated article about ${prompt}. `
    content += `The content is tailored for ${aiOptions.audience} with a ${aiOptions.tone} tone.\n\n`
    
    content += `## Introduction\n\n`
    content += `In this article, we'll explore the key aspects of ${prompt}. `
    content += `This topic has gained significant attention in recent months, with many experts weighing in on the subject.\n\n`
    
    if (hnSources.length > 0) {
      content += `The discussion on platforms like Hacker News has been particularly insightful. `
      content += `Several high-quality discussions have emerged around this topic [HN-1][HN-2].\n\n`
    }
    
    content += `## Key Points\n\n`
    content += `- First important consideration\n`
    content += `- Second critical aspect\n`
    content += `- Third notable point\n\n`
    
    content += `## Conclusion\n\n`
    content += `This exploration of ${prompt} reveals several important insights. `
    content += `As we continue to see developments in this area, it's clear that this topic will remain relevant.`
    
    return content
  }

  const generateCitationsSection = (sources: HnSource[]) => {
    let citations = `\n\n---\n\n## Sources\n\n`
    sources.forEach((source, index) => {
      citations += `[HN-${index + 1}]: [${source.title}](${source.url}) by ${source.author} (${source.points} points)\n`
    })
    return citations
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Editor Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  status === 'published' ? 'bg-green-500' : 
                  status === 'autosaved' ? 'bg-blue-500 animate-pulse' : 
                  'bg-gray-400'
                }`} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {status}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAssistPanel(!showAssistPanel)}
                className="flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                AI Assist
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave()}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={() => handlePublish()}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              >
                <Send className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Editor */}
          <div className={`flex-1 transition-all duration-300 ${showAssistPanel ? 'mr-80' : ''}`}>
            <div className="space-y-6">
              {/* Title Field */}
              <div>
                <Input
                  placeholder="Enter your title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl font-bold h-12 border-none shadow-none focus:ring-0 px-0 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              {/* Cover Image Drop Zone */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer">
                <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drop cover image here or click to upload
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer">
                    #{tag}
                  </Badge>
                ))}
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                  + Add tag
                </Badge>
              </div>

              {/* Content Editor */}
              <Textarea
                placeholder="Start writing your article..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-96 border-none shadow-none focus:ring-0 resize-none text-base leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />

              {/* Sources Section (if HN context was used) */}
              {hnSources.length > 0 && (
                <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      Hacker News Sources
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {hnSources.map((source, index) => (
                      <div key={source.id} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <Badge variant="outline" className="text-xs mt-1">
                          HN-{index + 1}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {source.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            by {source.author} • {source.points} points
                          </p>
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View source
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* AI Assist Panel */}
          {showAssistPanel && (
            <div className="w-80 fixed right-0 top-16 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg z-20">
              <div className="p-6 space-y-6 h-full overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      AI Assist
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAssistPanel(false)}
                  >
                    ×
                  </Button>
                </div>

                {/* Generate with AI */}
                <Card className="p-4">
                  <Button
                    onClick={() => setShowAiModal(true)}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </Card>

                {/* AI Options */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                    Generation Options
                  </h4>
                  
                  <div>
                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Audience
                    </Label>
                    <select 
                      className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                      value={aiOptions.audience}
                      onChange={(e) => setAiOptions(prev => ({ ...prev, audience: e.target.value as any }))}
                    >
                      <option value="beginners">Beginners</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="experts">Experts</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Tone
                    </Label>
                    <select 
                      className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                      value={aiOptions.tone}
                      onChange={(e) => setAiOptions(prev => ({ ...prev, tone: e.target.value as any }))}
                    >
                      <option value="casual">Casual</option>
                      <option value="professional">Professional</option>
                      <option value="technical">Technical</option>
                      <option value="creative">Creative</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Length
                    </Label>
                    <select 
                      className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                      value={aiOptions.length}
                      onChange={(e) => setAiOptions(prev => ({ ...prev, length: e.target.value as any }))}
                    >
                      <option value="short">Short (300-500 words)</option>
                      <option value="medium">Medium (800-1200 words)</option>
                      <option value="long">Long (1500+ words)</option>
                    </select>
                  </div>
                </div>

                <Separator />

                {/* Hacker News Toggle */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        Include Hacker News context
                      </Label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Enrich content with relevant HN discussions
                      </p>
                    </div>
                    <Switch
                      checked={aiOptions.includeHnContext}
                      onCheckedChange={(checked) => setAiOptions(prev => ({ ...prev, includeHnContext: checked }))}
                    />
                  </div>
                  
                  {aiOptions.includeHnContext && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div className="text-xs text-blue-900 dark:text-blue-100">
                          <p className="font-medium mb-1">Privacy Notice</p>
                          <p>
                            Keywords from your prompt will be sent to Hacker News search API 
                            to find relevant discussions. No personal data is shared.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Generation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Generate with AI</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Describe what you want to write about</Label>
                <Textarea
                  placeholder="E.g., 'A comprehensive guide to React Server Components'..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowAiModal(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={() => generateWithAI('sample prompt')} className="flex-1">
                  Generate
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}