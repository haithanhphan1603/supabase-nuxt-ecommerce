<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold mb-8">SHOPPING CART</h2>
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
      :key="item.productId"
      :item="item"
      @decrease-quantity="decreaseItemQuantity(idx)"
      @increase-quantity="increaseItemQuantity(idx)"
      @remove-item="removeCartItem(idx)"
    />
    <div class="flex justify-end mt-8">
      <div class="text-xl font-bold">
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

const totalPrice = computed(() => {
  return cart.value?.totalprice?.toFixed(2)
})
</script>
