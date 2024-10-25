<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold mb-8">
      YOUR VINY<span class="text-violet-600">LATA</span> WISHLIST
    </h2>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="item in wishlist" :key="item.id as string">
        <WishlistItem :product-id="item.product_id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWishlistStore } from '~/store/wishlist'

definePageMeta({
  middleware: 'auth',
})

const wishlistStore = useWishlistStore()
const { wishlist } = storeToRefs(wishlistStore)
</script>

<style></style>
