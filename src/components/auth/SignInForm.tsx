'use client'

import { useState } from 'react'
import { TurbulentFlowBackground } from '@/components/ui/turbulent-flow'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <TurbulentFlowBackground>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Auth Form with Glass Effect */}
          <div className="content-glass rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 text-shadow-glow">
                Welcome Back
              </h2>
              <p className="text-white/70">
                Sign in to continue writing with AI
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:border-teal-400 focus:bg-white/15"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:border-teal-400 focus:bg-white/15"
                />
              </div>

              <Button
                type="submit"
                className="w-full btn-turbulent rounded-lg py-3 font-semibold"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/70">
                Don't have an account?{' '}
                <Link href="/sign-up" className="text-teal-400 hover:text-teal-300">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </TurbulentFlowBackground>
  )
}