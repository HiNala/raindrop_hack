'use client'

import { useState } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
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
  const { startUpload } = useUploadThing('coverImageUploader')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <>
                <Loader2 className="w-12 h-12 mb-4 text-gray-400 animate-spin" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Uploading cover image...
                </p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 mb-4 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, WEBP up to 8MB
                </p>
              </>
            )}
          </div>
        </label>
      )}
    </div>
  )
}


