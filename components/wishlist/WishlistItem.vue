<template>
  <div
    class="group relative shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
  >
    <!-- Image Section -->
    <div class="relative aspect-[4/3] overflow-hidden">
      <img
        v-if="product?.primaryImage"
        :src="product.primaryImage"
        :alt="product?.name"
        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
      />
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
      />

      <!-- Stock Badge -->
      <div
        v-if="product"
        class="absolute top-3 right-3 px-2 py-0.5 text-xs md:px-3 md:py-1 font-semibold shadow-lg"
        :class="
          product.inStock
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-red-100 text-red-800'
        "
      >
        {{ product.inStock ? 'In Stock' : 'Sold Out' }}
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-3 md:p-5 space-y-3 md:space-y-4">
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row justify-between items-start gap-1 md:gap-3"
      >
        <div class="flex-1 space-y-1">
          <h3
            class="font-semibold text-base md:text-lg leading-tight line-clamp-2 group-hover:text-violet-600 transition-colors"
          >
            {{ product?.name }}
          </h3>
        </div>

        <!-- Price -->
        <p class="text-lg md:text-xl font-bold text-violet-600">
          {{ product?.unitPrice }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 md:gap-3 pt-2">
        <button
          class="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 text-white px-3 py-2 text-xs md:px-4 md:py-2.5 transition-colors duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed group/button"
          :disabled="!product?.inStock"
          @click="addToCart"
        >
          <span class="text-sm font-semibold">
            {{ product?.inStock ? 'Add to Cart' : 'Out of Stock' }}
          </span>
        </button>

        <button
          class="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200 text-gray-600 hover:text-red-600"
          title="Remove from Wishlist"
          @click="removeFromWishlist"
        >
          <Trash2 class="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart'
import { useWishlistStore } from '~/store/wishlist'
import type { Tables, TablesInsert } from '~/types/database.types'
import { Trash2 } from 'lucide-vue-next'

interface Props {
  productId: number
}

type CartItem = TablesInsert<'cartItem'>
type Product = Tables<'products'> & {
  vendors: {
    name: string
  }
}

const props = defineProps<Props>()
const product = ref<Product | null>(null)

const { fetchProduct } = useApiServices()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

function addToCart() {
  if (!product.value?.inStock) return

  const cartItem: CartItem = {
    price: product.value?.unitPrice as number,
    productId: props.productId,
    quantity: 1,
    cartId: null,
  }
  cartStore.addToCart(cartItem)
}

function removeFromWishlist() {
  wishlistStore.removeFromWishList(props.productId)
}

onMounted(async () => {
  product.value = await fetchProduct(props.productId)
})
</script>
