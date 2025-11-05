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
      const filtered = availableTags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedTags.some(st => st.id === tag.id)
      )
      setFilteredTags(filtered)
    } else {
      setFilteredTags(availableTags.filter(tag => 
        !selectedTags.some(st => st.id === tag.id)
      ))
    }
  }, [searchQuery, availableTags, selectedTags])

  const handleAddTag = (tag: Tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag])
    }
    setSearchQuery('')
  }

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(t => t.id !== tagId))
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
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Tags:</span>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="gap-1">
              <Plus className="w-3 h-3" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Tags</DialogTitle>
              <DialogDescription>
                Search for existing tags or create new ones
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex gap-2">
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
                />
                {searchQuery.trim() && filteredTags.length === 0 && (
                  <Button
                    type="button"
                    onClick={handleCreateNewTag}
                    size="sm"
                    className="shrink-0"
                  >
                    Create
                  </Button>
                )}
              </div>

              {filteredTags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Existing tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {filteredTags.slice(0, 10).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => handleAddTag(tag)}
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

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}


