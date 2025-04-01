<template>
  <div class="flex items-center justify-between py-2 border-t relative">
    <div class="flex w-1/2 gap-8 items-center">
      <img
        :src="product?.primaryImage as string"
        alt="Product image"
        class="w-40 h-40 object-contain"
      />
      <div>
        <h3 class="font-bold">{{ product?.name }}</h3>
        <p class="text-sm text-gray-600">{{ product?.vendors.name }}</p>
      </div>
    </div>
    <div class="flex w-1/2 justify-between items-center text-center">
      <p class="font-bold w-1/3">{{ product?.currency }} {{ item.price }}</p>
      <div class="flex w-1/3 justify-center">
        <Button
          class="text-xs bg-violet-500 text-white"
          size="sm"
          :disabled="item.quantity === 1"
          @click="emit('decreaseQuantity')"
        >
          <Minus class="h-4 w-4" />
        </Button>
        <div class="border border-input w-14 flex items-center justify-center">
          {{ item.quantity }}
        </div>
        <Button
          class="text-xs bg-violet-500 text-white"
          size="sm"
          @click="emit('increaseQuantity')"
        >
          <Plus class="h-4 w-4" />
        </Button>
      </div>
      <p class="font-bold w-1/3">
        {{ product?.currency }} {{ getCartItemPrice(item.quantity) }}
      </p>
      <CircleX
        class="cart-item__circle-x absolute right-0 top-[15%] cursor-pointer"
        fill="#cbd5e1"
        color="#1e293b"
        stroke-width="1"
        @click="emit('removeItem')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Minus, Plus, CircleX } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue'
import type { Tables } from '~/types/database.types'
import { useCart } from '~/composables/cart'

interface Props {
  item: Tables<'cartItem'>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'removeItem' | 'decreaseQuantity' | 'increaseQuantity'): void
}>()

const { getCartItemPrice, product } = useCart()
const { fetchProductById } = useApiServices()

async function fetchProductData() {
  product.value = await fetchProductById(props.item.productId as number)
}

fetchProductData()
</script>
<style lang="scss" scoped>
.cart-item__circle-x:hover {
  fill: #94a3b8;
}
</style>
