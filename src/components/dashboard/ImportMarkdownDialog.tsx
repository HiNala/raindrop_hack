'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Upload, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'

export function ImportMarkdownDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [markdown, setMarkdown] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.md') && !selectedFile.name.endsWith('.markdown')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a Markdown file (.md or .markdown)',
        variant: 'destructive',
      })
      return
    }

    setFile(selectedFile)
    
    // Read file content
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setMarkdown(content)
    }
    reader.readAsText(selectedFile)
  }

  const handleImport = async () => {
    if (!markdown.trim()) {
      toast({
        title: 'No content',
        description: 'Please provide markdown content or upload a file',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/import-markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown, title: title || undefined }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }

      toast({
        title: 'Import successful',
        description: 'Your markdown has been imported as a draft',
      })

      setOpen(false)
      router.push(data.redirect)
    } catch (error) {
      console.error('Import error:', error)
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Failed to import markdown',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setMarkdown('')
    setTitle('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-[#27272a] hover:bg-[#1a1a1d] hover:text-teal-400 text-text-primary">
          <FileText className="w-4 h-4 mr-2" />
          Import Markdown
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#1a1a1d] border-[#27272a] text-text-primary">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Upload className="w-6 h-6 text-teal-400" />
            Import Markdown
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Upload a markdown file or paste content directly. We'll create a draft for you to edit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-text-primary">
              Title (optional)
            </Label>
            <Input
              id="title"
              placeholder="Leave blank to extract from markdown"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#0a0a0b] border-[#27272a] focus:border-teal-500 text-text-primary"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-text-primary">
              Upload File
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".md,.markdown"
                onChange={handleFileSelect}
                className="bg-[#0a0a0b] border-[#27272a] focus:border-teal-500 text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-teal-500 file:text-white hover:file:bg-teal-600"
              />
              {file && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-text-secondary hover:text-orange-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {file && (
              <p className="text-sm text-teal-400">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Or Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#27272a]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1a1a1d] px-2 text-text-muted">Or paste content</span>
            </div>
          </div>

          {/* Markdown Textarea */}
          <div className="space-y-2">
            <Label htmlFor="markdown" className="text-text-primary">
              Markdown Content
            </Label>
            <Textarea
              id="markdown"
              placeholder="# Your Title&#10;&#10;Your content here..."
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={10}
              className="bg-[#0a0a0b] border-[#27272a] focus:border-teal-500 text-text-primary font-mono text-sm"
            />
            <p className="text-xs text-text-muted">
              {markdown.split(/\s+/).length} words • ~{Math.ceil(markdown.split(/\s+/).length / 200)} min read
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-[#27272a] text-text-primary hover:bg-[#0a0a0b]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={loading || !markdown.trim()}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Draft
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

