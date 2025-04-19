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
    const {
      updateCartItems,
      updateCart,
      fetchCartItemsByCartId,
      fetchCartByUserId,
      deleteCartItemById,
    } = useApiServices()

    const isMiniCartVisible = ref(false)

    const totalQuantity = computed(() => {
      return cartItems.value.reduce((acc, item) => acc + item.quantity, 0)
    })

    async function createOrUpdateCart() {
      try {
        if (!cart.value) {
          cart.value = createNewCart(user.value?.id as string)
        }

        // Update the cart total price based on current items
        cart.value.totalprice = calculateTotalPrice(cartItems.value)
        cart.value.updatedat = new Date().toISOString()

        // Ensure all cart items have the correct cartId
        const aggregatedCartItems = cartItems.value.map((item) => ({
          ...item,
          cartId: cart.value!.id,
        }))

        if (user.value) {
          await Promise.all([
            updateCart(cart.value),
            updateCartItems(aggregatedCartItems),
          ])
        }
      } catch (error) {
        toast({
          title: 'Error updating cart',
          description: (error as PostgrestError).message,
        })
      }
    }

    function createNewCart(createdBy: string) {
      const now = new Date().toISOString()
      return {
        totalprice: 0,
        currency: '$',
        createdat: now,
        updatedat: now,
        createdby: createdBy,
      }
    }

    function calculateTotalPrice(
      items: Array<{ price: number; quantity: number }>,
    ) {
      return items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    }

    function addToCart(item: CartItem) {
      const currentCartItems = [...cartItems.value]
      const existingItemIndex = currentCartItems.findIndex(
        (i) => i.productId === item.productId,
      )

      if (existingItemIndex >= 0) {
        currentCartItems[existingItemIndex].quantity += item.quantity
        currentCartItems[existingItemIndex].price = item.price
      } else {
        item.cartId = cart.value?.id || ''
        currentCartItems.push(item)
      }

      cartItems.value = [...currentCartItems]
      createOrUpdateCart()
    }

    async function removeCartItem(index: number) {
      const currentCartItems = [...cartItems.value]
      const removedItem = currentCartItems.splice(index, 1)[0]
      cartItems.value = [...currentCartItems]
      createOrUpdateCart()

      if (removedItem.id) {
        try {
          await deleteCartItemById(removedItem.id)
        } catch (error) {
          toast({
            title: 'Error removing item from cart',
            description: (error as Error).message,
          })
          console.error('Error removing item from cart:', error)
        }
      }
    }

    function increaseItemQuantity(idx: number) {
      const currentCartItems = [...cartItems.value]
      currentCartItems[idx].quantity += 1
      cartItems.value = [...currentCartItems]
      createOrUpdateCart()
    }

    function decreaseItemQuantity(idx: number) {
      const currentCartItems = [...cartItems.value]
      if (currentCartItems[idx].quantity > 1) {
        currentCartItems[idx].quantity -= 1
      } else {
        // Remove the item if quantity would drop to 0
        currentCartItems.splice(idx, 1)
      }
      cartItems.value = [...currentCartItems]
      createOrUpdateCart()
    }

    async function syncCartWithUser() {
      try {
        const existingCart = await fetchCartByUserId(user.value?.id as string)

        if (existingCart) {
          cart.value = existingCart
          const items = await fetchCartItemsByCartId(existingCart.id)
          cartItems.value = items || []
        } else if (cart.value) {
          // If there's no existing cart but we have a cart in store, create it
          createOrUpdateCart()
        }
      } catch (error) {
        toast({
          title: 'Error syncing cart',
          description: (error as Error).message,
        })
        console.error('Error syncing cart with user:', error)
      }
    }

    // Watch for user changes to sync cart
    watch(
      user,
      async (newUser) => {
        if (newUser) {
          await syncCartWithUser()
        } else {
          cartItems.value = []
          cart.value = null
        }
      },
      {
        immediate: true,
      },
    )

    return {
      cartItems,
      addToCart,
      removeCartItem,
      increaseItemQuantity,
      decreaseItemQuantity,
      totalQuantity,
      isMiniCartVisible,
      cart,
      syncCartWithUser,
    }
  },
  {
    persist: true,
  },
)
