import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = event.context.supabase as SupabaseClient<Database>
  const { productIds } = await readBody(event)

  const { data, error } = await client
    .from('products')
    .select('*')
    .in('id', productIds)

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }

  return { products: data }
})
