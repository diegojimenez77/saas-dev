'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  createLink,
  updateLink,
  deleteLink,
  toggleLinkEnabled,
} from '@/lib/actions/links.actions'
import type { Link } from '@/lib/types/links'

interface LinkManagerUIProps {
  initialLinks: Link[] 
  username?: string           
}

export default function LinkManagerUI({ initialLinks, username }: LinkManagerUIProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [pending, start] = useTransition()
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const router = useRouter()

  const onCreate = () => start(async () => {
    if (!title.trim() || !url.trim()) {
      setShowValidationErrors(true)
      return
    }

    try {
      let finalUrl = url.trim()
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl
      }

      const newLink = await createLink({
        title: title.trim(),
        url: finalUrl,
        description: description.trim() || undefined
      })
      setLinks([...links, newLink])

      setTitle('')
      setUrl('')
      setDescription('')
      setShowValidationErrors(false)

      router.refresh()
    } catch (error) {
      console.error('Failed to create link:', error)
      alert('Failed to create link. Please try again.')
    }
  })

  const onUpdate = (id: string) => start(async () => {
    const newTitle = prompt('New title?')?.trim()
    const newUrl = prompt('New URL?')?.trim()

    if (!newTitle || !newUrl) return

    try {
      const updatedLink = await updateLink(id, {
        title: newTitle,
        url: newUrl
      })
      setLinks(links.map(link => link.id === id ? updatedLink : link))
      router.refresh()
    } catch (error) {
      console.error('Failed to update link:', error)
      alert('Failed to update link. Please try again.')
    }
  })

  const onDelete = (id: string) => start(async () => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      await deleteLink(id)
      setLinks(links.filter(link => link.id !== id))
      router.refresh()
    } catch (error) {
      console.error('Failed to delete link:', error)
      alert('Failed to delete link. Please try again.')
    }
  })

  const onToggleEnabled = (id: string) => start(async () => {
    try {
      const updatedLink = await toggleLinkEnabled(id)
      setLinks(links.map(link => link.id === id ? updatedLink : link))
      router.refresh()
    } catch (error) {
      console.error('Failed to toggle link:', error)
      alert('Failed to toggle link. Please try again.')
    }
  })

  const validateUrl = (url: string) => {
    if (!url.trim()) return false
    let urlToValidate = url.trim()
    if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
      urlToValidate = 'https://' + urlToValidate
    }

    try {
      new URL(urlToValidate)
      return true
    } catch {
      return false
    }
  }

  const isValidForm = title.trim() && url.trim() && validateUrl(url.trim())

  return (
    <div className="space-y-8">
      {username && (
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-lime-300 mb-1">Your Link</h3>
              <p className="text-white/60 text-sm">Share this link with your audience</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 glass-card rounded-lg text-white/80 font-mono text-sm">
                /{username}
              </span>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/${username}`
                  navigator.clipboard.writeText(url)
                  alert('Link copied to clipboard!')
                }}
                className="px-4 py-2 glass-button rounded-lg text-lime-300 hover:text-lime-200 font-medium
                           transition-all duration-300 transform hover:scale-105"
              >
                Copy Link
              </button>
              <a
                href={`/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 glass-button rounded-lg text-white/80 hover:text-white font-medium
                           transition-all duration-300 transform hover:scale-105"
              >
                Preview
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-6">Add New Link</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              className="flex-1 px-4 py-3 glass-input text-white placeholder:text-white/40 focus:outline-none 
                          focus:ring-2 focus:ring-lime-400/50 transition-all duration-300"
              placeholder="Link title (e.g., My Website)"
              value={title}
              onChange={e => {
                setTitle(e.target.value)
                if (showValidationErrors) setShowValidationErrors(false)
              }}
            />
            <input
              className="flex-1 px-4 py-3 glass-input text-white placeholder:text-white/40 focus:outline-none 
                          focus:ring-2 focus:ring-lime-400/50 transition-all duration-300"
              placeholder="URL (https://example.com)"
              value={url}
              onChange={e => {
                setUrl(e.target.value)
                if (showValidationErrors) setShowValidationErrors(false)
              }}
              type="url"
            />
          </div>
          <input
            className="w-full px-4 py-3 glass-input text-white placeholder:text-white/40 focus:outline-none 
                        focus:ring-2 focus:ring-lime-400/50 transition-all duration-300"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={200}
          />
          <button
            onClick={onCreate}
            disabled={pending || !isValidForm}
            className="px-6 py-3 glass-button-primary rounded-xl text-white font-medium disabled:opacity-50 
                        disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 glow-hover"
          >
            {pending ? 'Adding...' : 'Add Link'}
          </button>
          {showValidationErrors && !isValidForm && (
            <div className="text-sm text-red-400 mt-2">
              {!title.trim() && <div>• Title is required</div>}
              {!url.trim() && <div>• URL is required</div>}
              {title.trim() && url.trim() && !validateUrl(url.trim()) && (
                <div>• Please enter a valid URL (e.g., example.com or https://example.com)</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Your Links</h3>
          <span className="text-white/60 text-sm">{links.length} links</span>
        </div>
        {links.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-xl">
            <p className="text-white/60 text-lg">No links yet</p>
            <p className="text-white/40 text-sm mt-1">Add your first link above to get started</p>
          </div>
        ) : (
          links.map((link, index) => (
            <div
              key={link.id}
              className={`glass-card rounded-xl p-6 glass-hover transform transition-all duration-300
                 hover:scale-[1.02] glow-hover animate-fadeInUp ${
                !link.is_enabled ? 'opacity-60' : ''
              }`}

              style={{
                '--animation-delay': `${index * 100}ms`
              } as React.CSSProperties}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-white truncate">{link.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        link.is_enabled
                          ? 'bg-lime-500/20 text-lime-300'  
                          : 'bg-gray-500/20 text-gray-400'   
                      }`}
                    >
                      {link.is_enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"             
                    rel="noopener noreferrer"        
                    className="text-blue-400 hover:text-blue-300 text-sm truncate block transition-colors"
                  >
                    {link.url}
                  </a>
                  {link.description && (
                    <p className="text-white/60 text-sm mt-1">{link.description}</p>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                    <span>Order: {link.display_order}</span>
                    <span>Clicks: {link.click_count}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <button
                    onClick={() => onToggleEnabled(link.id)}
                    disabled={pending}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 
                      disabled:opacity-50 ${
                      link.is_enabled
                        ? 'glass-button text-yellow-300 hover:text-yellow-200'
                        : 'glass-button text-lime-300 hover:text-lime-200'
                    }`}
                  >
                    {link.is_enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => onUpdate(link.id)}
                    disabled={pending}
                    className="px-3 py-2 glass-button rounded-lg text-white/80 hover:text-white text-sm 
                    font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(link.id)}
                    disabled={pending}
                    className="px-3 py-2 glass-button rounded-lg text-red-300 hover:text-red-200 text-sm 
                    font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}