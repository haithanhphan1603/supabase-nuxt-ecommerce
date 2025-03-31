<template>
  <Card class="h-full border-none">
    <div
      ref="myHoverableElement"
      class="rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 relative"
    >
      <NuxtLink :to="`/products/${product.slug}`">
        <AspectRatio :ratio="1" class="flex justify-center items-center">
          <img loading="lazy" :src="product.primaryImage" :alt="product.name" />
        </AspectRatio>
        <Button
          v-if="isHovered"
          class="w-full font-extrabold absolute bottom-0 uppercase text-xs sm:text-sm"
          @click.stop.prevent="addToCart"
        >
          <div>Add to cart</div>
          <Loader v-if="isLoading" class="ml-2 h-4 w-4" />
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                class="absolute top-2 right-2 p-1 sm:p-2 bg-transparent hover:bg-none"
                @click.stop.prevent="toggleWishList"
              >
                <HeartIcon
                  v-if="!isOnWishList"
                  :height="isMobile ? '1.25rem' : '1.75rem'"
                  :width="isMobile ? '1.25rem' : '1.75rem'"
                  :color="heartIconColor"
                  stroke-width="1.5"
                />
                <HeartIcon
                  v-else
                  :height="isMobile ? '1.25rem' : '1.75rem'"
                  :width="isMobile ? '1.25rem' : '1.75rem'"
                  color="#4f46e5"
                  fill="#4f46e5"
                  stroke-width="1.5"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <span>{{
                isOnWishList ? 'Remove from wishlist' : 'Add to wishlist'
              }}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </NuxtLink>
    </div>
    <CommonAppLink
      :to="`/products/${product.slug}`"
      class="text-base lg:text-lg font-semibold text-slate-800 mt-2 sm:mt-3 lg:mt-4 dark:text-slate-50 line-clamp-2"
    >
      {{ product.name }}
    </CommonAppLink>
    <CommonAppLink
      to="vendors"
      class="text-sm lg:text-base text-slate-950 dark:text-slate-50"
    >
      {{ product.vendors?.name }}
    </CommonAppLink>
    <span class="text-sm font-semibold text-slate-400 dark:text-slate-400">
      {{ product.productType }}
    </span>
    <p class="text-base font-semibold text-slate-600 dark:text-slate-300 mt-0">
      {{ product.currency }}{{ product.unitPrice }}
    </p>
    <DialogAuthDialog v-model="isDialogOpen" />
  </Card>
</template>

<script setup lang="ts">
import { useElementHover, useWindowSize } from '@vueuse/core'
import { HeartIcon, Loader } from 'lucide-vue-next'
import Card from '../ui/card/Card.vue'
import AspectRatio from '../ui/aspect-ratio/AspectRatio.vue'
import { useCartStore } from '~/store/cart'
import { useWishlistStore } from '~/store/wishlist'
import type { Tables, TablesInsert } from '~/types/database.types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { v4 as uuidv4 } from 'uuid'

type Product = Tables<'products'> & {
  vendors: { name: string }
}

type CartItem = TablesInsert<'cartItem'>

interface Props {
  product: Product
}

const props = defineProps<Props>()

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const user = useSupabaseUser()

const { wishlist } = storeToRefs(wishlistStore)

const myHoverableElement = ref<HTMLElement | null>(null)
const isHovered = useElementHover(myHoverableElement)
const isLoading = ref(false)
const colorMode = useColorMode()
const isOnWishList = computed(() =>
  wishlist.value.some((w) => w.product_id === props.product.id),
)
const isDialogOpen = ref(false)

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 640)

const heartIconColor = computed(() => {
  return colorMode.value === 'light' ? '#2d2d2d' : '#FFFFFF'
})

function toggleWishList() {
  if (!user.value) {
    isDialogOpen.value = true
    return
  }
  if (isOnWishList.value) {
    removeFromWishList()
  } else {
    addToWishList()
  }
}

function addToWishList() {
  wishlistStore.addToWishlist(props.product.id)
}

function removeFromWishList() {
  wishlistStore.removeFromWishList(props.product.id)
}

function addToCart() {
  isLoading.value = true
  const cartItem: CartItem = {
    price: props.product.unitPrice as number,
    productId: props.product.id,
    quantity: 1,
    cartId: null,
    id: uuidv4(),
  }
  cartStore.addToCart(cartItem)
  isLoading.value = false
}
</script>

<style scoped></style>
