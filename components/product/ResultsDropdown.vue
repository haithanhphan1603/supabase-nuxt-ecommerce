<template>
  <div
    v-if="products.length > 0"
    class="absolute px-4 sm:px-6 lg:px-16 mx-auto py-3 top-full left-0 right-0 bg-background border shadow-lg max-h-96 overflow-y-auto z-50"
  >
    <h3 class="text-xl py-2 font-semibold">Products</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2">
      <div
        v-for="product in products"
        :key="product.id"
        class="hover:bg-accent cursor-pointer p-2"
        @click="emit('select', product)"
      >
        <div class="flex items-center space-x-4">
          <img
            v-if="product.primaryImage"
            :src="product.primaryImage"
            :alt="product.name"
            class="h-16 w-16 object-cover "
          />
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-medium truncate">{{ product.name }}</h3>
            <p class="text-base text-muted-foreground">
              ${{ product.unitPrice?.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Tables } from '~/types/database.types'
type Product = Tables<'products'>

interface Props {
  products : Product[]
}
interface Emits {
  (event: 'select', product: Product): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>