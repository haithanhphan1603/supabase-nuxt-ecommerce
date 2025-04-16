import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'
export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id) as number
  const client = event.context.supabase as SupabaseClient<Database>

  const { data, error } = await client
    .from('products')
    .select(
      'name, unitPrice, primaryImage, vendors(name), currency, inStock, slug',
    )
    .eq('id', id)
    .single()
  if (error) {
    return createError({
      message: error.message,
      statusMessage: error.code,
      statusCode: 400,
      name: 'SupabaseError',
    })
  } else {
    return data
  }
})
