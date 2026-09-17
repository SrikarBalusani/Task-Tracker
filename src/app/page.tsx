'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { verifyPin, logout } from '@/app/actions'
import { Lock, Eye } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const [showPin, setShowPin] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleViewMode = async () => {
    await logout()
    router.push('/dashboard')
  }

  const handleEditMode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    const res = await verifyPin(pin)
    if (res.success) {
      router.push('/dashboard')
    } else {
      setError('Incorrect PIN')
      setPin('')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">Progress Tracker</h1>
        <p className="text-gray-500 mb-8">Stay on top of your daily goals.</p>

        {!showPin ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowPin(true)}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-medium py-3.5 rounded-xl hover:bg-gray-800 transition-colors"
            >
              <Lock size={18} />
              I'm Srikar (Edit)
            </button>
            <button
              onClick={handleViewMode}
              className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 font-medium py-3.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Eye size={18} />
              View Only
            </button>
          </div>
        ) : (
          <form onSubmit={handleEditMode} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                className="w-full text-center text-2xl tracking-widest py-3 border-b-2 border-gray-200 focus:border-apple-blue focus:outline-none transition-colors"
                maxLength={4}
                disabled={isLoading}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowPin(false)}
                className="flex-1 py-3 bg-gray-50 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pin.length < 4 || isLoading}
                className="flex-1 py-3 bg-apple-blue text-white font-medium rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Unlock'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
