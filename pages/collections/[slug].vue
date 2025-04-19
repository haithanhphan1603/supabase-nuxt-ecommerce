<template>
  <div ref="collectionRef" class="container mx-auto px-4 sm:px-6 lg:px-8">
    <Head>
      <Title>{{ category?.name }}</Title>
    </Head>
    <div class="flex flex-col md:flex-row md:space-x-8">
      <div class="w-full md:w-1/4 mb-6 md:mb-0">
        <CategoryFilter v-model="searchInfo" class="sticky top-4" />
      </div>
      <div class="w-full md:w-3/4">
        <h1
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase mb-6 sm:mb-8"
        >
          {{ category?.name }}
        </h1>
        <Separator />
        <div class="flex items-center justify-between my-2">
          <span class="text-xl font-normal italic">
            {{ totalProducts }} Products
          </span>

          <Select v-model="searchInfo.limit">
            <SelectTrigger class="w-[60px]">
              <SelectValue :placeholder="searchInfo.limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="option in paginationOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Separator />

        <div
          class="grid gap-4 sm:gap-6 lg:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 py-6 sm:py-8 lg:py-10"
        >
          <template v-if="products.length > 0">
            <div v-for="product in products" :key="product.id">
              <ProductCard :product="product" />
            </div>
          </template>

          <template v-if="isLoading">
            <ProductCardSkeleton
              v-for="i in 4"
              :key="i"
              class="h-48 sm:h-52 lg:h-60 w-full"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Tables } from '~/types/database.types'
import type { CollectionSearchParams } from '~/types/search.types'
import { SortBy } from '~/types/search.types'
import { useApiServices } from '~/composables/apiServices'
import { Separator } from '~/components/ui/separator'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

// Array of pagination options
const paginationOptions = [4, 8, 12, 16, 20]

const supabase = useSupabaseClient()
const slug = useRoute().params.slug
const { getProductsByCategory, getTotalProductsByCategory } = useApiServices()

const collectionRef = useTemplateRef<HTMLElement>('collectionRef')

const category = ref<Tables<'categories'>>()
const products = ref<Tables<'products'>[]>([])
const totalProducts = ref<number>(0)

const isLoading = ref(false)

const searchInfo = reactive<CollectionSearchParams>({
  start: 0,
  limit: 8,
  sortBy: SortBy.MANUAL,
  productType: [],
})

async function fetchCategory() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
  if (error) {
    console.error(error)
  } else {
    category.value = data[0]
  }
}

async function fetchTotalProducts() {
  totalProducts.value =
    (await getTotalProductsByCategory(category.value?.id ?? 0, searchInfo)) || 0
}

async function fetchProducts() {
  try {
    isLoading.value = true

    const fetchedProducts = await getProductsByCategory(
      category.value?.id ?? 0,
      searchInfo,
    )
    products.value = [...products.value, ...fetchedProducts]
    isLoading.value = false
  } catch (error) {
    console.error(error)
  }
}

async function fetchData() {
  await fetchCategory()
  await fetchTotalProducts()
  await fetchProducts()
}

function handleScroll(_e: Event) {
  if (collectionRef.value) {
    const element = collectionRef.value
    if (products.value.length >= (totalProducts.value ?? 0)) {
      return
    }
    if (element.getBoundingClientRect().bottom < window.innerHeight) {
      searchInfo.start = searchInfo.start + searchInfo.limit
      fetchProducts()
    }
  }
}

const debouncedHandleScroll = useDebounce(handleScroll, 300)

watch(
  [
    () => searchInfo.productType,
    () => searchInfo.sortBy,
    () => searchInfo.limit,
  ],
  async () => {
    products.value = [] // Reset products array
    searchInfo.start = 0
    await fetchTotalProducts()
    await fetchProducts()
  },
  {
    deep: true,
  },
)

fetchData()

onMounted(() => {
  window.addEventListener('scroll', debouncedHandleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', debouncedHandleScroll)
})
</script>
