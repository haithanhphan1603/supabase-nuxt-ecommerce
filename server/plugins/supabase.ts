import type { SupabaseClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

let supabaseClient: SupabaseClient | null = null
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    if (!supabaseClient) {
      supabaseClient = await serverSupabaseClient<Database>(event)
    }
    event.context.supabase = supabaseClient
  })
})
