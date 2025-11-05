'use client'

import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <SignUp 
          routing="path" 
          path="/sign-up"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-2xl",
            }
          }}
        />
      </div>
    </main>
  )
}


