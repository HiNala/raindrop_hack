/**
 * Onboarding Checklist Component
 * Helps new users complete essential tasks
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  action?: { label: string; href: string }
  icon?: React.ReactNode
}

interface OnboardingChecklistProps {
  userId?: string
  className?: string
}

export function OnboardingChecklist({ userId, className }: OnboardingChecklistProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'profile',
      title: 'Complete your profile',
      description: 'Add your bio and profile picture',
      completed: false,
      action: { label: 'Update Profile', href: '/settings/profile' },
      icon: '👤'
    },
    {
      id: 'first-post',
      title: 'Write your first post',
      description: 'Create and publish your first article',
      completed: false,
      action: { label: 'Create Post', href: '/editor/new' },
      icon: '📝'
    },
    {
      id: 'follow-tags',
      title: 'Follow some tags',
      description: 'Get personalized content recommendations',
      completed: false,
      action: { label: 'Explore Tags', href: '/discover' },
      icon: '🏷️'
    },
    {
      id: 'customize-profile',
      title: 'Customize your profile',
      description: 'Add social links and personalize your page',
      completed: false,
      action: { label: 'Customize', href: '/settings' },
      icon: '⚙️'
    }
  ])

  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState(true)

  // Simulate checking completion status
  useEffect(() => {
    const checkProgress = async () => {
      setLoading(true)

      // In a real app, you'd fetch this from your API
      await new Promise(resolve => setTimeout(resolve, 1000))

      setTasks(prev => prev.map(task => ({
        ...task,
        completed: Math.random() > 0.7 // Simulate some completed tasks
      })))

      setLoading(false)
    }

    if (userId) {
      checkProgress()
    }
  }, [userId])

  const progress = tasks.filter(t => t.completed).length / tasks.length * 100

  if (!userId || dismissed || progress === 100) return null

  if (loading) {
    return (
      <div className="mb-8">
        <div className="h-32 rounded-2xl border border-dark-border bg-dark-card animate-pulse" />
      </div>
    )
  }

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`mb-8 ${className}`}
      >
        <div className="overflow-hidden rounded-2xl border border-teal-400/30 bg-gradient-to-br from-teal-400/5 to-orange-400/5">
          <div className="p-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Get Started</h3>
                <p className="text-sm text-text-muted">
                  Complete these tasks to get the most out of your account
                </p>
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-text-muted">Progress</span>
                <span className="text-teal-400 font-medium">
                  {completedCount}/{tasks.length} completed
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-dark-border">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-teal-400 to-orange-400"
                />
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 rounded-lg bg-dark-card/50 p-3 ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => handleTaskComplete(task.id)}
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      task.completed
                        ? 'border-teal-400 bg-teal-400'
                        : 'border-dark-border hover:border-teal-400/50'
                    }`}
                    disabled={task.completed}
                  >
                    {task.completed && <Check className="h-3 w-3 text-white" />}
                  </button>

                  {/* Icon */}
                  <div className="text-lg">{task.icon}</div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      task.completed ? 'line-through text-text-muted' : ''
                    }`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-text-muted">{task.description}</p>
                  </div>

                  {/* Action */}
                  {!task.completed && task.action && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={task.action.href}>
                        {task.action.label}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Celebration Message */}
            {completedCount === tasks.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-lg bg-teal-400/10 p-3 text-center"
              >
                <p className="text-sm text-teal-400 font-medium">
                  🎉 Congratulations! You've completed all onboarding tasks.
                </p>
                <p className="text-xs text-text-muted mt-1">
                  You're all set to make the most of our platform!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )

  async function handleTaskComplete(taskId: string) {
    // Mark task as completed locally
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    ))

    // In a real app, you'd send this to your API
    try {
      // await fetch('/api/user/onboarding/complete', {
      //   method: 'POST',
      //   body: JSON.stringify({ taskId })
      // })
    } catch (error) {
      console.error('Failed to update task completion:', error)
    }
  }
}

/**
 * Quick Onboarding Bar
 * Simplified version for dashboard
 */

export function QuickOnboardingBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4 rounded-lg border border-teal-400/30 bg-teal-400/5 p-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-teal-400">
            ✨ Ready to start creating?
          </p>
          <p className="text-xs text-text-muted">
            Complete your profile and publish your first post
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <a href="/settings/profile">Profile</a>
          </Button>
          <Button size="sm" asChild>
            <a href="/editor/new">Write</a>
          </Button>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-text-muted hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}
