'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { lowlight } from 'lowlight'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Quote,
  Heading2,
  Link as LinkIcon,
  ImageIcon,
  Undo,
  Redo,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCallback } from 'react'

interface TiptapEditorProps {
  content: object | string
  onChange: (content: object) => void
  placeholder?: string
}

export function TiptapEditor({ content, onChange, placeholder = 'Start writing...' }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline hover:text-blue-700',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-4 font-mono text-sm',
        },
      }),
    ],
    content: typeof content === 'string' ? content : content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-4 py-3',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return
    
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return

    const url = window.prompt('Image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return <div className="h-[500px] animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          <Italic className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          <Heading2 className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          <List className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          <Code className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          <Quote className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
        >
          <ImageIcon className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}


