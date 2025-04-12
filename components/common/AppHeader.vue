<script lang="ts" setup>
import {
  ShoppingBagIcon,
  CircleUserRoundIcon,
  MenuIcon,
  XIcon,
  HeartIcon,
} from 'lucide-vue-next'
import { useCartStore } from '~/store/cart'
import type { Tables } from '~/types/database.types'

type Product = Tables<'products'>

const searchKey = ref('')
const mobileMenuOpen = ref(false)
const user = useSupabaseUser()
const products = ref<Product[]>([])

const { searchProduct } = useApiServices()

const links = ref([
  { to: '/', label: 'HOME' },
  { to: '/about', label: 'ABOUT' },
  { to: '/collections/new-release', label: 'NEW RELEASES' },
  { to: '/pre-orders', label: 'PRE-ORDERS' },
  { to: '/collections/all', label: 'GENRES' },
  { to: '/faq', label: 'FAQ' },
])

const { totalQuantity, isMiniCartVisible } = storeToRefs(useCartStore())
const showMiniCart = () => {
  isMiniCartVisible.value = true
}

const hideMiniCart = () => {
  isMiniCartVisible.value = false
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const selectProduct = (product: Product) => {
  searchKey.value = ''
  navigateTo(`/products/${product.slug}`)
}

const navigateToUser = () => {
  if (user.value) {
    navigateTo('/account/profile')
  } else {
    navigateTo('/account/login')
  }
}

const navigateToWishlist = () => {
  navigateTo('/wishlist')
}

watchDebounced(
  searchKey,
  async (value) => {
    if (value.length > 1) {
      products.value = await searchProduct(value)
    } else {
      products.value = []
    }
  },
  {
    debounce: 300,
  },
)
</script>

<template>
  <header class="sticky top-0 z-[1000] bg-background">
    <div class="px-4 sm:px-6 lg:px-16 mx-auto py-3">
      <div class="flex items-center">
        <div class="flex items-center flex-1">
          <CommonAppLogo class="h-8 w-auto mx-auto sm:mx-0 sm:h-10" />
          <div class="hidden sm:block mx-4 lg:mx-8 flex-1">
            <CommonAppSearchBar v-model="searchKey" class="w-full" />
          </div>
          <ProductResultsDropdown :products @select="selectProduct" />
        </div>
        <div class="flex items-center">
          <ul class="flex gap-1 items-center">
            <li class="hidden sm:block">
              <div
                class="p-2 hover:text-violet-600 cursor-pointer"
                @click="navigateToWishlist"
              >
                <HeartIcon class="sm:h-5 sm:w-5" />
                <span class="sr-only">Wishlist</span>
              </div>
            </li>
            <li class="hidden sm:block">
              <div
                class="p-2 hover:text-violet-600 cursor-pointer"
                @click="navigateToUser"
              >
                <CircleUserRoundIcon class="sm:h-5 sm:w-5" />
                <span class="sr-only">Profile</span>
              </div>
            </li>

            <li>
              <CommonAppColorMode class="p-2" />
            </li>
            <li
              class="relative"
              @mouseenter.stop="showMiniCart"
              @mouseleave.stop="hideMiniCart"
            >
              <div class="p-2 hover:text-violet-600 cursor-pointer">
                <ShoppingBagIcon class="sm:h-5 sm:w-5" />
                <div
                  v-if="totalQuantity > 0"
                  class="absolute top-1 right-0 rounded-full bg-violet-600 h-4 w-4 flex items-center justify-center text-white text-[0.6rem]"
                >
                  {{ totalQuantity }}
                </div>
                <span class="sr-only">Cart</span>
              </div>
              <CartDropdown
                v-show="isMiniCartVisible"
                class="absolute right-0 top-full"
              />
            </li>
          </ul>
        </div>
        <div class="sm:hidden order-first">
          <button class="p-2 hover:text-violet-600" @click="toggleMobileMenu">
            <MenuIcon v-if="!mobileMenuOpen" class="h-6 w-6" />
            <XIcon v-else class="h-6 w-6" />
            <span class="sr-only">Menu</span>
          </button>
        </div>
      </div>
      <div class="sm:hidden mt-2">
        <CommonAppSearchBar v-model="searchKey" class="w-full" />
      </div>
      <nav class="hidden sm:flex mt-4 justify-center items-center">
        <ul class="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 justify-center">
          <li v-for="link in links" :key="link.label">
            <CommonAppLink class="text-sm font-light" :to="link.to">{{
              link.label
            }}</CommonAppLink>
          </li>
        </ul>
      </nav>
    </div>
    <!-- Mobile menu -->
    <transition name="fade">
      <div v-if="mobileMenuOpen" class="sm:hidden">
        <nav class="px-4 py-2 space-y-1">
          <CommonAppLink
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="block px-3 py-2 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="mobileMenuOpen = false"
          >
            {{ link.label }}
          </CommonAppLink>
        </nav>
      </div>
    </transition>
  </header>
</template>

<style lang="scss" scoped>
.fade-enter-active {
  animation: slide-in 0.6s cubic-bezier(0.17, 0.84, 0.44, 1.05) forwards;
}

.fade-leave-active {
  animation: slide-out 0.6s cubic-bezier(0.6, -0.28, 0.74, 0.05) forwards;
}

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateY(-40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px);
  }
}
.mobile-menu {
  nav {
    a {
      opacity: 0;
      transform: translateX(-10px);
      animation: fade-slide-in 0.6s ease forwards;

      @for $i from 1 through 10 {
        &:nth-child(#{$i}) {
          animation-delay: #{0.05 * $i}s;
        }
      }
    }
  }
}

@keyframes fade-slide-in {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
