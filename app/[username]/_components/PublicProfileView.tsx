'use client'

import { useState } from "react"
import { incrementLinkClick } from "@/lib/actions/links.actions"
import type { PublicProfile } from "@/lib/types/links"

interface PublicProfileViewProps {
    profile: PublicProfile
}

export default function PublicProfileView({ profile: initialProfile } : PublicProfileViewProps) {
    const [profile] = useState(initialProfile)
    const { profile: userProfile, links } = profile

    const handleLinkClick = async (linkId: string, url: string) => {
        try {
            await incrementLinkClick(linkId)
        } catch (error) {
            console.error('Failed to track click:', error)
        }
        window.open(url, '_blank', 'noopener,noreferrer')
    }


    const getThemeClasses = () => {
        switch (userProfile.theme) {
        case 'light':
            return 'bg-gradient-to-br from-gray-50 to-white text-gray-900'
        case 'gradient':
            return 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white'
        default:
            return 'dark-bg text-white'
        }
    }

    const getCardClasses = () => {
        switch (userProfile.theme) {
        case 'light':
            return 'bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg'
        case 'gradient':
            return 'bg-white/10 backdrop-blur-md border border-white/20'
        default:
            return 'glass-card'
        }
    }

    const getButtonClasses = () => {
        switch (userProfile.theme) {
        case 'light':
            return 'bg-gray-900 hover:bg-gray-800 text-white border-gray-900'
        case 'gradient':
            return 'bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm'
        default:
            return 'glass-button text-white hover:bg-white/10'
        }
    }

      return (
        <div className={`min-h-screen w-full ${getThemeClasses()}`}>
            <div className="container mx-auto px-4 py-12 max-w-md"> 
                <div className={`${getCardClasses()} rounded-2xl p-8 mb-8 text-center`}>
                    {userProfile.avatar_url && (
                        <div className="mb-6">
                            <img
                                src={userProfile.avatar_url}
                                alt={userProfile.display_name || userProfile.username}
                                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white/20"
                                onError={(e) => {e.currentTarget.style.display = 'none'}}
                            />
                        </div>
                    )}
                
                    <h1 className="text-2xl font-bold mb-2">
                        {userProfile.display_name || userProfile.username}
                    </h1>
                
                    {userProfile.display_name && (
                        <p className="text-opacity-60 mb-3 text-sm">
                            @{userProfile.username}
                        </p>
                    )}
                
                    {userProfile.bio && (
                        <p className="text-opacity-80 leading-relaxed">
                            {userProfile.bio}
                        </p>
                    )}
                </div>
                <div className="space-y-4">
                    {links.length === 0 ? (
                        <div className={`${getCardClasses()} rounded-2xl p-8 text-center`}>
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                                <svg className="w-8 h-8 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <p className="opacity-60">No links added yet</p>
                        </div>
                    ) : (
                        links.map((link, index) => (
                        <button
                            key={link.id}
                            onClick={() => handleLinkClick(link.id, link.url)}
                            className={`w-full ${getCardClasses()} ${getButtonClasses()} rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 active:scale-95 text-left animate-fadeInUp`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg truncate mb-1">
                                        {link.title}
                                    </h3>
                                    {link.description && (
                                        <p className="opacity-70 text-sm truncate">
                                            {link.description}
                                        </p>
                                    )}
                                </div>
                                <div className="ml-4 opacity-60">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}