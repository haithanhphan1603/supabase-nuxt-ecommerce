<template>
  <Card class="h-full border-none">
    <div
      ref="myHoverableElement"
      class="rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 relative"
      @touchstart="handleTouchStart"
    >
      <NuxtLink :to="`/products/${product.slug}`">
        <AspectRatio :ratio="1" class="flex justify-center items-center">
          <img
            loading="lazy"
            :src="product.primaryImage ?? ''"
            :alt="product.name"
          />
        </AspectRatio>
        <Button
          v-show="showAddToCartButton"
          class="w-full font-extrabold absolute bottom-0 uppercase text-xs sm:text-sm"
          @click.stop.prevent="addToCart"
        >
          <div>Add to cart</div>
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
import { useElementHover } from '@vueuse/core'
import { HeartIcon } from 'lucide-vue-next'
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

type Product = Tables<'products'> & {
  vendors: { name: string }
}
type CartItem = TablesInsert<'cartItems'>

interface Props {
  product: Product
}
const props = defineProps<Props>()

// Store instances
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const { wishlist } = storeToRefs(wishlistStore)

// Composables and global state
const user = useSupabaseUser()
const colorMode = useColorMode()
const { isMobile } = useUtilities()
const { activeProductId, setActiveProduct } = useActiveTouchProduct()

// Local refs
const myHoverableElement = ref<HTMLElement | null>(null)
const isDialogOpen = ref(false)

// Computed properties - hover states
const isDesktopHovered = useElementHover(myHoverableElement)
const isMobileHovered = computed(
  () => activeProductId.value === props.product.id,
)
const showAddToCartButton = computed(
  () => isDesktopHovered.value || isMobileHovered.value,
)

// Computed properties - UI
const isOnWishList = computed(() =>
  wishlist.value.some((w) => w.product_id === props.product.id),
)
const heartIconColor = computed(() =>
  colorMode.value === 'light' ? '#2d2d2d' : '#FFFFFF',
)

function handleTouchStart() {
  if (isMobile.value) {
    setActiveProduct(props.product.id)
  }
}

// Wishlist operations
function toggleWishList() {
  if (!user.value) {
    isDialogOpen.value = true
    return
  }

  isOnWishList.value ? removeFromWishList() : addToWishList()
}
function addToWishList() {
  wishlistStore.addToWishlist(props.product.id)
}
function removeFromWishList() {
  wishlistStore.removeFromWishList(props.product.id)
}

function addToCart() {
  const cartItem: CartItem = {
    price: props.product.unitPrice as number,
    productId: props.product.id,
    quantity: 1,
    id: crypto.randomUUID(),
  }

  cartStore.addToCart(cartItem)
}
</script>
