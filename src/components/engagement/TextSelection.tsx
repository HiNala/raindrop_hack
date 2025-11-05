'use client'

import { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Quote, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InlineToolbarProps {
  selection: {
    text: string
    range: Range
    rect: DOMRect
  }
  onAction: (action: string) => void
  onClose: () => void
}

export function InlineToolbar({ selection, onAction, onClose }: InlineToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null)

  // Position toolbar above selection
  const position = {
    top: selection.rect.top - 50, // 50px above selection
    left: selection.rect.left + selection.rect.width / 2 - 100, // Center horizontally
  }

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const actions = [
    { icon: Bold, label: 'Bold', action: 'bold' },
    { icon: Italic, label: 'Italic', action: 'italic' },
    { icon: Quote, label: 'Quote', action: 'quote' },
    { icon: MessageSquare, label: 'Comment', action: 'comment' },
  ]

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex items-center gap-1"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {actions.map(({ icon: Icon, label, action }) => (
        <Button
          key={action}
          variant="ghost"
          size="sm"
          onClick={() => onAction(action)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          title={label}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  )
}

interface TextSelectionProps {
  content: string
  onTextAction: (action: string, text: string, range: Range) => void
  onComment: (text: string, rect: DOMRect) => void
}

export function TextSelection({ content, onTextAction, onComment }: TextSelectionProps) {
  const [selection, setSelection] = useState<{
    text: string
    range: Range
    rect: DOMRect
  } | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed || !contentRef.current) {
        setSelection(null)
        return
      }

      const range = sel.getRangeAt(0)
      const text = sel.toString()

      // Only show toolbar for selections within our content
      if (!contentRef.current.contains(range.commonAncestorContainer)) {
        setSelection(null)
        return
      }

      // Only show for selections longer than 2 characters
      if (text.length < 3) {
        setSelection(null)
        return
      }

      const rect = range.getBoundingClientRect()

      setSelection({
        text,
        range,
        rect,
      })
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    document.addEventListener('mouseup', handleSelectionChange)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      document.removeEventListener('mouseup', handleSelectionChange)
    }
  }, [])

  const handleAction = (action: string) => {
    if (!selection) return

    if (action === 'comment') {
      onComment(selection.text, selection.rect)
    } else {
      onTextAction(action, selection.text, selection.range)
    }

    // Clear selection after action
    window.getSelection()?.removeAllRanges()
    setSelection(null)
  }

  return (
    <>
      <div
        ref={contentRef}
        className="prose prose-gray dark:prose-invert max-w-none select-text"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {selection && (
        <InlineToolbar
          selection={selection}
          onAction={handleAction}
          onClose={() => setSelection(null)}
        />
      )}
    </>
  )
}
