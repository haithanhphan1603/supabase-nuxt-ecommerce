<template>
  <div class="container mx-auto px-4 my-6 md:my-12">
    <ClientOnly>
      <Toaster />
    </ClientOnly>
    <Head>
      <Title>{{ product?.name }}</Title>
    </Head>

    <div
      v-if="isLoading"
      class="grid grid-cols-1 md:grid-cols-[4fr,3fr] gap-8 md:gap-12"
    >
      <div class="relative group">
        <Skeleton class="object-contain w-full max-h-[520px] aspect-[4/3]" />
        <div class="absolute top-4 right-4 space-x-2">
          <Button
            class="p-2 bg-white/90 rounded-full shadow hover:bg-white transition"
          >
            <Heart class="text-red-600" />
          </Button>
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <Skeleton class="h-8 w-48" />
          <Skeleton class="h-12 w-full mt-2" />
          <div class="flex items-center gap-2 mt-3">
            <Skeleton class="h-10 w-32" />
          </div>
        </div>

        <Skeleton class="h-12 w-full md:w-48" />

        <div class="relative">
          <div class="space-y-2">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-4 w-5/6" />
          </div>
        </div>

        <div class="space-y-4 border-t pt-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Skeleton class="h-4 w-24 mb-2" />
              <Skeleton class="h-6 w-32" />
            </div>
            <div>
              <Skeleton class="h-4 w-24 mb-2" />
              <Skeleton class="h-6 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-[4fr,3fr] gap-8 md:gap-12">
      <!-- Image Section -->
      <div class="relative group">
        <img
          class="object-contain w-full max-h-[520px] aspect-[4/3]"
          :src="product?.primaryImage as string"
          :alt="product?.name"
        />
        <div class="absolute top-4 right-4 space-x-2">
          <Button
            class="p-2 bg-white/90 rounded-full shadow hover:bg-white transition"
          >
            <Heart class="text-red-600" />
          </Button>
        </div>
      </div>

      <!-- Product Details -->
      <div class="space-y-6">
        <!-- Vendor and Title -->
        <div>
          <AppLink
            :to="`/vendors/${product?.vendors?.name}`"
            class="text-lg md:text-xl text-violet-600 hover:text-violet-700 font-medium"
          >
            {{ product?.vendors?.name }}
          </AppLink>
          <h1 class="text-3xl md:text-4xl font-bold mt-2">
            {{ product?.name }}
          </h1>
          <div class="flex items-center gap-2 mt-3">
            <span class="text-2xl md:text-3xl font-bold text-violet-600">
              {{ product?.currency }} {{ product?.unitPrice }}
            </span>
          </div>
        </div>

        <Button
          class="w-full md:w-auto uppercase font-bold px-8 py-3 hover:bg-violet-700 transition-colors"
          @click="addToCart"
        >
          Add to Cart
        </Button>

        <div class="relative">
          <div
            ref="description"
            class="prose dark:prose-invert max-w-none overflow-hidden relative"
            :class="{ 'max-h-24': !showFullDescription }"
          >
            {{ product?.description }}
          </div>
          <div
            v-if="!showFullDescription && isOverflowing"
            class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-900"
          />
          <button
            v-if="isOverflowing"
            class="text-violet-600 font-medium hover:text-violet-700 mt-2"
            @click="toggleDescription"
          >
            {{ showFullDescription ? 'Read Less' : 'Read More' }}
          </button>
          <div
            v-if="!showFullDescription && isOverflowing"
            class="absolute bottom-0 left-0 right-0 h-12 z-20 cursor-pointer"
            @click="toggleDescription"
          />
        </div>

        <div class="space-y-4 border-t pt-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h3 class="font-medium text-gray-500 dark:text-gray-400">
                Format
              </h3>
              <p class="mt-1 font-medium">{{ product?.productType }} Vinyl</p>
            </div>
            <div>
              <h3 class="font-medium text-gray-500 dark:text-gray-400">
                Primary Genre
              </h3>
              <p class="mt-1 font-medium">
                {{ product?.primaryCategory?.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Skeleton -->
  </div>
</template>

<script lang="ts" setup>
import Toaster from '~/components/ui/toast/Toaster.vue'
import { useToast } from '~/components/ui/toast'
import AppLink from '~/components/common/AppLink.vue'
import type { QueryData } from '@supabase/supabase-js'
import { Heart } from 'lucide-vue-next'
import Skeleton from '~/components/ui/skeleton/Skeleton.vue'
import { useCartStore } from '~/store/cart'
import type { TablesInsert } from '~/types/database.types'

const { toast } = useToast()
const supabase = useSupabaseClient()
const route = useRoute()

const isLoading = ref(false)

const productWithVendorsCategoriesQuery = supabase
  .from('products')
  .select('*,vendors(name),primaryCategory:primaryCategoryId(name)')
  .eq('slug', route.params.slug as string)
  .single()

type ProductWithVendorsCategories = QueryData<
  typeof productWithVendorsCategoriesQuery
>

type CartItem = TablesInsert<'cartItem'>

const product = ref<ProductWithVendorsCategories | null>(null)

const showFullDescription = ref(false)
const description = ref<HTMLElement | null>(null)
const isOverflowing = ref(false)

const cartStore = useCartStore()
const { height } = useElementSize(description)

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value
}

function addToCart() {
  if (!product.value?.inStock) return

  const cartItem: CartItem = {
    price: product.value?.unitPrice as number,
    productId: product.value.id,
    quantity: 1,
  }
  cartStore.addToCart(cartItem)
}

watch(height, () => {
  if (description.value && description?.value?.scrollHeight > height.value) {
    isOverflowing.value = true
  }
})

async function fetchProduct() {
  isLoading.value = true
  const { data, error } = await productWithVendorsCategoriesQuery

  if (error) {
    console.log(error)
    toast({
      title: 'Uh oh! Something went wrong.',
      description: 'There was a problem with your request.',
      variant: 'destructive',
    })
  }
  product.value = data
  isLoading.value = false
}

fetchProduct()
</script>

<style>
.prose {
  transition: max-height 0.3s ease-in-out;
}
</style>
