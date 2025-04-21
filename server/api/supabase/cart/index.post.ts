import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = event.context.supabase as SupabaseClient<Database>
  const cart = await readBody(event)
  const { error } = await client.from('cart').upsert(cart)
  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }
  return { success: true }
})
