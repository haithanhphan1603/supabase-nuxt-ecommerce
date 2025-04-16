import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  const client = event.context.supabase as SupabaseClient<Database>

  const { error } = await client.from('cartItems').delete().eq('id', id)

  if (error) {
    throw createError({
      message: error.message,
      statusMessage: error.code,
      statusCode: 400,
      name: 'SupabaseError',
    })
  }
})
