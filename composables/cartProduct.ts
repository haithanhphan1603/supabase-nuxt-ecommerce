import type { QueryData } from '@supabase/supabase-js'
import type { TablesInsert } from '~/types/database.types'

export const useCart = (item: Ref<TablesInsert<'cartItems'>>) => {
  type ProductWithVendor = QueryData<typeof productWithVendorsQuery>[number]
  const { fetchProductById, productWithVendorsQuery } = useApiServices()
  const product = ref<ProductWithVendor>()

  const cartItemPrice = computed(() =>
    (item.value.price * item.value.quantity).toFixed(2),
  )
  async function fetchProductData() {
    product.value = await fetchProductById(item.value.productId as number)
  }

  fetchProductData()
  return {
    cartItemPrice,
    product,
  }
}
