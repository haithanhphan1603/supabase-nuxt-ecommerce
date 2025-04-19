import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = event.context.supabase as SupabaseClient<Database>
  const cartId = event.context.params?.cartId as string

  const { data, error } = await client
    .from('cartItems')
    .select('*')
    .eq('cartId', cartId)

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }

  return data
})
