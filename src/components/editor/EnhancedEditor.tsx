'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Create lowlight instance
const lowlight = createLowlight(common)

interface EnhancedEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  editable?: boolean
  className?: string
  onVersionCreate?: (snapshot: any) => void
  postId?: string
}

export function EnhancedEditor({
  content,
  onChange,
  placeholder = 'Start writing your story...',
  editable = true,
  className,
  onVersionCreate,
  postId,
}: EnhancedEditorProps) {
  const [isCreatingVersion, setIsCreatingVersion] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [readTime, setReadTime] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-accent-teal hover:text-accent-teal/80 underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-surface-100 text-text-primary rounded-lg p-4 my-4',
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      const html = editor.getHTML()

      // Update word count and read time
      const text = editor.getText()
      const words = text.trim().split(/\s+/).filter(Boolean)
      setWordCount(words.length)
      setReadTime(Math.ceil(words.length / 200)) // 200 words per minute

      onChange(html)
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-invert max-w-none focus:outline-none',
          'prose-headings:font-semibold prose-headings:text-text-primary',
          'prose-p:text-text-primary prose-p:leading-relaxed',
          'prose-strong:text-text-primary prose-strong:font-semibold',
          'prose-code:text-accent-teal prose-code:bg-surface-100 prose-code:px-1 prose-code:rounded',
          'prose-pre:bg-surface-100 prose-pre:border prose-pre:border-surface-300',
          'prose-blockquote:text-text-secondary prose-blockquote:border-l-accent-teal',
          'prose-hr:border-surface-300',
          'min-h-[200px] p-4',
          editable ? 'cursor-text' : 'cursor-default'
        ),
      },
    },
  })

  // Auto-create version snapshots
  const createVersionSnapshot = useCallback(async () => {
    if (!onVersionCreate || !postId || !editor) return

    setIsCreatingVersion(true)

    try {
      const snapshot = {
        content: editor.getJSON(),
        html: editor.getHTML(),
        wordCount,
        readTime,
        timestamp: new Date().toISOString(),
      }

      await onVersionCreate(snapshot)
    } catch (error) {
      console.error('Failed to create version snapshot:', error)
      toast.error('Failed to save version snapshot')
    } finally {
      setIsCreatingVersion(false)
    }
  }, [editor, onVersionCreate, postId, wordCount, readTime])

  // Auto-save version every 5 minutes or every 100 words
  useEffect(() => {
    if (!postId || !onVersionCreate) return

    const interval = setInterval(
      () => {
        createVersionSnapshot()
      },
      5 * 60 * 1000
    ) // 5 minutes

    return () => clearInterval(interval)
  }, [createVersionSnapshot, postId, onVersionCreate])

  useEffect(() => {
    if (wordCount > 0 && wordCount % 100 === 0) {
      createVersionSnapshot()
    }
  }, [wordCount, createVersionSnapshot])

  // Keyboard shortcuts
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + S to create version snapshot
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault()
        createVersionSnapshot()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor, createVersionSnapshot])

  if (!editor) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-surface-100 rounded mb-4"></div>
        <div className="h-4 bg-surface-100 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-surface-100 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Toolbar */}
      {editable && (
        <div className="flex items-center justify-between mb-4 p-2 bg-surface-100 rounded-lg">
          <div className="flex items-center gap-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
            >
              <strong>B</strong>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
            >
              <em>I</em>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
              active={editor.isActive('underline')}
            >
              <u>U</u>
            </ToolbarButton>

            <div className="w-px h-4 bg-surface-300"></div>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive('heading', { level: 2 })}
            >
              H2
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor.isActive('heading', { level: 3 })}
            >
              H3
            </ToolbarButton>

            <div className="w-px h-4 bg-surface-300"></div>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
            >
              •
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
            >
              1.
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive('codeBlock')}
            >
              {'</>'}
            </ToolbarButton>

            <div className="w-px h-4 bg-surface-300"></div>

            <ToolbarButton
              onClick={() => {
                const url = window.prompt('Enter URL:')
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run()
                }
              }}
              active={editor.isActive('link')}
            >
              🔗
            </ToolbarButton>

            <ToolbarButton
              onClick={() => {
                const url = window.prompt('Enter image URL:')
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run()
                }
              }}
            >
              🖼️
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>{wordCount} words</span>
            <span>≈ {readTime} min read</span>
            {isCreatingVersion && <span className="text-accent-teal">Saving version...</span>}
          </div>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center gap-4">
          <span>
            {editor.storage.markdown?.getMarkdown()
              ? `${editor.storage.markdown?.getMarkdown().length} characters`
              : `${wordCount * 5} characters (approx)`}
          </span>
          {editable && (
            <button
              onClick={createVersionSnapshot}
              disabled={isCreatingVersion}
              className="hover:text-text-primary transition-colors"
            >
              {isCreatingVersion ? 'Saving...' : 'Save version (⌘S)'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {editor.isActive('bold') && (
            <span className="px-2 py-1 bg-surface-100 rounded">Bold</span>
          )}
          {editor.isActive('italic') && (
            <span className="px-2 py-1 bg-surface-100 rounded">Italic</span>
          )}
          {editor.isActive('codeBlock') && (
            <span className="px-2 py-1 bg-surface-100 rounded">Code</span>
          )}
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({
  children,
  onClick,
  disabled = false,
  active = false,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-2 py-1 rounded text-sm font-medium transition-all',
        'hover:bg-surface-200 hover:text-text-primary',
        'focus:outline-none focus:ring-2 focus:ring-accent-teal/50',
        active ? 'bg-accent-teal text-white' : 'text-text-secondary',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  )
}
