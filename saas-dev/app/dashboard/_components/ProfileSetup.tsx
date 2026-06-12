'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createProfile, updateProfile, checkUsernameAvailability } from '@/lib/actions/links.actions'
import type { LinkProfile, ProfileFormData } from '@/lib/types/links'

interface ProfileSetupProps {
  profile?: LinkProfile           
  onProfileCreated?: (profile: LinkProfile) => void
}

export default function ProfileSetup({ profile, onProfileCreated }: ProfileSetupProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    username: profile?.username || '',           
    display_name: profile?.display_name || '',  
    bio: profile?.bio || '',                     
    avatar_url: profile?.avatar_url || '',       
    theme: profile?.theme || 'dark',             
    is_public: profile?.is_public ?? true, 
  })
  const [pending, start] = useTransition()
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(profile ? true : null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const router = useRouter()
  const checkUsername = async (username: string) => {
    if (username.length < 3 || !/^[a-zA-Z0-9_-]+$/.test(username)) {
      setUsernameAvailable(false)
      return
    }

    if (profile?.username === username) {
      setUsernameAvailable(true)
      return
    }

    setCheckingUsername(true)
    try {
      const available = await checkUsernameAvailability(username)
      setUsernameAvailable(available) 
    } catch (error) {
      console.error('Error checking username:', error)
      setUsernameAvailable(false) 
    } finally {
      setCheckingUsername(false)
    }
  }

  const handleUsernameChange = (username: string) => {
    setFormData(prev => ({ ...prev, username }))
    setUsernameAvailable(null)

    if (username.trim()) {
      const timeoutId = setTimeout(() => checkUsername(username.trim()), 500)
      return () => clearTimeout(timeoutId)
    }
  }

  const onSubmit = () => start(async () => {
    try {
      if (!formData.username.trim()) {
        alert('Username is required')
        return
      }

      if (usernameAvailable === false) {
        alert('Username is not available')
        return
      }

      const savedProfile = profile
        ? await updateProfile(formData)
        : await createProfile(formData)

      onProfileCreated?.(savedProfile)

      router.refresh()
    } catch (error: unknown) {
      console.error('Failed to save profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      if (errorMessage.includes('username')) {
        alert('Username is already taken. Please choose a different one.')
      } else {
        alert('Failed to save profile. Please try again.')
      }
    }
  })

  const isValidForm = formData.username.trim() && usernameAvailable === true

  return (
    <div className="glass-card p-8 rounded-xl">
      <h2 className="text-2xl font-bold text-lime-300 mb-6">
        {profile ? 'Update Profile' : 'Setup Your Profile'}
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-white font-medium mb-2">
            Username <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-white/40">/</span>
            </div>
            <input
              className="
                          w-full pl-8 pr-4 py-3 glass-input text-white placeholder:text-white/40 focus:outline-none 
                          focus:ring-2 focus:ring-lime-400/50 transition-all duration-300
                        "
              placeholder="your-username"
              value={formData.username}
              onChange={e => handleUsernameChange(e.target.value)}
              pattern="^[a-zA-Z0-9_-]+$"
              maxLength={30}
            />
            {checkingUsername && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-lime-400"></div>
              </div>
            )}
          </div>
          {formData.username && usernameAvailable !== null && !checkingUsername && (
            <p className={`text-sm mt-1 ${usernameAvailable ? 'text-lime-400' : 'text-red-400'}`}>
              {usernameAvailable ? '✓ Username available' : '✗ Username not available'}
            </p>
          )}
          <p className="text-white/40 text-sm mt-1">
            3-30 characters, letters, numbers, underscores, and hyphens only
          </p>
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Display Name</label>
          <input
            className="w-full px-4 py-3 glass-input text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-lime-400/50 transition-all duration-300"
            placeholder="Your Display Name"
            value={formData.display_name}
            onChange={e => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
            maxLength={50}
          />
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Bio</label>
          <textarea
            className="
                        w-full px-4 py-3 glass-input text-white placeholder:text-white/40 focus:outline-none focus:ring-2
                        focus:ring-lime-400/50 transition-all duration-300 resize-none h-20
                      "
            placeholder="Tell people about yourself..."
            value={formData.bio}
            onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            maxLength={160}
          />
          <p className="text-white/40 text-sm mt-1">{formData.bio?.length || 0}/160 characters</p>
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Avatar URL</label>
          <input
            className="
                      w-full px-4 py-3 glass-input text-white placeholder:text-white/40 focus:outline-none focus:ring-2
                     focus:ring-lime-400/50 transition-all duration-300
                     "
            placeholder="https://example.com/your-avatar.jpg"
            value={formData.avatar_url}
            onChange={e => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
            type="url"
          />
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Theme</label>
          <select
            className="
                        w-full px-4 py-3 glass-input text-white focus:outline-none focus:ring-2
                      focus:ring-lime-400/50 transition-all duration-300 bg-transparent
                      "
            value={formData.theme}
            onChange={e => setFormData(prev => ({ ...prev, theme: e.target.value as 'dark' | 'light' | 'gradient' }))}
          >
            <option value="dark" className="bg-gray-900">Dark</option>
            <option value="light" className="bg-gray-900">Light</option>
            <option value="gradient" className="bg-gray-900">Gradient</option>
          </select>
        </div>
        <div className="flex items-center justify-between p-4 glass-card rounded-lg">
          <div>
            <label className="text-white font-medium">Public Profile</label>
            <p className="text-white/60 text-sm">Make your profile visible to everyone</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_public}
              onChange={e => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
            />
          </label>
        </div>

        <button
          onClick={onSubmit}
          disabled={pending || !isValidForm}
          className="
                      w-full px-6 py-4 glass-button-primary rounded-xl text-white font-medium 
                      disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 glow-hover
                    "
        >
          {pending
            ? (profile ? 'Updating...' : 'Creating...')
            : (profile ? 'Update Profile' : 'Create Profile')
          }
        </button>
        
      </div>
    </div>
  )
}