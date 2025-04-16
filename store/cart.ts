import type { PostgrestError } from '@supabase/supabase-js'
import { useToast } from '~/components/ui/toast'
import type { TablesInsert } from '~/types/database.types'

type CartItem = TablesInsert<'cartItems'>
type Cart = TablesInsert<'cart'>

export const useCartStore = defineStore(
  'cart',
  () => {
    const cartItems = ref<CartItem[]>([])
    const cart = ref<Cart | null>(null)
    const user = useSupabaseUser()
    const { toast } = useToast()
    const isUpdating = ref(false)

    const {
      updateCartItems,
      updateCart,
      fetchCartItemsByCartId,
      fetchCartByUserId,
    } = useApiServices()

    const totalQuantity = computed(() =>
      cartItems.value.reduce((acc, item) => acc + item.quantity, 0),
    )

    const totalPrice = computed(() =>
      cartItems.value.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      ),
    )

    function ensureCart() {
      if (!cart.value && user.value) {
        const now = new Date().toISOString()
        cart.value = {
          totalprice: 0,
          currency: 'USD',
          createdat: now,
          updatedat: now,
          createdby: user.value.id,
        }
      }
      return cart.value
    }

    // Schedule database update with debounce
    function scheduleUpdate() {
      useDebounceFn(() => {
        persistCartToDatabase()
      }, 500)
    }

    async function persistCartToDatabase() {
      if (!user.value || isUpdating.value) return

      try {
        isUpdating.value = true

        // Make sure we have a cart
        const currentCart = ensureCart()
        if (!currentCart) return

        // Update cart price and timestamp
        currentCart.totalprice = totalPrice.value
        currentCart.updatedat = new Date().toISOString()

        // Ensure cart items have correct cartId
        const itemsToUpdate = cartItems.value.map((item) => ({
          ...item,
          cartId: currentCart.id,
        }))

        await Promise.all([
          updateCart(currentCart),
          updateCartItems(itemsToUpdate),
        ])
      } catch (error) {
        toast({
          title: 'Error updating cart',
          description: (error as PostgrestError).message,
        })
        console.error('Cart update error:', error)
      } finally {
        isUpdating.value = false
      }
    }

    async function loadUserCart() {
      if (!user.value) return

      try {
        const existingCart = await fetchCartByUserId(user.value.id)
        if (existingCart) {
          cart.value = existingCart
          const items = await fetchCartItemsByCartId(existingCart.id)
          cartItems.value = items || []
        }
      } catch (error) {
        toast({
          title: 'Error loading cart',
          description: (error as Error).message,
        })
        console.error('Error loading user cart:', error)
      }
    }

    async function deleteCartItem(itemId: string) {
      try {
        await useFetch(`/api/supabase/cart-items/${itemId}`, {
          method: 'DELETE',
        })
      } catch (error) {
        toast({
          title: 'Error removing item',
          description: (error as Error).message,
        })
        console.error('Error removing item:', error)
      }
    }

    // Cart manipulation functions
    function addToCart(item: CartItem) {
      const existingIndex = cartItems.value.findIndex(
        (i) => i.productId === item.productId,
      )

      if (existingIndex !== -1) {
        cartItems.value[existingIndex].quantity += item.quantity
      } else {
        cartItems.value.push({
          ...item,
          cartId: cart.value?.id || null,
        })
      }
      scheduleUpdate()
    }

    function removeCartItem(index: number) {
      const removedItem = cartItems.value[index]
      cartItems.value.splice(index, 1)

      scheduleUpdate()

      if (removedItem.id && user.value) {
        deleteCartItem(removedItem.id)
      }
    }

    function increaseItemQuantity(index: number) {
      cartItems.value[index].quantity += 1
      scheduleUpdate()
    }

    function decreaseItemQuantity(index: number) {
      if (cartItems.value[index].quantity > 1) {
        cartItems.value[index].quantity -= 1
        scheduleUpdate()
      } else {
        removeCartItem(index)
      }
    }

    // Initialize cart when user changes
    watch(
      user,
      async (newUser) => {
        if (newUser) {
          await loadUserCart()
        } else {
          cartItems.value = []
          cart.value = null
        }
      },
      { immediate: true },
    )

    return {
      cart,
      cartItems,
      totalQuantity,
      totalPrice,
      addToCart,
      removeCartItem,
      increaseItemQuantity,
      decreaseItemQuantity,
    }
  },
  {
    persist: true,
  },
)
