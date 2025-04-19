import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = event.context.supabase as SupabaseClient<Database>
  const userId = event.context.params?.userId as string

  const { data, error } = await client
    .from('cart')
    .select('*')
    .eq('createdby', userId)
    .single()

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }

  return data
})
