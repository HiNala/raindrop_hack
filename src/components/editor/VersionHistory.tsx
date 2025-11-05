'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Clock,
  FileText,
  Eye,
  RotateCcw,
  Copy,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PostVersion {
  id: string
  postId: string
  snapshot: {
    content: any
    html: string
    wordCount: number
    readTime: number
  }
  summary?: string
  createdAt: string
}

interface VersionHistoryProps {
  postId: string
  versions: PostVersion[]
  onRestoreVersion: (version: PostVersion) => void
  onDeleteVersion: (versionId: string) => void
  currentContent?: string
}

export function VersionHistory({
  postId,
  versions,
  onRestoreVersion,
  onDeleteVersion,
  currentContent,
}: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<PostVersion | null>(null)
  const [diffView, setDiffView] = useState(false)
  const [copiedContent, setCopiedContent] = useState(false)

  // Sort versions by date (newest first)
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  useEffect(() => {
    // Auto-select first version if none selected
    if (!selectedVersion && sortedVersions.length > 0) {
      setSelectedVersion(sortedVersions[0])
    }
  }, [sortedVersions, selectedVersion])

  const handleCopyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedContent(true)
      toast.success('Content copied to clipboard')
      setTimeout(() => setCopiedContent(false), 2000)
    } catch (error) {
      toast.error('Failed to copy content')
    }
  }

  const handleRestore = (version: PostVersion) => {
    onRestoreVersion(version)
    toast.success('Version restored successfully')
  }

  const handleDelete = async (version: PostVersion) => {
    if (window.confirm('Are you sure you want to delete this version?')) {
      onDeleteVersion(version.id)
      if (selectedVersion?.id === version.id) {
        setSelectedVersion(null)
      }
      toast.success('Version deleted')
    }
  }

  const generateDiff = (oldContent: string, newContent: string) => {
    // Simple diff implementation (in production, use a proper diff library)
    const oldLines = oldContent.split('\n')
    const newLines = newContent.split('\n')

    const diff: Array<{
      type: 'equal' | 'added' | 'removed'
      content: string
    }> = []

    let i = 0, j = 0

    while (i < oldLines.length || j < newLines.length) {
      if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
        diff.push({ type: 'equal', content: oldLines[i] })
        i++
        j++
      } else if (j < newLines.length && (i >= oldLines.length || oldLines[i] !== newLines[j])) {
        diff.push({ type: 'added', content: newLines[j] })
        j++
      } else {
        diff.push({ type: 'removed', content: oldLines[i] })
        i++
      }
    }

    return diff
  }

  const currentVersion: PostVersion = {
    id: 'current',
    postId,
    snapshot: {
      content: {},
      html: currentContent || '',
      wordCount: 0,
      readTime: 0,
    },
    createdAt: new Date().toISOString(),
  }

  const diffContent = diffView && selectedVersion && currentContent
    ? generateDiff(selectedVersion.snapshot.html, currentContent)
    : []

  return (
    <div className="flex h-full">
      {/* Version List */}
      <div className="w-80 border-r border-surface-300 flex flex-col">
        <div className="p-4 border-b border-surface-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-accent-teal" />
              <h3 className="font-semibold text-text-primary">Version History</h3>
            </div>
            <Badge variant="secondary">{sortedVersions.length} versions</Badge>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {/* Current Version */}
            <VersionCard
              version={currentVersion}
              isSelected={selectedVersion?.id === 'current'}
              isCurrent={true}
              onSelect={() => {
                setSelectedVersion(currentVersion)
                setDiffView(false)
              }}
            />

            {/* Version List */}
            {sortedVersions.map((version) => (
              <VersionCard
                key={version.id}
                version={version}
                isSelected={selectedVersion?.id === version.id}
                onSelect={() => {
                  setSelectedVersion(version)
                  setDiffView(false)
                }}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Version Content */}
      <div className="flex-1 flex flex-col">
        {selectedVersion ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-surface-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-text-secondary" />
                    <span className="font-medium text-text-primary">
                      {selectedVersion.id === 'current' ? 'Current Version' : formatDistanceToNow(new Date(selectedVersion.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  {selectedVersion.id !== 'current' && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <FileText className="w-4 h-4" />
                      <span>{selectedVersion.snapshot.wordCount} words</span>
                      <span>•</span>
                      <span>{selectedVersion.snapshot.readTime} min</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Toggle Diff View */}
                  {currentContent && selectedVersion.id !== 'current' && (
                    <Button
                      variant={diffView ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDiffView(!diffView)}
                    >
                      {diffView ? (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Show Content
                        </>
                      ) : (
                        <>
                          <GitBranch className="w-4 h-4 mr-2" />
                          Show Diff
                        </>
                      )}
                    </Button>
                  )}

                  {/* Copy Content */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyContent(selectedVersion.snapshot.html)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedContent ? 'Copied!' : 'Copy'}
                  </Button>

                  {/* Restore Version */}
                  {selectedVersion.id !== 'current' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleRestore(selectedVersion)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                  )}

                  {/* Delete Version */}
                  {selectedVersion.id !== 'current' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(selectedVersion)}
                      className="text-error hover:text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1">
              <div className="p-6">
                {diffView ? (
                  <div className="space-y-1 font-mono text-sm">
                    {diffContent.map((line, index) => (
                      <div
                        key={index}
                        className={cn(
                          'p-2 rounded',
                          line.type === 'added' && 'bg-green-500/10 text-green-400',
                          line.type === 'removed' && 'bg-red-500/10 text-red-400',
                          line.type === 'equal' && 'text-text-secondary',
                        )}
                      >
                        <span className="inline-block w-12 text-right mr-4 text-text-muted">
                          {line.type === 'added' && '+'}
                          {line.type === 'removed' && '-'}
                          {line.type === 'equal' && ' '}
                        </span>
                        {line.content || ' '}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: selectedVersion.snapshot.html || '<p>No content</p>',
                    }}
                  />
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <GitBranch className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">Select a version to view its content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function VersionCard({
  version,
  isSelected,
  isCurrent = false,
  onSelect,
}: {
  version: PostVersion | { id: string; createdAt: string }
  isSelected: boolean
  isCurrent?: boolean
  onSelect: () => void
}) {
  return (
    <Card
      className={cn(
        'p-3 cursor-pointer transition-all hover:bg-surface-100',
        isSelected && 'ring-2 ring-accent-teal bg-surface-100',
        isCurrent && 'border-accent-teal',
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isCurrent && (
              <Badge variant="default" className="text-xs">
                Current
              </Badge>
            )}
            <span className="text-sm font-medium text-text-primary">
              {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
            </span>
          </div>

          {!isCurrent && 'snapshot' in version && (
            <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
              <FileText className="w-3 h-3" />
              <span>{version.snapshot.wordCount} words</span>
              <span>•</span>
              <span>{version.snapshot.readTime} min</span>
            </div>
          )}
        </div>

        {isSelected && (
          <ChevronRight className="w-4 h-4 text-accent-teal" />
        )}
      </div>
    </Card>
  )
}
