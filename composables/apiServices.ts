import type { PostgrestError } from '@supabase/supabase-js'
import { useToast } from '~/components/ui/toast'
import type { TablesInsert } from '~/types/database.types'
import type { CollectionSearchParams } from '~/types/search.types'

type CartItem = TablesInsert<'cartItems'>
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

  async function fetchProductsByIds(productIds: number[]) {
    const { data, error } = await useFetch('/api/supabase/product/batch', {
      method: 'get',
      query: {
        productIds,
      },
    })
    if (error.value) {
      toast({
        title: 'Error fetching products',
        description: error.value.message,
        variant: 'destructive',
      })
      return null
    }
    return data.value?.products || []
  }

  async function getProductsByCategory(
    categoryId: number,
    searchParams: CollectionSearchParams,
  ) {
    const { data, error } = await useFetch(
      `/api/supabase/products-categories/${categoryId}`,
      {
        query: {
          start: searchParams.start,
          limit: searchParams.limit,
          sortBy: searchParams.sortBy,
          productType: searchParams.productType,
        },
      },
    )

    if (error.value) {
      toast({
        title: 'Error fetching products',
        description: error.value.message,
        variant: 'destructive',
      })
    }

    return data.value?.products || []
  }

  async function getCategoryBySlug(slug: string) {
    const { data, error } = await useFetch(`/api/supabase/category/${slug}`)
    if (error.value) {
      toast({
        title: 'Error fetching category',
        description: error.value.message,
        variant: 'destructive',
      })
      return null
    }
    return data.value?.category
  }

  async function getTotalProductsByCategory(
    categoryId: number,
    searchInfo: CollectionSearchParams,
  ) {
    const { data, error } = await useFetch(
      `/api/supabase/products-categories/${categoryId}/count`,
      {
        query: {
          productType: searchInfo.productType,
        },
      },
    )
    if (error.value) {
      toast({
        title: 'Error fetching total products',
        description: error.value.message,
        variant: 'destructive',
      })
    }
    return data.value?.count || 0
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

  async function deleteCartItemById(cartItemId: string) {
    const { error } = await useFetch(`/api/supabase/cart-items/${cartItemId}`, {
      method: 'DELETE',
    })
    if (error.value) {
      toast({
        title: 'Error deleting cart item',
        description: error.value.message,
        variant: 'destructive',
      })
    }
  }

  async function updateCartItems(cartItems: CartItem[]) {
    const { error } = await useFetch('/api/supabase/cart-items', {
      method: 'POST',
      body: cartItems,
    })
    if (error.value) {
      toast({
        title: 'Error updating cart items',
        description: error.value.message,
        variant: 'destructive',
      })
    }
  }

  async function updateCart(cart: Cart) {
    const { error } = await useFetch('/api/supabase/cart', {
      method: 'POST',
      body: cart,
    })
    if (error.value) {
      toast({
        title: 'Error updating cart',
        description: error.value.message,
        variant: 'destructive',
      })
    }
  }

  async function getWishlistItems(userId: string) {
    const { data, error } = await useFetch(`/api/supabase/wishlist/${userId}`)
    if (error.value) {
      toast({
        title: 'Error fetching wishlist items',
        description: error.value.message,
        variant: 'destructive',
      })
      return null
    }
    return data.value?.wishlist
  }

  async function deleteWishlistItemApi(userId: string, productId: number) {
    const { data, error } = await useFetch('/api/supabase/wishlist', {
      method: 'DELETE',
      body: {
        userId,
        productId,
      },
    })
    if (error.value) {
      toast({
        title: 'Error deleting wishlist item',
        description: error.value.message,
        variant: 'destructive',
      })
    }
    if (data.value?.success === true) {
      toast({
        title: 'Deleted from wishlist',
        description: 'Product has been removed from your wishlist.',
        variant: 'success',
      })
    }
  }

  async function addToWishlistApi(userId: string, productId: number) {
    const { data, error } = await useFetch('/api/supabase/wishlist', {
      method: 'POST',
      body: {
        userId,
        productId,
      },
    })
    if (error.value) {
      toast({
        title: 'Error adding to wishlist',
        description: error.value.message,
        variant: 'destructive',
      })
    }
    if (data.value?.success === true) {
      toast({
        title: 'Added to wishlist',
        description: 'Product has been added to your wishlist.',
        variant: 'success',
      })
    }
  }

  async function fetchCartItemsByCartId(cartId: string) {
    const { data, error } = await useFetch(`/api/supabase/cart/${cartId}/items`)
    if (error.value) {
      toast({
        title: 'Error fetching cart items',
        description: error.value.message,
        variant: 'destructive',
      })
      return null
    }
    return data.value?.cartItems
  }

  async function fetchCartByUserId(userId: string) {
    const { data, error } = useFetch(`/api/supabase/cart/${userId}`)
    if (error.value) {
      toast({
        title: 'Error fetching cart',
        description: error.value.message,
        variant: 'destructive',
      })
      return null
    }
    return data.value?.cart
  }

  async function searchProduct(productName: string) {
    const { data, error } = await useFetch('/api/supabase/product/search', {
      query: {
        name: productName,
      },
    })
    if (error.value) {
      toast({
        title: 'Error searching product',
        description: error.value.message,
        variant: 'destructive',
      })
      return null
    }
    return data.value?.products
  }

  return {
    productWithVendorsQuery,
    getProductsByCategory,
    getCategoryBySlug,
    getTotalProductsByCategory,
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
    fetchProductsByIds,
  }
}
