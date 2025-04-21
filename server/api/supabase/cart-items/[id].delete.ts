import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = event.context.supabase as SupabaseClient<Database>
  const cartItemId = getRouterParam(event, 'id') as string

  if (!cartItemId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing cart item ID',
    })
  }

  const { error } = await client.from('cartItems').delete().eq('id', cartItemId)

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }

  return { success: true }
})
