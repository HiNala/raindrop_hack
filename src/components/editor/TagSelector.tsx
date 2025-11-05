'use client'

import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Tag {
  id: string
  name: string
  slug: string
}

interface TagSelectorProps {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  availableTags: Tag[]
}

export function TagSelector({ selectedTags, onTagsChange, availableTags }: TagSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filteredTags, setFilteredTags] = useState<Tag[]>(availableTags)

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = availableTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selectedTags.some((st) => st.id === tag.id)
      )
      setFilteredTags(filtered)
    } else {
      setFilteredTags(availableTags.filter((tag) => !selectedTags.some((st) => st.id === tag.id)))
    }
  }, [searchQuery, availableTags, selectedTags])

  const handleAddTag = (tag: Tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag])
    }
    setSearchQuery('')
  }

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId))
  }

  const handleCreateNewTag = () => {
    const name = searchQuery.trim()
    if (!name) return

    // Create a temporary tag (will be created on server when post is saved)
    const newTag: Tag = {
      id: `new_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    }

    handleAddTag(newTag)
    setSearchQuery('')
  }

  return (
    <div className="space-y-3">
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-[#1a1a1d] border border-[#27272a] rounded-xl">
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              className="gap-1.5 pr-1 pl-3 py-1 bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500/20 transition-colors"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="ml-1 hover:bg-teal-500/30 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))
        ) : (
          <span className="text-text-secondary text-sm">No tags selected</span>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 transition-colors h-7"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a1d] border-[#27272a] sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-text-primary flex items-center gap-2 text-xl">
                <Plus className="w-5 h-5 text-teal-400" />
                Add Tags
              </DialogTitle>
              <DialogDescription className="text-text-secondary">
                Type to search existing tags or press Enter to create a new one
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="relative">
                <Input
                  placeholder="Search or create tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (filteredTags.length > 0) {
                        handleAddTag(filteredTags[0])
                      } else if (searchQuery.trim()) {
                        handleCreateNewTag()
                      }
                    }
                  }}
                  className="bg-[#0a0a0b] border-[#27272a] focus:border-teal-500 text-text-primary pr-20"
                />
                {searchQuery.trim() && filteredTags.length === 0 && (
                  <Button
                    type="button"
                    onClick={handleCreateNewTag}
                    size="sm"
                    className="absolute right-1 top-1 bg-teal-500 hover:bg-teal-600 text-white h-8"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Create
                  </Button>
                )}
              </div>

              {searchQuery.trim() && filteredTags.length === 0 && (
                <div className="flex items-center gap-2 p-3 bg-teal-500/5 border border-teal-500/20 rounded-lg">
                  <Plus className="w-4 h-4 text-teal-400" />
                  <p className="text-sm text-text-primary">
                    Press{' '}
                    <kbd className="px-1.5 py-0.5 bg-[#27272a] rounded text-xs font-mono">
                      Enter
                    </kbd>{' '}
                    or click Create to add "
                    <span className="text-teal-400 font-medium">{searchQuery}</span>"
                  </p>
                </div>
              )}

              {filteredTags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary font-medium">
                    Available tags ({filteredTags.length}):
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto">
                    {filteredTags.slice(0, 20).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="cursor-pointer bg-[#0a0a0b] border-[#27272a] text-text-primary hover:bg-teal-500/10 hover:border-teal-500/50 hover:text-teal-400 transition-all justify-center py-2"
                        onClick={() => {
                          handleAddTag(tag)
                          setDialogOpen(false)
                        }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
