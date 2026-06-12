import { checkProPlan } from '@/lib/subscription'
import LinkManagerUI from './_components/LinkManagerUI'
import ProfileSetup from './_components/ProfileSetup'
import { getProfile, getLinks } from '@/lib/actions/links.actions'
import type { Link } from '@/lib/types/links'

export default async function Dashboard() {
  const isProUser = await checkProPlan()
  
  if (!isProUser) return <h1 className='text-7xl'>You need to have a pro plan to get an access</h1>

  let profile = null
  let links: Link[] = []

  try {
    profile = await getProfile()
    if (profile) {
      links = await getLinks()
    }
  } catch (error) {
    console.error('Database error: ', error)
  }

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold text-lime-400 mb-3'>
            {profile ? 'Link Manager' : 'Setup Your Links'}
          </h1>
          <p className='text-white/70 text-lg'>
            {profile ? 'Manage your links and share them with the world' : 'Create your personalized link-in-bio page'}
          </p>
        </div>

        <div className='space-y-8'>
          {!profile ? (
            <ProfileSetup />
          ) : (
            <>
              <ProfileSetup profile={profile} />
              <LinkManagerUI initialLinks={links} username={profile.username} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}