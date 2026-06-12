import { notFound } from "next/navigation"
import { getPublicProfile } from "@/lib/actions/links.actions"
import type { Metadata } from "next"
import PublicProfileView from "./_components/PublicProfileView"

interface ProfilePageProps {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
    const { username } = await params
    const publicProfile = await getPublicProfile(username)

    if (!publicProfile) {
        return {
            title: 'Profile Not Found'
        }
    }

    const { profile } = publicProfile
    return {
        title: profile.display_name 
            ? `${profile.display_name} (@${profile.username})` 
            : `@${profile.username}`,
        description: profile.bio || `Check out ${profile.display_name || profile.username}'s links`,
        openGraph: {
            title: profile.display_name || profile.username,
            description: profile.bio || `Check out my links`,
            images: profile.avatar_url ? [profile.avatar_url] : [],
        }
    }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { username } = await params
    const publicProfile = await getPublicProfile(username)

    if (!publicProfile) {
        notFound()
    }

    return (
        <>
            <PublicProfileView profile={publicProfile} />
        </>
    )
}