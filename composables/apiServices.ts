import type { PostgrestError } from '@supabase/supabase-js'
import { useToast } from '~/components/ui/toast'
import type { TablesInsert } from '~/types/database.types'
import type { CollectionSearchParams } from '~/types/search.types'
import { SortBy } from '~/types/search.types'

const PRODUCTS_CATEGORIES = 'products_categories'
type CartItem = TablesInsert<'cartItem'>
type Cart = TablesInsert<'cart'>

export const useApiServices = () => {
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  const productWithVendorsQuery = supabase
    .from('products')
    .select(
      'name, unitPrice, primaryImage, vendors(name), currency, inStock, slug',
    )

  const apiError = (error: PostgrestError) => {
    return createError({
      message: error.message,
      statusCode: 400,
    })
  }

  async function getProductsByCategory(
    categoryId: number,
    searchInfo: CollectionSearchParams,
  ) {
    let query = supabase
      .from(PRODUCTS_CATEGORIES)
      .select('products(*,vendors(name))')
      .eq('categoryId', categoryId)
      .not('products(id)', 'is', null)

    query = query.range(
      searchInfo.start,
      searchInfo.start + searchInfo.limit - 1,
    )

    if (searchInfo.productType.length > 0) {
      query = query.in('products.productType', searchInfo.productType)
    }

    // Add sorting logic
    switch (searchInfo.sortBy) {
      case SortBy.PRICE_ASC:
        query = query.order('products(unitPrice)', {
          ascending: true,
        })
        break
      case SortBy.PRICE_DESC:
        query = query.order('products(unitPrice)', {
          ascending: false,
        })
        break
      case SortBy.NAME_ASC:
        query = query.order('products(name)', {
          ascending: true,
        })
        break
      case SortBy.NAME_DESC:
        query = query.order('products(name)', {
          ascending: false,
        })
        break
      case SortBy.CREATED_AT_DESC:
        query = query.order('products(createdAt)', {
          ascending: false,
        })
        break
      // For SortBy.MANUAL, we don't add any specific ordering
      default:
        // No specific ordering for manual or unsupported sorting options
        break
    }

    const { data, error } = await query

    if (error) {
      console.error(error)
      toast({
        title: 'Error fetching products',
        description: error.message,
        variant: 'destructive',
      })
      throw createError({
        message: error.message,
        statusCode: 400,
      })
    }
    return data.map((item) => item.products)
  }

  async function getCategoryBySlug(slug: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
    if (error) {
      console.error(error)
      toast({
        title: 'Error fetching category',
        description: error.message,
        variant: 'destructive',
      })
      throw apiError(error)
    } else {
      return data[0]
    }
  }

  async function getTotalProductsByCategory(
    categoryId: number,
    searchInfo: CollectionSearchParams,
  ) {
    let query = supabase.from('products_categories').select(
      `
      products!inner (
        id,
        productType
      )
    `,
      { count: 'exact' },
    )
    query = query.eq('categoryId', categoryId)

    if (searchInfo.productType.length > 0) {
      query = query.in('products.productType', searchInfo.productType)
    }

    const { count, error } = await query
    if (error) {
      console.error('Error fetching total products:', error)
      toast({
        title: 'Error fetching total products',
        description: error.message,
        variant: 'destructive',
      })
      throw apiError(error)
    }
    return count
  }

  async function fetchProductById(productId: number) {
    const { data, error } = await productWithVendorsQuery
      .eq('id', productId)
      .single()
    if (error) {
      console.error('Error fetching product', error)
      toast({
        title: 'Error fetching product',
        description: error.message,
        variant: 'destructive',
      })
      throw apiError(error)
    }
    return data
  }

  async function deleteCartItems(cartId: string) {
    const { error: itemsError } = await supabase
      .from('cartItem')
      .delete()
      .eq('cartId', cartId)
    if (itemsError) {
      throw itemsError
    }
  }

  async function deleteCart(cartId: string) {
    const { error: cartError } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartId)
    if (cartError) {
      throw apiError(cartError)
    }
  }

  async function deleteCartItemById(cartItemId: string) {
    const { error } = await supabase
      .from('cartItem')
      .delete()
      .eq('id', cartItemId)
    if (error) {
      throw apiError(error)
    }
  }

  async function updateCartItems(cartItems: CartItem[]) {
    const { error: itemsError } = await supabase
      .from('cartItem')
      .upsert(cartItems)
    if (itemsError) {
      toast({
        title: 'Error updating cart items',
        description: itemsError.message,
        variant: 'destructive',
      })
      throw apiError(itemsError)
    }
  }

  async function updateCart(cart: Cart) {
    const { error: cartError } = await supabase.from('cart').upsert([cart])
    if (cartError) {
      toast({
        title: 'Error updating cart',
        description: cartError.message,
        variant: 'destructive',
      })
      throw apiError(cartError)
    }
  }

  async function getWishlistItems(userId: string) {
    const { data, error } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', userId)
    if (error) {
      console.error(error)
      toast({
        title: 'Error fetching wishlist',
        description: error.message,
        variant: 'destructive',
      })
      throw apiError(error)
    }
    return data
  }

  async function deleteWishlistItemApi(userId: string, productId: number) {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) {
      console.error('Error deleting wishlist item:', error)
      toast({
        title: 'Error deleting wishlist item',
        description: error.message,
        variant: 'destructive',
      })
      throw apiError(error)
    }
  }

  async function addToWishlistApi(userId: string, productId: number) {
    const { error } = await supabase
      .from('wishlist')
      .insert([{ user_id: userId, product_id: productId }])
    if (error) {
      console.error('Error adding to wishlist:', error)
      toast({
        title: 'Error adding to wishlist',
        description: error.message,
        variant: 'destructive',
      })
      throw apiError(error)
    }
  }

  async function fetchCartItemsByCartId(cartId: string) {
    const { data, error } = await supabase
      .from('cartItem')
      .select('*')
      .eq('cartId', cartId)

    if (error) {
      console.error('Error fetching cart items:', error)
      toast({
        title: 'Error fetching cart items',
        description: error.message,
        variant: 'destructive',
      })
      throw apiError(error)
    }
    return data
  }

  async function fetchCartByUserId(userId: string) {
    const { data, error } = await supabase
      .from('cart')
      .select('*')
      .eq('createdby', userId as string)
      .order('updatedat', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching cart:', error)
      toast({
        title: 'Error fetching cart',
        description: error.message,
        variant: 'destructive',
      })
      throw apiError(error)
    }
    return data
  }

  async function searchProduct(productName: string) {
    const { data, error } = await supabase.rpc(
      'search_products_by_name_prefix',
      {
        prefix: productName,
      },
    )

    if (error) {
      console.error('Error searching product:', error)
      toast({
        title: 'Error searching product',
        description: error.message,
        variant: 'destructive',
      })
      throw apiError(error)
    }
    return data
  }

  return {
    productWithVendorsQuery,
    getProductsByCategory,
    getCategoryBySlug,
    getTotalProductsByCategory,
    deleteCart,
    deleteCartItems,
    updateCartItems,
    updateCart,
    getWishlistItems,
    deleteWishlistItemApi,
    addToWishlistApi,
    fetchProductById,
    fetchCartItemsByCartId,
    fetchCartByUserId,
    searchProduct,
    deleteCartItemById,
  }
}
