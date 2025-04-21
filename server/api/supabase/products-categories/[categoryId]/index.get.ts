import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Enums } from '~/types/database.types'
import { SortBy } from '~/types/search.types'

const PRODUCTS_CATEGORIES = 'products_categories'

export default defineEventHandler(async (event) => {
  const client = event.context.supabase as SupabaseClient<Database>
  const query = getQuery(event)
  const categoryId = event.context.params?.categoryId as string

  if (!categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing category ID',
    })
  }

  const start = parseInt(query.start as string) || 0
  const limit = parseInt(query.limit as string) || 10
  const sortBy = (query.sortBy as SortBy) || SortBy.CREATED_AT_DESC
  const productType = query.productType
    ? Array.isArray(query.productType)
      ? (query.productType as Enums<'productType'>[])
      : [query.productType as Enums<'productType'>]
    : []

  let supabaseQuery = client
    .from(PRODUCTS_CATEGORIES)
    .select('products(*,vendors(name))')
    .eq('categoryId', categoryId)
    .not('products(id)', 'is', null)
    .range(start, start + limit - 1)

  // Add product type filter if provided
  if (productType.length > 0) {
    supabaseQuery = supabaseQuery.in('products.productType', productType)
  }

  // Add sorting logic
  switch (sortBy) {
    case SortBy.PRICE_ASC:
      supabaseQuery = supabaseQuery.order('products(unitPrice)', {
        ascending: true,
      })
      break
    case SortBy.PRICE_DESC:
      supabaseQuery = supabaseQuery.order('products(unitPrice)', {
        ascending: false,
      })
      break
    case SortBy.NAME_ASC:
      supabaseQuery = supabaseQuery.order('products(name)', { ascending: true })
      break
    case SortBy.NAME_DESC:
      supabaseQuery = supabaseQuery.order('products(name)', {
        ascending: false,
      })
      break
    case SortBy.CREATED_AT_DESC:
      supabaseQuery = supabaseQuery.order('products(createdAt)', {
        ascending: false,
      })
      break
    default:
      // No specific ordering for manual or unsupported sorting options
      break
  }

  const { data, error } = await supabaseQuery

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }
  const products = data.map((item) => item.products)
  return { products }
})
