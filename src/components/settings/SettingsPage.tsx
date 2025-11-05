'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Download, 
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Mail,
  MessageSquare,
  Heart,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const settingsSections = [
  { id: 'account', name: 'Account', icon: User },
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'export', name: 'Export Data', icon: Download }
]

export function SettingsPage() {
  const { user } = useUser()
  const [activeSection, setActiveSection] = useState('account')
  const [showPassword, setShowPassword] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const [formData, setFormData] = useState({
    displayName: user?.fullName || '',
    username: user?.username || '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    bio: '',
    website: '',
    location: '',
    timezone: 'UTC',
    // Notification preferences
    emailNotifications: true,
    commentEmails: true,
    likeEmails: false,
    followerEmails: true,
    weeklyDigest: true,
    inAppNotifications: true,
    desktopNotifications: false
  })

  const handleSave = async () => {
    setSaveStatus('saving')
    // TODO: Save to database
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 1000)
  }

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="Your display name"
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="username"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              value={formData.timezone}
              onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Password</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        
        {/* Avatar Upload */}
        <div className="flex items-center gap-6 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xl">
              {formData.displayName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm">
              Upload Photo
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={4}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formData.bio.length}/160 characters
            </p>
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, Country"
            />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <Separator />
      <div>
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white">
                {formData.displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {formData.displayName || 'Your Name'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                @{formData.username || 'username'}
              </p>
              {formData.bio && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {formData.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                {formData.website && (
                  <span>🌐 {formData.website}</span>
                )}
                {formData.location && (
                  <span>📍 {formData.location}</span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Comment notifications</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get emailed when someone comments on your posts
              </p>
            </div>
            <Switch
              checked={formData.commentEmails}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, commentEmails: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Like notifications</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get emailed when someone likes your posts
              </p>
            </div>
            <Switch
              checked={formData.likeEmails}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, likeEmails: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">New followers</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get emailed when someone follows you
              </p>
            </div>
            <Switch
              checked={formData.followerEmails}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, followerEmails: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Weekly digest</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get a weekly summary of popular posts
              </p>
            </div>
            <Switch
              checked={formData.weeklyDigest}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, weeklyDigest: checked }))}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">In-App Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Show notifications</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Display notifications in the app
              </p>
            </div>
            <Switch
              checked={formData.inAppNotifications}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inAppNotifications: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Desktop notifications</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Show desktop notifications when browser is open
              </p>
            </div>
            <Switch
              checked={formData.desktopNotifications}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, desktopNotifications: checked }))}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Test Notifications</h3>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Send Test Email
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Send Test Notification
          </Button>
        </div>
      </div>
    </div>
  )

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
        <div className="space-y-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Chrome on Windows</p>
                  <p className="text-sm text-gray-500">Current session • IP: 192.168.1.1</p>
                </div>
              </div>
              <Badge variant="secondary">Current</Badge>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Safari on iPhone</p>
                  <p className="text-sm text-gray-500">Last active 2 hours ago • IP: 192.168.1.2</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Revoke</Button>
            </div>
          </Card>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">2FA Status</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <Badge variant="secondary">Disabled</Badge>
          </div>
          <Button>Enable 2FA</Button>
        </Card>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Login History</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span>Chrome on Windows</span>
            <span className="text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Safari on iPhone</span>
            <span className="text-gray-500">2 hours ago</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Chrome on Mac</span>
            <span className="text-gray-500">Yesterday</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBillingSection = () => (
    <div className="space-y-6">
      <Card className="p-6 text-center">
        <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">Free Plan</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You're currently on our free plan. Upgrade to unlock premium features.
        </p>
        <Button className="bg-gradient-to-r from-primary-600 to-primary-700">
          Upgrade to Pro
        </Button>
      </Card>
    </div>
  )

  const renderExportSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Export Your Data</h3>
        <Card className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Download all your posts, comments, and profile information in JSON format.
          </p>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export All Posts
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Comments
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Profile Data
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            You can request one export per day. Large exports may take a few minutes to prepare.
          </p>
        </Card>
      </div>
    </div>
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'account': return renderAccountSection()
      case 'profile': return renderProfileSection()
      case 'notifications': return renderNotificationsSection()
      case 'security': return renderSecuritySection()
      case 'billing': return renderBillingSection()
      case 'export': return renderExportSection()
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-1">
                {settingsSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        activeSection === section.id
                          ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {section.name}
                    </button>
                  )
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {renderSectionContent()}
              
              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Changes are saved automatically
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center gap-2"
                  >
                    {saveStatus === 'saving' && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {saveStatus === 'saved' && (
                      <div className="w-4 h-4 bg-green-500 rounded-full" />
                    )}
                    {saveStatus === 'idle' && <Save className="w-4 h-4" />}
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}