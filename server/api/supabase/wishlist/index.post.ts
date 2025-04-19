import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = event.context.supabase as SupabaseClient<Database>
  const { userId, productId } = await readBody(event)

  const { error } = await client
    .from('wishlist')
    .insert([{ user_id: userId, product_id: productId }])
  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }
  return { success: true }
})
