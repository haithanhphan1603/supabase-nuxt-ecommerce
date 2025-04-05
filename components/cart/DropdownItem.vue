<template>
  <Card class="flex gap-6 max-sm:gap-2 relative p-4 items-center">
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
</template>

<script setup lang="ts">
import { Minus, Plus, CircleX } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue'
import type { TablesInsert } from '~/types/database.types'
import { useCart } from '~/composables/cart'

interface Props {
  item: TablesInsert<'cartItem'>
}

const props = defineProps<Props>()

const item = toRef(() => props.item)

const emit = defineEmits<{
  (e: 'removeItem' | 'decreaseQuantity' | 'increaseQuantity'): void
}>()

const { cartItemPrice, product } = useCart(item)
</script>
