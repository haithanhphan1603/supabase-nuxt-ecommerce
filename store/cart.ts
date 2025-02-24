import type { PostgrestError } from '@supabase/supabase-js'
import { useToast } from '~/components/ui/toast'
import type { TablesInsert } from '~/types/database.types'

type CartItem = TablesInsert<'cartItem'>
type Cart = TablesInsert<'cart'>

export const useCartStore = defineStore(
  'cart',
  () => {
    const cartItems = ref<CartItem[]>([])
    const cart = ref<Cart | null>(null)
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const { toast } = useToast()
    const {
      deleteCartItems,
      deleteCart,
      updateCartItems,
      updateCart,
      fetchCartItemsByCartId,
      fetchCartByUserId,
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

        cart.value.totalprice = calculateTotalPrice(cartItems.value)
        cart.value.updatedat = new Date().toISOString()

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
        throw error
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
        currentCartItems[existingItemIndex].price =
          item.price * currentCartItems[existingItemIndex].quantity
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
        const { error } = await supabase
          .from('cartItem')
          .delete()
          .eq('id', removedItem.id)
        if (error) {
          toast({
            title: 'Error deleting cart item',
            description: error.message,
          })
          console.error('Error deleting cart item:', error)
        }
      }
    }

    async function clearCart() {
      if (cart.value) {
        try {
          await Promise.all([
            deleteCart(cart.value.id as string),
            deleteCartItems(cart.value.id as string),
          ])
        } catch (error) {
          toast({
            title: 'Error clearing cart',
            description: (error as Error).message,
          })
          console.error('Error clearing cart:', error)
        }
      }

      cartItems.value = []
      cart.value = null
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
          createOrUpdateCart()
        }
      } catch (error) {
        console.error('Error syncing cart with user:', error)
      }
    }

    watch(
      user,
      async (newUser) => {
        if (newUser) {
          await syncCartWithUser()
        } else {
          await clearCart()
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
      clearCart,
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
