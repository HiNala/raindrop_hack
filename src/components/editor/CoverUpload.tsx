'use client'

import { useState } from 'react'
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUploadThing } from '@/lib/uploadthing'
import toast from 'react-hot-toast'

interface CoverUploadProps {
  currentImage?: string | null
  onUpload: (url: string) => void
  onRemove: () => void
}

export function CoverUpload({ currentImage, onUpload, onRemove }: CoverUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { startUpload } = useUploadThing('coverImageUploader')

  const validateAndUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (8MB max)
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image must be less than 8MB')
      return
    }

    setIsUploading(true)

    try {
      const res = await startUpload([file])

      if (res && res[0]?.url) {
        onUpload(res[0].url)
        toast.success('Cover image uploaded!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await validateAndUpload(file)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return
    await validateAndUpload(file)
  }

  return (
    <div className="w-full">
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Cover"
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isUploading}
                asChild
              >
                <span>
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Change
                    </>
                  )}
                </span>
              </Button>
            </label>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onRemove}
              disabled={isUploading}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <label
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-teal-500 bg-teal-500/5 shadow-glow-teal'
              : 'border-[#27272a] bg-[#1a1a1d] hover:border-teal-500/50 hover:bg-[#1a1a1d]/80'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
            {isUploading ? (
              <>
                <Loader2 className="w-12 h-12 mb-4 text-teal-400 animate-spin" />
                <p className="mb-2 text-sm text-text-primary font-medium">
                  Uploading cover image...
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mb-4 rounded-full bg-teal-500/10 flex items-center justify-center">
                  {isDragging ? (
                    <ImageIcon className="w-8 h-8 text-teal-400" />
                  ) : (
                    <Upload className="w-8 h-8 text-teal-400" />
                  )}
                </div>
                <p className="mb-2 text-sm text-text-primary font-medium">
                  {isDragging ? (
                    'Drop your image here'
                  ) : (
                    <>
                      <span className="text-teal-400">Click to upload</span> or drag and drop
                    </>
                  )}
                </p>
                <p className="text-xs text-text-secondary">
                  PNG, JPG, WEBP or GIF • Max 8MB
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  Recommended: 1200×630px for optimal display
                </p>
              </>
            )}
          </div>
        </label>
      )}
    </div>
  )
}


