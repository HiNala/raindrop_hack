'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import {
  X,
  ChevronRight,
  User,
  Image,
  Heart,
  Sparkles,
  Code,
  Palette,
  Globe,
  Database,
  Brain,
  Camera,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: any
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'profile',
    title: 'Complete your profile',
    description: 'Set up your display name and username',
    icon: User,
  },
  {
    id: 'avatar',
    title: 'Add your photo',
    description: 'Upload an avatar and write a quick bio',
    icon: Image,
  },
  {
    id: 'interests',
    title: 'Choose your interests',
    description: 'Personalize your feed with topics you care about',
    icon: Heart,
  },
]

const interests = [
  { id: 'webdev', name: 'Web Development', icon: Code, color: 'bg-blue-500' },
  { id: 'ai', name: 'Artificial Intelligence', icon: Brain, color: 'bg-purple-500' },
  { id: 'design', name: 'Design', icon: Palette, color: 'bg-pink-500' },
  { id: 'mobile', name: 'Mobile Development', icon: Globe, color: 'bg-green-500' },
  { id: 'backend', name: 'Backend Systems', icon: Database, color: 'bg-orange-500' },
  { id: 'photography', name: 'Photography', icon: Camera, color: 'bg-cyan-500' },
]

interface OnboardingFlowProps {
  onComplete: () => void
  onSkip: () => void
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const { user } = useUser()
  const [currentStep, setCurrentStep] = useState(0)
  const [displayName, setDisplayName] = useState(user?.fullName || '')
  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(user?.imageUrl || '')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  const currentStepData = onboardingSteps[currentStep]

  const handleNext = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      setShowConfetti(true)
      await saveOnboardingData()
      setTimeout(() => {
        onComplete()
      }, 2000)
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  const saveOnboardingData = async () => {
    // TODO: Save to database
    console.log('Saving onboarding data:', {
      displayName,
      username,
      bio,
      avatarUrl,
      interests: selectedInterests,
    })
  }

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId]
    )
  }

  const renderStepContent = () => {
    const Icon = currentStepData.icon

    switch (currentStep) {
      case 0: // Profile
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How should we call you?"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="unique-username"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This will be your unique URL: blog.app/{username}
                </p>
              </div>
            </div>
          </div>
        )

      case 1: // Avatar & Bio
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xl">
                    {displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself in one sentence..."
                  className="w-full resize-none"
                  rows={3}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {bio.length}/140 characters
                </p>
              </div>

              {/* Live Preview */}
              <Card className="p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white">
                      {displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {displayName || 'Your Name'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      @{username || 'username'}
                    </p>
                  </div>
                </div>
                {bio && (
                  <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {bio}
                  </p>
                )}
              </Card>
            </div>
          </div>
        )

      case 2: // Interests
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
            </div>

            <div>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Select topics that interest you to personalize your feed
              </p>

              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest) => {
                  const InterestIcon = interest.icon
                  const isSelected = selectedInterests.includes(interest.id)

                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center',
                            interest.color
                          )}
                        >
                          <InterestIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {interest.name}
                        </span>
                      </div>
                      {isSelected && (
                        <Badge variant="secondary" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-60">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <Card className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-800">
          <Button variant="ghost" size="sm" onClick={handleSkip} className="absolute right-4 top-4">
            <X className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              {currentStepData.icon && <currentStepData.icon className="w-6 h-6 text-white" />}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentStepData.description}
            </p>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 py-4">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                index === currentStep
                  ? 'w-8 bg-primary-500'
                  : index < currentStep
                    ? 'bg-primary-300'
                    : 'bg-gray-300 dark:bg-gray-700'
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6">{renderStepContent()}</div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSkip} className="flex-1">
              Skip for now
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              disabled={currentStep === 0 && (!displayName || !username)}
            >
              {currentStep === onboardingSteps.length - 1 ? 'Complete' : 'Continue'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
