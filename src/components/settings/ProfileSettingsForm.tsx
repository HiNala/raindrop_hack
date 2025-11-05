'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Upload } from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing'
import toast from 'react-hot-toast'

interface ProfileSettingsFormProps {
  profile: {
    username: string
    displayName: string
    bio: string | null
    avatarUrl: string | null
    websiteUrl: string | null
  }
}

export function ProfileSettingsForm({ profile }: ProfileSettingsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const [formData, setFormData] = useState({
    displayName: profile.displayName,
    bio: profile.bio || '',
    websiteUrl: profile.websiteUrl || '',
    avatarUrl: profile.avatarUrl || '',
  })

  const { startUpload } = useUploadThing('avatarUploader')

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB')
      return
    }

    setIsUploadingAvatar(true)

    try {
      const res = await startUpload([file])

      if (res && res[0]?.url) {
        setFormData({ ...formData, avatarUrl: res[0].url })
        toast.success('Avatar uploaded!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload avatar')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.displayName.trim()) {
      toast.error('Display name is required')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to update profile')
      }

      toast.success('Profile updated!')
      router.push(`/u/${profile.username}`)
      router.refresh()
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
          <CardDescription>
            This information will be displayed publicly on your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div>
            <Label>Avatar</Label>
            <div className="flex items-center gap-4 mt-2">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.avatarUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                  {formData.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploadingAvatar}
                  asChild
                >
                  <span>
                    {isUploadingAvatar ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Change Avatar
                      </>
                    )}
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Username (readonly) */}
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile.username}
              disabled
              className="bg-gray-100 dark:bg-gray-800"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Username cannot be changed
            </p>
          </div>

          {/* Display Name */}
          <div>
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={500}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Website */}
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isUploadingAvatar}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}


