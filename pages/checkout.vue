<template>
  <div class="container max-sm:px-2 mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold mb-8 uppercase">Checking out</h2>

    <div class="flex flex-col md:flex-row gap-8">
      <div class="w-full md:w-1/2">
        <div class="sm:p-6 rounded-lg">
          <h3 class="text-xl font-semibold mb-4">Payment Details</h3>
          <form id="payment-form" @submit.prevent="handleSubmit">
            <div id="link-authentication-element" class="mb-4" />
            <div id="payment-element" class="mb-6" />
            <Button id="submit" class="w-full" :disabled="isLoading">
              <span v-if="isLoading" class="inline-block mr-2">
                <Loader class="spinner" />
              </span>
              {{ isLoading ? 'Processing...' : 'Pay Now' }}
            </Button>
            <div v-if="messages.length" class="mt-4 text-red-600">
              <p v-for="(message, index) in messages" :key="index">
                {{ message }}
              </p>
            </div>
          </form>
        </div>
      </div>

      <div class="w-full max-sm:order-first md:w-1/2">
        <div class="sm:p-6 rounded-lg">
          <h3 class="text-xl font-semibold mb-4">Order Summary</h3>
          <div v-if="products.length" class="divide-y divide-gray-200">
            <div
              v-for="(item, index) in mergedItems"
              :key="index"
              class="py-4 flex items-center"
            >
              <div class="w-16 h-16 bg-gray-200 rounded flex-shrink-0 mr-4">
                <img
                  v-if="item.primaryImage"
                  :src="item.primaryImage"
                  :alt="item.name"
                  class="w-full h-full object-cover rounded"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-400"
                >
                  <span>No image</span>
                </div>
              </div>
              <div class="flex-grow">
                <h4 class="font-medium">{{ item.name }}</h4>
                <p class="text-gray-500 text-sm">Qty: {{ item.quantity }}</p>
              </div>
              <div class="ml-4 font-medium">
                {{ formatCurrency(item.price * item.quantity) }}
              </div>
            </div>
          </div>

          <div v-else class="py-8 text-center text-gray-500">
            Your cart is empty
          </div>

          <div class="sm:pt-6 pt-4 border-t border-gray-200">
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Subtotal</span>
              <span>{{ formatCurrency(cart?.totalprice || 0) }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Shipping</span>
              <span>{{ formatCurrency(0) }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Tax</span>
              <span>{{ formatCurrency(0) }}</span>
            </div>
            <div
              class="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-gray-200"
            >
              <span>Total</span>
              <span>{{ formatCurrency(cart?.totalprice || 0) }}</span>
            </div>
          </div>
        </div>

        <div class="mt-6 sm:p-6 rounded-lg">
          <h4 class="font-medium mb-2">Secure Checkout</h4>
          <p class="text-sm text-slate-400">
            You can test your payment with the following test card numbers with
            any future expiration date and any CVC:
          </p>
          <ul class="list-disc pl-5 mt-2 text-sm text-slate-400">
            <li>Visa: 4242 4242 4242 4242</li>
            <li>MasterCard: 5555 5555 5555 4444</li>
            <li>American Express: 3782 8224 6310 005</li>
            <li>Discover: 6011 1111 1111 1117</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  loadStripe,
  type Stripe,
  type StripeElements,
  type StripePaymentElementOptions,
} from '@stripe/stripe-js'
import { useCartStore } from '~/store/cart'
import { Loader } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import type { Database } from '~/types/database.types'
import type { QueryData } from '@supabase/supabase-js'

definePageMeta({
  middleware: 'auth',
})

const isLoading = ref(false)
const messages = ref<string[]>([])

let stripe: Stripe | null = null
let elements: StripeElements | null = null

const cartStore = useCartStore()
const { cart, cartItems } = storeToRefs(cartStore)
const supabase = useSupabaseClient<Database>()

const productWithVendorQuery = supabase
  .from('products')
  .select('id, name, vendors(name), primaryImage')

type Product = QueryData<typeof productWithVendorQuery>

const productIds = computed(() => cartItems.value.map((item) => item.productId))
const products = ref<Product>([])

const fetchProducts = async () => {
  const { data, error } = await productWithVendorQuery.in(
    'id',
    productIds.value,
  )

  if (error) {
    createError({ name: 'Product fetch error', message: error.message })
    return
  }

  products.value = data
}

// Currency formatter
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

const mergedItems = computed(() => {
  return cartItems.value.map((cartItems) => {
    const product = products.value.find((p) => p.id === cartItems.productId)
    return {
      ...product,
      quantity: cartItems.quantity,
      price: cartItems.price,
    }
  })
})

watch(cartItems, fetchProducts, {
  immediate: true,
})

onMounted(async () => {
  const config = useRuntimeConfig()
  const publishableKey = config.public.stripePublishableKey
  stripe = await loadStripe(publishableKey)

  const { clientSecret, error: backendError } = await $fetch<{
    clientSecret: string | null
    error?: { message: string }
  }>('/api/stripe/payment-intent', {
    method: 'POST',
    body: {
      currency: 'usd',
      amount: cart.value?.totalprice,
    },
  })

  if (backendError) {
    messages.value.push(backendError.message)
  }

  if (!stripe || !clientSecret) {
    messages.value.push('Stripe.js has not loaded yet.')
    return
  }

  const options: StripePaymentElementOptions = {
    layout: {
      type: 'accordion',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: true,
    },
  }

  elements = stripe.elements({ clientSecret })

  const paymentElement = elements.create('payment', options)
  paymentElement.mount('#payment-element')

  const linkAuthenticationElement = elements.create('linkAuthentication')
  linkAuthenticationElement.mount('#link-authentication-element')

  isLoading.value = false
})

const handleSubmit = async () => {
  if (isLoading.value || !stripe || !elements) return

  isLoading.value = true

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `${window.location.origin}/return`,
    },
  })

  if (error) {
    messages.value.push(
      error.message ?? 'An unexpected error occurred while processing payment.',
    )
  }

  isLoading.value = false
}
</script>

<style lang="scss" scoped>
#payment-form {
  width: 100%;
}

#payment-element {
  margin-bottom: 24px;
}

button#submit {
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
</style>
