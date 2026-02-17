import { useState, useEffect } from 'react'
import { supabase, signInWithEmail, signUpWithEmail, signInWithOAuth, signOut } from '../lib/supabase'

export function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { error } = await signUpWithEmail(email, password)
    
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for confirmation!')
    }
    
    setLoading(false)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { error } = await signInWithEmail(email, password)
    
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Signed in successfully!')
    }
    
    setLoading(false)
  }

  const handleOAuthSignIn = async (provider: 'twitter' | 'github' | 'google' | 'discord') => {
    await signInWithOAuth(provider)
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
  }

  if (user) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Welcome!</h2>
        <p className="text-gray-600 mb-4">Signed in as: {user.email}</p>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-sm">
          {message}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSignIn}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Sign Up
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOAuthSignIn('twitter')}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Twitter
          </button>
          <button
            onClick={() => handleOAuthSignIn('github')}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            GitHub
          </button>
          <button
            onClick={() => handleOAuthSignIn('google')}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Google
          </button>
          <button
            onClick={() => handleOAuthSignIn('discord')}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Discord
          </button>
        </div>
      </div>
    </div>
  )
}
