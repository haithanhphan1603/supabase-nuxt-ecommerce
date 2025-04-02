<template>
  <div>
    <h1
      v-if="categoryName"
      class="text-violet-600 font-extrabold text-center text-2xl sm:text-3xl lg:text-4xl"
    >
      {{ upperCaseCategoryName }}
    </h1>
    <Skeleton v-else class="h-10 w-60 m-auto" />

    <div class="swiper-container relative mt-4 sm:mt-6 lg:mt-8">
      <Swiper
        v-if="products.length"
        ref="swiperRef"
        :slides-per-view="slidesPerView"
        :modules="[SwiperNavigation]"
        :space-between="20"
        :loop="true"
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="product in products" :key="product.id">
          <ProductCard :product="product" />
        </SwiperSlide>
      </Swiper>
      <div v-else class="flex gap-5 justify-center">
        <ProductCardSkeleton
          v-for="i in slidesPerView"
          :key="i"
          class="h-72 2xl:h-96 w-full"
        />
      </div>
      <Button
        class="absolute top-1/3 -left-2 sm:-left-3 lg:-left-5 z-50 p-2 rounded-full bg-violet-400"
        type="button"
        @click="swiperPrevSlide"
      >
        <MoveLeftIcon class="h-6" />
      </Button>
      <Button
        class="absolute top-1/3 -right-2 sm:-right-3 lg:-right-5 z-50 p-2 rounded-full bg-violet-400"
        type="button"
        @click="swiperNextSlide"
      >
        <MoveRightIcon class="h-6" />
      </Button>
    </div>
    <div class="text-center mt-4 sm:mt-6">
      <Button
        class="font-extrabold text-md sm:text-md py-4 sm:py-5 lg:py-6 px-16 sm:px-20 lg:px-28 bg-violet-950 hover:bg-violet-600 uppercase"
        @click="navigateToCategory"
      >
        see all
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Swiper as SwiperType } from 'swiper'
import Button from '../ui/button/Button.vue'
import { MoveRightIcon, MoveLeftIcon } from 'lucide-vue-next'
import type { QueryData } from '@supabase/supabase-js'

interface Props {
  categoryId: number
}
const props = defineProps<Props>()

const { width } = useWindowSize()
const supabase = useSupabaseClient()
const router = useRouter()

const categoryName = ref<string>('')
const categorySlug = ref<string>('')
const products = ref<ProductWithVendor[]>([])
const swiperInstance = ref()

const PRODUCTS_CATEGORIES = 'products_categories'
const productWithVendorQuery = supabase
  .from('products')
  .select('*,vendors(name)')
  .single()
type ProductWithVendor = QueryData<typeof productWithVendorQuery>

const upperCaseCategoryName = computed(() => {
  return categoryName.value.toUpperCase()
})

const slidesPerView = computed(() => {
  if (width.value < 640) {
    return 2
  } else if (width.value < 1024) {
    return 3
  } else {
    return 5
  }
})

function onSwiper(swiper: SwiperType) {
  swiperInstance.value = swiper
}

function swiperPrevSlide() {
  swiperInstance.value.slidePrev()
}

function swiperNextSlide() {
  swiperInstance.value.slideNext()
}

async function fetchCategoryName() {
  const { data, error } = await supabase
    .from('categories')
    .select('name,slug')
    .eq('id', props.categoryId)
    .single()
  if (error) {
    console.error(error)
  } else {
    categoryName.value = data.name
    categorySlug.value = data.slug ?? ''
  }
}

async function fetchProductsByCategoryId() {
  const { data, error } = await supabase
    .from(PRODUCTS_CATEGORIES)
    .select('*,products(*,vendors(name))')
    .eq('categoryId', props.categoryId)
    .limit(10)
  if (error) {
    console.error(error)
  } else {
    products.value = data
      .map((d) => d.products)
      .filter((product): product is ProductWithVendor => product !== null)
  }
}

function navigateToCategory() {
  router.push(`/collections/${categorySlug.value}`)
}

fetchProductsByCategoryId()
fetchCategoryName()

// Add event listener for window resize to update slidesPerView
onMounted(() => {
  window.addEventListener('resize', () => {
    if (swiperInstance.value) {
      swiperInstance.value.params.slidesPerView = slidesPerView.value
      swiperInstance.value.update()
    }
  })
})
</script>

<style scoped></style>
