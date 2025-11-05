'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Eye, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { TiptapEditor } from '@/components/editor/TiptapEditor'
import { CoverUpload } from '@/components/editor/CoverUpload'
import { TagSelector } from '@/components/editor/TagSelector'
import { saveDraft, publishPost, getOrCreateTags } from '@/app/actions/post-actions'
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
  tags: Array<{
    tag: Tag
  }>
}

interface EditorFormProps {
  existingPost?: ExistingPost
}

export default function EditorForm({ existingPost }: EditorFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(existingPost?.title || '')
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt || '')
  const [content, setContent] = useState<object>(existingPost?.contentJson || { type: 'doc', content: [] })
  const [coverImage, setCoverImage] = useState<string | null>(existingPost?.coverImage || null)
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    existingPost?.tags.map((t) => t.tag) || []
  )
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [postId, setPostId] = useState(existingPost?.id)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load available tags
  useEffect(() => {
    fetch('/api/tags')
      .then((res) => res.json())
      .then((data) => setAvailableTags(data.tags || []))
      .catch(() => {})
  }, [])

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!title.trim()) return

    const timer = setTimeout(() => {
      handleSave(true) // silent save
    }, 30000)

    return () => clearTimeout(timer)
  }, [title, content, excerpt, coverImage, selectedTags])

  const handleSave = async (silent = false) => {
    if (!title.trim()) {
      if (!silent) toast.error('Please add a title')
      return
    }

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
        if (!silent) toast.success('Draft saved!')
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Save error:', error)
      if (!silent) toast.error('Failed to save draft')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!postId) {
      toast.error('Please save your draft first')
      await handleSave()
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
      await handleSave(true)

      const result = await publishPost(postId)

      if (result.success && result.data) {
        toast.success('Post published!')
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

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0b]/95 backdrop-blur-lg border-b border-[#27272a]">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>

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

              {lastSaved && (
                <span className="text-xs text-text-secondary">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave()}
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
                    Save Draft
                  </>
                )}
              </Button>

              <Button
                onClick={handlePublish}
                disabled={isPublishing || isSaving || !title.trim() || selectedTags.length === 0}
                className="bg-teal-500 hover:bg-teal-600 text-white shadow-glow-teal hover:shadow-lg"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-5xl mx-auto px-4 py-8">
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