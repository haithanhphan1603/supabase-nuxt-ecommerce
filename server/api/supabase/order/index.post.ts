import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = event.context.supabase as SupabaseClient<Database>
  const { order } = await readBody(event)

  const { error } = await client.from('orders').upsert(order)
  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }
  return { success: true }
})
