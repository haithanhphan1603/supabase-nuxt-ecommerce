<template>
  <Card
    v-if="variant === 'dropdown'"
    class="flex gap-6 max-sm:gap-4 relative p-4 items-center"
  >
    <div
      class="flex justify-center items-center h-[100px] w-[100px] min-w-[100px]"
    >
      <img class="object-contain" :src="product?.primaryImage as string" />
    </div>
    <div class="flex flex-col gap-0.5 w-1/2">
      <div>
        <CommonAppLink to="#" class="!font-bold text-sm">
          {{ product?.vendors?.name }}
        </CommonAppLink>
        <CommonAppLink class="text-sm" :to="`/products/${product?.slug}`">
          <h4>{{ product?.name }}</h4>
        </CommonAppLink>
        <h5 class="font-bold text-sm">${{ cartItemPrice }}</h5>
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
        <div class="border border-input w-14 text-center">
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

  <div v-else class="flex items-center justify-between py-2 border-t relative">
    <div class="flex w-1/2 gap-8 items-center">
      <img
        :src="product?.primaryImage as string"
        alt="Product image"
        class="w-40 h-40 object-contain"
      />
      <div>
        <h3 class="font-bold">{{ product?.name }}</h3>
        <p class="text-gray-600">{{ product?.vendors?.name }}</p>
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
        {{ product?.currency }}
        {{ cartItemPrice }}
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
import type { TablesInsert } from '~/types/database.types'
import { useCart } from '~/composables/cartProduct'

interface Props {
  item: TablesInsert<'cartItems'>
  variant?: 'dropdown' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'full',
})

const emit = defineEmits<{
  (e: 'removeItem' | 'decreaseQuantity' | 'increaseQuantity'): void
}>()

const item = toRef(() => props.item)
const { cartItemPrice, product } = useCart(item)
</script>

<style lang="scss" scoped>
.cart-item__circle-x:hover {
  fill: #94a3b8;
}
</style>
