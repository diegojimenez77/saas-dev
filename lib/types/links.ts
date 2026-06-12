export interface LinkProfile {
    id: string,
    user_id: string,
    username: string,
    display_name?: string,
    bio?: string,
    avatar_url?: string,
    theme: 'dark' | 'light' | 'gradient',
    is_public: boolean,
    created_at: string,
    updated_at: string
}

export interface Link {
    id: string,
    user_id: string,
    title: string,
    url: string,
    description?: string,
    display_order: number,
    is_enabled: boolean,
    click_count: number,
    created_at: string,
    updated_at: string
}

export interface PublicProfile {
  profile: LinkProfile
  links: Link[]
}

export interface LinkFormData {
  title: string
  url: string
  description?: string
}

export interface ProfileFormData {
  username: string
  display_name?: string
  bio?: string
  avatar_url?: string
  theme: 'dark' | 'light' | 'gradient'
  is_public: boolean
}