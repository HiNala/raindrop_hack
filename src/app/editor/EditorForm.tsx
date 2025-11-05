'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Eye, Wand2, FileText, Settings, Sparkles, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { TiptapEditor } from '@/components/editor/TiptapEditor'
import { CoverUpload } from '@/components/editor/CoverUpload'
import { TagSelector } from '@/components/editor/TagSelector'
import { saveDraft, publishPost, getOrCreateTags } from '@/app/actions/post-actions'
import { generateAuthenticatedPost } from '@/app/actions/generate-post'
import toast from 'react-hot-toast'

interface Tag {
  id: string
  name: string
  slug: string
}

interface ExistingPost {
  id: string
  title: string
  excerpt: string | null
  contentJson: object
  coverImage: string | null
  published: boolean
  publishedAt: Date | null
  tags: Array<{
    tag: Tag
  }>
  slug: string
}

interface EditorFormProps {
  existingPost?: ExistingPost
}

const AUTO_SAVE_INTERVAL = 3000 // 3 seconds

export default function EditorForm({ existingPost }: EditorFormProps) {
  const router = useRouter()
  
  // Core state
  const [title, setTitle] = useState(existingPost?.title || '')
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt || '')
  const [content, setContent] = useState<object>(existingPost?.contentJson || { type: 'doc', content: [] })
  const [coverImage, setCoverImage] = useState<string | null>(existingPost?.coverImage || null)
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    existingPost?.tags.map((t) => t.tag) || []
  )
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  
  // UI state
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [postId, setPostId] = useState(existingPost?.id)
  const [lastSaved, setLastSaved] = useState<Date | null>(existingPost ? new Date() : null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isDirty, setIsDirty] = useState(false)
  
  // AI state
  const [aiPrompt, setAiPrompt] = useState('')
  const [includeHNContext, setIncludeHNContext] = useState(false)
  const [showAISheet, setShowAISheet] = useState(false)
  const [showPublishSheet, setShowPublishSheet] = useState(false)
  const [publishOptions, setPublishOptions] = useState({
    publishNow: true,
    scheduledAt: '',
    notifyFollowers: true,
  })

  // Load available tags
  useEffect(() => {
    fetch('/api/tags')
      .then((res) => res.json())
      .then((data) => setAvailableTags(data.tags || []))
      .catch(() => {})
  }, [])

  // Track changes for autosave
  useEffect(() => {
    setIsDirty(true)
    setSaveStatus('idle')
  }, [title, content, excerpt, coverImage, selectedTags])

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!title.trim() || !isDirty || isSaving) return

    setSaveStatus('saving')
    setIsSaving(true)

    try {
      // Get or create tag IDs
      const tagNames = selectedTags.map((t) => t.name)
      const tagsResult = await getOrCreateTags(tagNames)

      if (!tagsResult.success) {
        throw new Error(tagsResult.error)
      }

      const result = await saveDraft(postId, {
        title,
        excerpt: excerpt || undefined,
        contentJson: content,
        coverImage: coverImage || undefined,
        tagIds: tagsResult.data,
      })

      if (result.success && result.data) {
        if (!postId) {
          setPostId(result.data.postId)
          router.replace(`/editor/${result.data.postId}`)
        }
        setLastSaved(new Date())
        setSaveStatus('saved')
        setIsDirty(false)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Auto-save error:', error)
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }, [title, content, excerpt, coverImage, selectedTags, postId, isDirty, isSaving, router])

  // Auto-save interval
  useEffect(() => {
    if (!title.trim()) return

    const timer = setTimeout(() => {
      autoSave()
    }, AUTO_SAVE_INTERVAL)

    return () => clearTimeout(timer)
  }, [autoSave])

  // Warn on page unload if unsaved
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && title.trim()) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty, title])

  const handleManualSave = async () => {
    if (!title.trim()) {
      toast.error('Please add a title')
      return
    }

    setIsSaving(true)

    try {
      await autoSave()
      toast.success('Draft saved!')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save draft')
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please describe what you want to write about')
      return
    }

    setIsGenerating(true)

    try {
      const result = await generateAuthenticatedPost(aiPrompt, {
        tone: 'professional',
        length: 'medium',
        includeHNContext,
      })

      if (!result.success) {
        toast.error(result.error || 'Failed to generate post')
        return
      }

      if (result.data) {
        setTitle(result.data.title)
        setContent(result.data.contentJson)
        setExcerpt(result.data.excerpt || '')
        
        // Add suggested tags
        if (result.data.suggestedTags && result.data.suggestedTags.length > 0) {
          const newTags = result.data.suggestedTags.slice(0, 3).map(tagName => ({
            id: `temp_${Date.now()}_${tagName}`,
            name: tagName,
            slug: tagName.toLowerCase().replace(/\s+/g, '-')
          }))
          setSelectedTags(prev => [...prev, ...newTags])
        }

        setShowAISheet(false)
        setAiPrompt('')
        toast.success('Content generated! Review and edit as needed.')
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = async () => {
    if (!postId) {
      toast.error('Please save your draft first')
      await handleManualSave()
      return
    }

    if (!title.trim()) {
      toast.error('Please add a title')
      return
    }

    if (selectedTags.length === 0) {
      toast.error('Please add at least one tag')
      return
    }

    setIsPublishing(true)

    try {
      // Save first
      await autoSave()

      const result = await publishPost(postId)

      if (result.success && result.data) {
        setShowPublishSheet(false)
        toast.success('Post published successfully!')
        router.push(`/p/${result.data.slug}`)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Publish error:', error)
      toast.error('Failed to publish post')
    } finally {
      setIsPublishing(false)
    }
  }

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Loader2 className="w-3 h-3 animate-spin" />
      case 'saved':
        return <CheckCircle className="w-3 h-3 text-teal-400" />
      case 'error':
        return <AlertCircle className="w-3 h-3 text-orange-400" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        return lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Saved'
      case 'error':
        return 'Save failed'
      default:
        return isDirty ? 'Unsaved changes' : 'Up to date'
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-[#0a0a0b]/95 backdrop-blur-lg border-b border-[#27272a]">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {existingPost?.published && (
                  <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/30">
                    Published
                  </Badge>
                )}
                {!existingPost?.published && postId && (
                  <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30">
                    Draft
                  </Badge>
                )}
                
                {/* Save Status */}
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  {getSaveStatusIcon()}
                  <span>{getSaveStatusText()}</span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* AI Assist */}
              <Sheet open={showAISheet} onOpenChange={setShowAISheet}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="border-[#27272a] hover:bg-[#1a1a1d] hover:text-teal-400 text-text-primary">
                    <Wand2 className="w-4 h-4 mr-2" />
                    AI Assist
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-[#1a1a1d] border-[#27272a]">
                  <SheetHeader>
                    <SheetTitle className="text-text-primary flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-teal-400" />
                      AI Content Generation
                    </SheetTitle>
                    <SheetDescription className="text-text-secondary">
                      Generate content using AI, optionally enriched with Hacker News context
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 mt-6">
                    <div>
                      <Label className="text-text-primary">Describe your post</Label>
                      <Textarea
                        placeholder="E.g., 'A comprehensive guide to React hooks with practical examples'"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="mt-2 bg-[#0a0a0b] border-[#27272a] focus:border-teal-500"
                        rows={4}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-text-primary text-sm">Include Hacker News context</Label>
                        <p className="text-xs text-text-secondary">Enrich with relevant discussions and insights</p>
                      </div>
                      <Switch
                        checked={includeHNContext}
                        onCheckedChange={setIncludeHNContext}
                      />
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || !aiPrompt.trim()}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Save Button */}
              <Button
                variant="outline"
                onClick={handleManualSave}
                disabled={isSaving || !title.trim()}
                className="border-[#27272a] hover:bg-[#1a1a1d] text-text-primary"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>

              {/* Publish Button */}
              <Sheet open={showPublishSheet} onOpenChange={setShowPublishSheet}>
                <SheetTrigger asChild>
                  <Button 
                    className="bg-teal-500 hover:bg-teal-600 text-white shadow-glow-teal hover:shadow-lg"
                    disabled={!title.trim() || selectedTags.length === 0}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-[#1a1a1d] border-[#27272a]">
                  <SheetHeader>
                    <SheetTitle className="text-text-primary">Publish Post</SheetTitle>
                    <SheetDescription className="text-text-secondary">
                      Review your post before publishing
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 mt-6">
                    {/* Post Preview */}
                    <Card className="p-4 bg-[#0a0a0b] border-[#27272a]">
                      <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="text-sm text-text-secondary mb-3 line-clamp-3">
                          {excerpt}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <Badge key={tag.id} variant="secondary" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </Card>

                    {/* Publishing Options */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-text-primary text-sm">Publish now</Label>
                          <p className="text-xs text-text-secondary">Make post visible immediately</p>
                        </div>
                        <Switch
                          checked={publishOptions.publishNow}
                          onCheckedChange={(checked) => 
                            setPublishOptions(prev => ({ ...prev, publishNow: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-text-primary text-sm">Notify followers</Label>
                          <p className="text-xs text-text-secondary">Send notification to your followers</p>
                        </div>
                        <Switch
                          checked={publishOptions.notifyFollowers}
                          onCheckedChange={(checked) => 
                            setPublishOptions(prev => ({ ...prev, notifyFollowers: checked }))
                          }
                        />
                      </div>
                    </div>

                    {/* Validation */}
                    <div className="space-y-2">
                      {title.trim() && (
                        <div className="flex items-center gap-2 text-sm text-teal-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Title added</span>
                        </div>
                      )}
                      {selectedTags.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-teal-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>{selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} added</span>
                        </div>
                      )}
                      {content && JSON.stringify(content) !== '{"type":"doc","content":[]}' && (
                        <div className="flex items-center gap-2 text-sm text-teal-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Content added</span>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handlePublish}
                      disabled={isPublishing || !title.trim() || selectedTags.length === 0}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      {isPublishing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Publish Post
                        </>
                      )}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Cover Image */}
          <div>
            <Label className="mb-3 block text-text-primary font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Cover Image (Optional)
            </Label>
            <CoverUpload
              currentImage={coverImage}
              onUpload={setCoverImage}
              onRemove={() => setCoverImage(null)}
            />
          </div>

          {/* Title */}
          <div>
            <Input
              placeholder="Write a compelling title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-4xl md:text-5xl font-bold border-none bg-transparent focus-visible:ring-0 px-0 placeholder:text-text-muted text-text-primary"
            />
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt" className="mb-3 block text-text-primary font-medium">
              Excerpt (Optional)
            </Label>
            <Input
              id="excerpt"
              placeholder="A brief summary to hook your readers..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="bg-[#1a1a1d] border-[#27272a] focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 input"
            />
          </div>

          {/* Tags */}
          <div>
            <Label className="mb-3 block text-text-primary font-medium">
              Tags
            </Label>
            <TagSelector
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              availableTags={availableTags}
            />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <Label className="text-text-primary font-medium">
              Content
            </Label>
            <div className="glass-effect rounded-xl border border-[#27272a] overflow-hidden">
              <TiptapEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your story..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}