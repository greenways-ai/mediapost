'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientBrowser } from '@/lib/supabase'
import { Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Logo } from '@/components/Logo'

const supabase = createClientBrowser()

export default function AdminSetupPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [makingAdmin, setMakingAdmin] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
    
    if (!user) {
      setResult({ type: 'error', message: 'You must be logged in first. Redirecting to login...' })
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  async function makeAdmin() {
    setMakingAdmin(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setResult({ type: 'success', message: data.message })
        setTimeout(() => router.push('/admin'), 2000)
      } else {
        setResult({ type: 'error', message: data.error || 'Failed to make admin' })
      }
    } catch (error) {
      setResult({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setMakingAdmin(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 px-6 h-16 flex items-center">
        <Logo />
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-2xl font-display font-bold text-text-primary">Admin Setup</h1>
              <p className="text-text-secondary mt-2">
                Make yourself an admin to access the admin dashboard
              </p>
            </div>

            {user && (
              <div className="mb-6 p-4 bg-surface-sunken rounded-lg">
                <p className="text-sm text-text-secondary">Logged in as:</p>
                <p className="font-medium text-text-primary">{user.email}</p>
              </div>
            )}

            {result && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                result.type === 'success' 
                  ? 'bg-accent/10 text-accent border border-accent/20' 
                  : 'bg-alert/10 text-alert border border-alert/20'
              }`}>
                {result.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <p className="text-sm">{result.message}</p>
              </div>
            )}

            <button
              onClick={makeAdmin}
              disabled={makingAdmin || !user}
              className="w-full btn-primary disabled:opacity-50"
            >
              {makingAdmin ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Make Me Admin
                </>
              )}
            </button>

            <div className="mt-4 text-center">
              <a href="/admin" className="text-sm text-accent hover:text-accent-light transition-colors">
                Go to Admin Dashboard →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
