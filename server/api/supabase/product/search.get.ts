import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = event.context.supabase as SupabaseClient<Database>
  const { name } = getQuery(event) as { name?: string }

  if (!name || name.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product name is required for search',
    })
  }

  const { data, error } = await client.rpc('search_products_by_name_prefix', {
    prefix: name,
  })

  if (error) {
    console.error('Error searching product:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search product',
    })
  }

  return { products: data }
})
