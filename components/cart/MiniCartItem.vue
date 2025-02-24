<template>
  <Card class="flex gap-6 relative p-4 items-center">
    <div
      class="flex justify-center items-center h-[100px] w-[100px] min-w-[100px]"
    >
      <img class="object-contain" :src="product?.primaryImage as string" />
    </div>
    <div class="flex flex-col gap-0.5">
      <CommonAppLink class="!font-bold" to="/test">
        {{ product?.vendors.name }}
      </CommonAppLink>
      <div>
        <h4>{{ product?.name }}</h4>
        <h5 class="font-bold text-sm">
          ${{ getCartItemPrice(item.quantity) }}
        </h5>
      </div>

      <div class="flex mt-1">
        <Button
          class="text-xs bg-violet-500 text-white"
          size="xs"
          :disabled="item.quantity === 1"
          @click="emit('decreaseQuantity')"
        >
          <Minus class="h-3 w-3" />
        </Button>
        <div class="border border-input w-10 text-center">
          {{ item.quantity }}
        </div>
        <Button
          class="text-xs bg-violet-500 text-white"
          size="xs"
          @click="emit('increaseQuantity')"
        >
          <Plus class="h-3 w-3" />
        </Button>
      </div>
      <CircleX
        class="absolute right-3 cursor-pointer"
        fill="#cbd5e1"
        color="#1e293b"
        stroke-width="1"
        @click="emit('removeItem')"
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
import { CircleX, Plus, Minus } from 'lucide-vue-next'
import { Card } from '../ui/card'
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

<style scoped></style>
