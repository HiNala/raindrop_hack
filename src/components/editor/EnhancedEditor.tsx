/**
 * Enhanced Editor with Autosave and Debounce
 */

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useCallback, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { toast } from 'sonner'
import { Save, Loader2, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Register syntax highlighting
const lowlight = createLowlight(common)
// Note: In production, you'd want to dynamically load these
// For now, we'll use the basic syntax highlighting provided by common

interface EnhancedEditorProps {
  initialContent?: string
  placeholder?: string
  editable?: boolean
  onSave?: (content: string) => Promise<void>
  debounceMs?: number
  className?: string
  showToolbar?: boolean
}

export function EnhancedEditor({
  initialContent = '',
  placeholder = 'Start writing...',
  editable = true,
  onSave,
  debounceMs = 2000,
  className = '',
  showToolbar = true,
}: EnhancedEditorProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Use enhanced code block
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-teal-500 hover:text-teal-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto',
        },
      }),
    ],
    content: initialContent,
    editable,
    onUpdate: ({ editor: _editor }) => {
      setHasUnsavedChanges(true)
      setSaveStatus('idle')
    },
  })

  // Debounced save function
  const debouncedSave = useDebouncedCallback(
    useCallback(async (content: string) => {
      if (!onSave || !content || content === initialContent) return

      setSaveStatus('saving')

      try {
        await onSave(content)
        setSaveStatus('saved')
        setLastSaved(new Date())
        setHasUnsavedChanges(false)

        // Clear saved status after 2 seconds
        setTimeout(() => {
          if (saveStatus === 'saved') {
            setSaveStatus('idle')
          }
        }, 2000)
      } catch (error) {
        setSaveStatus('error')
        toast.error('Failed to save changes')
      }
    }, [onSave, initialContent, saveStatus]),
    debounceMs
  )

  // Auto-save on content change
  useEffect(() => {
    if (!editor) return

    const handleUpdate = () => {
      const content = editor.getHTML()
      debouncedSave(content)
    }

    editor.on('update', handleUpdate)
    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor, debouncedSave])

  // Manual save function
  const handleSave = useCallback(async () => {
    if (!editor || !onSave) return

    const content = editor.getHTML()
    setSaveStatus('saving')

    try {
      await onSave(content)
      setSaveStatus('saved')
      setLastSaved(new Date())
      setHasUnsavedChanges(false)

      setTimeout(() => {
        setSaveStatus('idle')
      }, 2000)
    } catch (error) {
      setSaveStatus('error')
      toast.error('Failed to save changes')
    }
  }, [editor, onSave])

  // Keyboard shortcuts
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault()
        handleSave()
      }

      // Cmd/Ctrl + Shift + S to force save
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'S') {
        event.preventDefault()
        debouncedSave.flush()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor, handleSave, debouncedSave])

  // Save status indicator
  const SaveStatusIndicator = () => (
    <div className="flex items-center gap-2 text-sm">
      {saveStatus === 'saving' && (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-blue-500">Saving...</span>
        </>
      )}

      {saveStatus === 'saved' && (
        <>
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-green-500">Saved</span>
          {lastSaved && (
            <span className="text-gray-500 text-xs">
              {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </>
      )}

      {saveStatus === 'error' && (
        <>
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-500">Error</span>
        </>
      )}

      {saveStatus === 'idle' && hasUnsavedChanges && (
        <>
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span className="text-gray-500">Unsaved</span>
        </>
      )}
    </div>
  )

  // Enhanced toolbar
  const Toolbar = () => {
    if (!editor || !showToolbar) return null

    return (
      <div className="border-b border-gray-200 pb-3 mb-4 flex flex-wrap gap-2 items-center">
        {/* Text formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          >
            <strong className="font-bold">B</strong>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-gray-200' : ''}
          >
            <em className="italic">I</em>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'bg-gray-200' : ''}
          >
            &lt;/&gt;
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          >
            • List
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
          >
            1. List
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          {[1, 2, 3].map((level) => (
            <Button
              key={level}
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              className={editor.isActive('heading', { level }) ? 'bg-gray-200' : ''}
            >
              H{level}
            </Button>
          ))}
        </div>

        {/* Other */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
          >
            " Quote
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            ↶
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            ↷
          </Button>
        </div>

        {/* Save Status */}
        <div className="flex-1 flex justify-end">
          <SaveStatusIndicator />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saveStatus === 'saving' || !hasUnsavedChanges}
            className="ml-4"
          >
            {saveStatus === 'saving' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="ml-2">
              {saveStatus === 'saving' ? 'Saving...' : 'Save'}
            </span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`enhanced-editor ${className}`}>
      <Toolbar />
      <div className="min-h-[400px] prose prose-gray max-w-none focus:outline-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// Custom hook for editor autosave
export function useEditorAutosave(
  editor: Editor | null,
  saveFunction: (content: string) => Promise<void>,
  options: {
    debounceMs?: number
    autoSave?: boolean
  } = {}
) {
  const { debounceMs = 2000, autoSave = true } = options
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const debouncedSave = useDebouncedCallback(
    async (content: string) => {
      if (!autoSave || !content) return

      setSaveStatus('saving')
      try {
        await saveFunction(content)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch (error) {
        setSaveStatus('error')
      }
    },
    debounceMs
  )

  useEffect(() => {
    if (!editor) return

    const handleUpdate = () => {
      const content = editor.getHTML()
      debouncedSave(content)
    }

    if (autoSave) {
      editor.on('update', handleUpdate)
    }

    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor, debouncedSave, autoSave])

  return {
    saveStatus,
    save: () => {
      const content = editor.getHTML()
      debouncedSave(content)
    },
    forceSave: () => {
      const _content = editor.getHTML()
      debouncedSave.flush()
    },
  }
}
