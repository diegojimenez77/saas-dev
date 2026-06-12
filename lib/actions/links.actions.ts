'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { createSupabaseClient, getCurrentUserId } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import type { LinkProfile, Link, PublicProfile, LinkFormData, ProfileFormData } from '@/lib/types/links'

const linkSchema = z.object({
  title: z.string().min(1).max(100),
  url: z.url(),
  description: z.string().max(200).optional(),
})

const profileSchema = z.object({
  username: z.string().min(3).max(30).regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and hyphens'
  ),

  display_name: z.string().max(50).optional(),
  bio: z.string().max(160).optional(),
  avatar_url: z.union([z.url(), z.literal('')]).optional(),
  theme: z.enum(['dark', 'light', 'gradient']).default('dark'),
  is_public: z.boolean().default(true),
})








export async function getProfile(): Promise<LinkProfile | null> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('link_profiles')
    .select('*')            
    .eq('user_id', userId)  
    .single()               

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return data
}






















export async function createProfile(formData: ProfileFormData): Promise<LinkProfile> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')

  const validatedData = profileSchema.parse(formData)

  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('link_profiles')
    .insert({
      user_id: userId,       
      ...validatedData,       
    })
    .select('*')             
    .single()                 

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')

  return data
}


















export async function updateProfile(formData: ProfileFormData): Promise<LinkProfile> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')
  const validatedData = profileSchema.parse(formData)

  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('link_profiles')
    .update(validatedData)     
    .eq('user_id', userId)      
    .select('*')               
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  revalidatePath(`/${validatedData.username}`)

  return data
}

export async function getLinks(): Promise<Link[]> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('links')
    .select('*')                            
    .eq('user_id', userId)                  
    .order('display_order', { ascending: true }) 

  if (error) throw new Error(error.message)
  return data || []
}



















export async function createLink(formData: LinkFormData): Promise<Link> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')
  const validatedData = linkSchema.parse(formData)

  const supabase = createSupabaseClient()
  const { data: maxOrderData } = await supabase
    .from('links')
    .select('display_order')
    .eq('user_id', userId)
    .order('display_order', { ascending: false }) 
    .limit(1)                                    

  const nextOrder = (maxOrderData?.[0]?.display_order || 0) + 1

  const { data, error } = await supabase
    .from('links')
    .insert({
      user_id: userId,
      display_order: nextOrder,    
      ...validatedData,            
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  const profile = await getProfile()
  revalidatePath('/dashboard')                 
  if (profile?.username) {
    revalidatePath(`/${profile.username}`)       
  }

  return data
}






















export async function updateLink(id: string, formData: Partial<LinkFormData>): Promise<Link> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')

  const validatedData = linkSchema.partial().parse(formData)

  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('links')
    .update(validatedData)
    .eq('id', id)                    
    .eq('user_id', userId)          
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  const profile = await getProfile()
  revalidatePath('/dashboard')
  if (profile?.username) {
    revalidatePath(`/${profile.username}`)
  }

  return data
}





















export async function deleteLink(id: string): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createSupabaseClient()
  const { error } = await supabase
    .from('links')
    .delete()                        
    .eq('id', id)                    
    .eq('user_id', userId)           

  if (error) throw new Error(error.message)

  const profile = await getProfile()
  revalidatePath('/dashboard')
  if (profile?.username) {
    revalidatePath(`/${profile.username}`)
  }
}



















export async function toggleLinkEnabled(id: string): Promise<Link> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createSupabaseClient()

  const { data: currentLink } = await supabase
    .from('links')
    .select('is_enabled')
    .eq('id', id)
    .eq('user_id', userId)        
    .single()

  if (!currentLink) throw new Error('Link not found')

  const { data, error } = await supabase
    .from('links')
    .update({ is_enabled: !currentLink.is_enabled })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')                   
    .single()

  if (error) throw new Error(error.message)

  const profile = await getProfile()
  revalidatePath('/dashboard')
  if (profile?.username) {
    revalidatePath(`/${profile.username}`)
  }

  return data
}


















export async function reorderLinks(linkIds: string[]): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createSupabaseClient()

  const updates = linkIds.map((linkId, index) =>
    supabase
      .from('links')
      .update({ display_order: index })
      .eq('id', linkId)             
      .eq('user_id', userId)         
  )

  await Promise.all(updates)

  const profile = await getProfile()
  revalidatePath('/dashboard')
  if (profile?.username) {
    revalidatePath(`/${profile.username}`)
  }
}























export async function getPublicProfile(username: string): Promise<PublicProfile | null> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createSupabaseClient()

  const { data: profile, error: profileError } = await supabase
    .from('link_profiles')
    .select('*')
    .eq('username', username)       
    .eq('is_public', true)          
    .single()                       

  if (profileError) {
    if (profileError.code === 'PGRST116') return null
    throw new Error(profileError.message)
  }

  const { data: links, error: linksError } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.user_id)
    .eq('is_enabled', true)
    .order('display_order', { ascending: true })

  if (linksError) throw new Error(linksError.message)

  return { profile, links: links || [] }
}













export async function incrementLinkClick(linkId: string): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createSupabaseClient()

  const { error } = await supabase.rpc('increment_click_count', {
    link_id: linkId
  })

  if (error) throw new Error(error.message)
}















export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createSupabaseClient()

  const { error } = await supabase
    .from('link_profiles')
    .select('id')                   
    .eq('username', username)        
    .neq('user_id', userId)         
    .single()                       

  if (error && error.code === 'PGRST116') return true
  return false
}