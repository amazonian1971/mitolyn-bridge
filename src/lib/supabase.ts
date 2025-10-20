import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for your leads table
export interface Lead {
  id?: string
  email: string
  source?: string
  campaign?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  ip_address?: string
  user_agent?: string
  page_url?: string
  referrer?: string
  converted?: boolean
  conversion_date?: string
  created_at?: string
  updated_at?: string
}