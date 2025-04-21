import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = event.context.supabase as SupabaseClient<Database>
  const categoryId = Number(event.context.params?.categoryId)
  const { productType } = getQuery(event) as { productType?: string | string[] }

  if (isNaN(categoryId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid categoryId',
    })
  }

  let query = client
    .from('products_categories')
    .select(
      `
      products!inner (
        id,
        productType
      )
    `,
      { count: 'exact' },
    )
    .eq('categoryId', categoryId)

  if (productType && productType.length > 0) {
    const types = Array.isArray(productType) ? productType : [productType]
    query = query.in('products.productType', types)
  }

  const { count, error } = await query

  if (error) {
    console.error('Error fetching product count by category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch product count',
    })
  }

  return { count }
})
