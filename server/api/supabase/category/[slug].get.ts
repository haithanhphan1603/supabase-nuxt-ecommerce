import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = event.context.supabase as SupabaseClient<Database>
  const categorySlug = event.context.params?.slug as string

  if (!categorySlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing category slug',
    })
  }

  const { data, error } = await client
    .from('categories')
    .select('*')
    .eq('slug', categorySlug)
    .single()
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch category',
    })
  }
  return { category: data }
})
