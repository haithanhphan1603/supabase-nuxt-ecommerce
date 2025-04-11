<template>
  <div class="container mx-auto sm:px-4 px-0 sm:py-8 py-4">
    <h2 class="text-3xl font-bold sm:mb-8 mb-4 text-center sm:text-start">
      SHOPPING CART
    </h2>
    <template v-if="!isMobile">
      <div class="flex justify-between font-extrabold mb-4 text-2xl">
        <span class="w-1/2">PRODUCTS</span>
        <div class="w-1/2 flex justify-between text-center">
          <span class="w-1/3">PRICE</span>
          <span class="w-1/3">QUANTITY</span>
          <span class="w-1/3">TOTAL</span>
        </div>
      </div>
      <CartItem
        v-for="(item, idx) in cartItems"
        :key="item.productId ?? `fallback-${idx}`"
        :item="item"
        @decrease-quantity="decreaseItemQuantity(idx)"
        @increase-quantity="increaseItemQuantity(idx)"
        @remove-item="removeCartItem(idx)"
      />
    </template>
    <template v-else>
      <CartDropdownItem
        v-for="(item, idx) in cartItems"
        :key="item.productId ?? `fallback-${idx}`"
        class="px-0 py-4 border-x-0"
        :item="item"
        @decrease-quantity="decreaseItemQuantity(idx)"
        @increase-quantity="increaseItemQuantity(idx)"
        @remove-item="removeCartItem(idx)"
      >
      </CartDropdownItem>
    </template>
    <div class="flex justify-end mt-4">
      <div class="text-2xl font-bold">
        SUBTOTAL: {{ cart?.currency }} {{ totalPrice }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart'

const cartStore = useCartStore()
const { decreaseItemQuantity, increaseItemQuantity, removeCartItem } = cartStore
const { cartItems, cart } = storeToRefs(cartStore)
const { isMobile } = useUtilities()

const totalPrice = computed(() => {
  return cart.value?.totalprice?.toFixed(2)
})
</script>
