import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  const client = await serverSupabaseClient<Database>(event)

  const { error } = await client.from('cartItems').delete().eq('id', id)

  if (error) {
    return createError({
      message: error.message,
      statusMessage: error.code,
      statusCode: 400,
      name: 'SupabaseError',
    })
  }
})
