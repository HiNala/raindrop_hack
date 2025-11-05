'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createFormSubmit } from '@/lib/enhanced-forms'
import { z } from 'zod'

interface EnhancedFormProps<T> {
  schema: z.ZodType<T>
  initialData?: Partial<T>
  onSubmit: (data: T) => Promise<any>
  submitText?: string
  resetOnSubmit?: boolean
  optimisticUpdate?: (data: T) => void
  className?: string
  children?: (props: FormRenderProps<T>) => React.ReactNode
}

interface FormRenderProps<T> {
  register: any
  errors: any
  isSubmitting: boolean
  isValid: boolean
  field: (name: keyof T, props?: Record<string, unknown>) => any
  submit: () => void
  reset: () => void
  watch: (name: keyof T) => any
  setValue: (name: keyof T, value: unknown) => void
}

export function EnhancedForm<T extends Record<string, any>>({
  schema,
  initialData,
  onSubmit,
  submitText = 'Save',
  resetOnSubmit = false,
  optimisticUpdate,
  className,
  children,
}: EnhancedFormProps<T>) {
  const [isPending, startTransition] = useTransition()
  const [isOptimistic, setIsOptimistic] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
    reset,
    watch,
    setValue,
    trigger,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: initialData as T,
    mode: 'onChange',
  })

  const submitForm = createFormSubmit(
    schema,
    onSubmit,
    {
      onSuccess: (data) => {
        toast.success('Changes saved successfully')
        setIsOptimistic(false)
        if (resetOnSubmit) {
          reset(data)
        }
      },
      onError: (error) => {
        toast.error(error)
        setIsOptimistic(false)
      },
      optimisticUpdate: (data) => {
        if (optimisticUpdate) {
          optimisticUpdate(data)
          setIsOptimistic(true)
        }
      },
      resetForm: resetOnSubmit,
    }
  )

  const onFormSubmit = (data: T) => {
    startTransition(async () => {
      await submitForm(data)
    })
  }

  // Field helper with error handling
  const field = (name: keyof T, props: Record<string, unknown> = {}) => {
    const hasError = errors[name]
    const isTouched = !!props.value || watch(name) !== undefined

    return {
      ...register(name as string, {
        ...props,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          props.onChange?.(e)
          register(name as string).onChange(e)
          // Trigger validation on blur
          if (e.type === 'blur') {
            trigger(name as string)
          }
        },
      }),
      error: hasError?.message,
      hasError: !!hasError,
      isTouched,
    }
  }

  const renderProps: FormRenderProps<T> = {
    register,
    errors,
    isSubmitting: isSubmitting || isPending,
    isValid,
    field: field as any,
    submit: handleSubmit(onFormSubmit),
    reset,
    watch: (name) => watch(name as string),
    setValue: (name, value) => setValue(name as string, value),
  }

  if (children) {
    return <form onSubmit={handleSubmit(onFormSubmit)} className={cn('space-y-6', className)}>
      {children(renderProps)}
    </form>
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={cn('space-y-6', className)}>
      {/* Auto-generated form fields for basic schemas */}
      {Object.keys(schema.shape).map((key) => {
        const fieldSchema = schema.shape[key]
        const fieldName = key as keyof T
        const fieldProps = field(fieldName)

        if (fieldSchema instanceof z.ZodString) {
          if (fieldSchema._def.maxLength && fieldSchema._def.maxLength.value > 100) {
            // Textarea for long text fields
            return (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-sm font-medium">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>
                <Textarea
                  id={key}
                  placeholder={`Enter ${key}`}
                  {...fieldProps}
                  className={cn(
                    fieldProps.hasError && 'border-red-500 focus:border-red-500',
                    'resize-none'
                  )}
                />
                {fieldProps.error && (
                  <p className="text-sm text-red-500">{fieldProps.error}</p>
                )}
              </div>
            )
          } else {
            // Input for regular text fields
            return (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-sm font-medium">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>
                <Input
                  id={key}
                  type={key.includes('password') ? 'password' : key.includes('email') ? 'email' : 'text'}
                  placeholder={`Enter ${key}`}
                  {...fieldProps}
                  className={cn(fieldProps.hasError && 'border-red-500 focus:border-red-500')}
                />
                {fieldProps.error && (
                  <p className="text-sm text-red-500">{fieldProps.error}</p>
                )}
              </div>
            )
          }
        }

        return null
      })}

      {/* Submit Button */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          disabled={!isValid || !isDirty || renderProps.isSubmitting}
          className={cn(
            'relative',
            isOptimistic && 'bg-orange-500 hover:bg-orange-600'
          )}
        >
          {renderProps.isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : isOptimistic ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {submitText}
            </>
          )}
        </Button>

        {isDirty && (
          <Button
            type="button"
            variant="outline"
            onClick={reset}
            disabled={renderProps.isSubmitting}
          >
            <X className="w-4 h-4 mr-2" />
            Reset
          </Button>
        )}

        {isOptimistic && (
          <div className="flex items-center text-sm text-orange-500">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse" />
            Optimistic update
          </div>
        )}
      </div>
    </form>
  )
}

// Enhanced field components
interface EnhancedFieldProps {
  label: string
  error?: string
  required?: boolean
  helper?: string
  className?: string
  children: React.ReactNode
}

export function EnhancedField({
  label,
  error,
  required,
  helper,
  className,
  children,
}: EnhancedFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className={cn('text-sm font-medium', required && 'after:content-["*"] after:ml-1 after:text-red-500')}>
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  )
}

// Optimistic UI status indicator
export function OptimisticStatus({ isOptimistic }: { isOptimistic: boolean }) {
  if (!isOptimistic) return null

  return (
    <div className="flex items-center gap-2 text-sm text-orange-500 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg">
      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
      <span>Saving changes...</span>
    </div>
  )
}
