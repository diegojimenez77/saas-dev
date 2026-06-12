'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
  const isPublicProfilePage = pathname && 
    pathname !== '/' && 
    pathname !== '/dashboard' && 
    pathname !== '/pricing' && 
    !pathname.startsWith('/sign-in') && 
    !pathname.startsWith('/sign-up') && 
    !pathname.startsWith('/dashboard') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.includes('.') &&
    pathname.split('/').length === 2
  
  if (isPublicProfilePage) {
    return null
  }
  
  return <Navbar />
}