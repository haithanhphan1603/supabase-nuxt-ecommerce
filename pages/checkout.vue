<script setup>
import { loadStripe } from '@stripe/stripe-js'
import { useCartStore } from '~/store/cart'
import { Loader } from 'lucide-vue-next'

const isLoading = ref(false)
const messages = ref([])

let stripe
let elements

const cartStore = useCartStore()
const { cart, cartItems } = storeToRefs(cartStore)

// Computed property to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

onMounted(async () => {
  const config = useRuntimeConfig()
  const publishableKey = config.public.stripePublishableKey
  stripe = await loadStripe(publishableKey)

  const { clientSecret, error: backendError } = await $fetch(
    '/api/stripe/payment-intent',
    {
      method: 'POST',
      body: {
        currency: 'usd',
        amount: cart.value?.totalprice,
      },
    },
  )

  if (backendError) {
    messages.value.push(backendError.message)
  }

  const options = {
    layout: {
      type: 'accordion',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: true,
    },
  }

  elements = stripe.elements({ clientSecret, appearance: options })
  const paymentElement = elements.create('payment', options)
  paymentElement.mount('#payment-element')
  const linkAuthenticationElement = elements.create('linkAuthentication')
  linkAuthenticationElement.mount('#link-authentication-element')
  isLoading.value = false
})

const handleSubmit = async () => {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `${window.location.origin}/return`,
    },
  })

  if (error.type === 'card_error' || error.type === 'validation_error') {
    messages.value.push(error.message)
  } else {
    messages.value.push('An unexpected error occured.')
  }

  isLoading.value = false
}
</script>
<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold mb-8 uppercase">Checking out</h2>

    <div class="flex flex-col md:flex-row gap-8">
      <div class="w-full md:w-1/2">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-4">Payment Details</h3>
          <form id="payment-form" @submit.prevent="handleSubmit">
            <div id="link-authentication-element" class="mb-4" />
            <div id="payment-element" class="mb-6" />
            <button
              id="submit"
              :disabled="isLoading"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200"
            >
              <span v-if="isLoading" class="inline-block mr-2">
                <Loader class="spinner" />
              </span>
              {{ isLoading ? 'Processing...' : 'Pay Now' }}
            </button>
            <div v-if="messages.length" class="mt-4 text-red-600">
              <p v-for="(message, index) in messages" :key="index">
                {{ message }}
              </p>
            </div>
          </form>
        </div>
      </div>

      <!-- Order Summary Section -->
      <div class="w-full md:w-1/2">
        <div class="p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-4">Order Summary</h3>

          <div v-if="cartItems.length" class="divide-y divide-gray-200">
            <div
              v-for="(item, index) in cartItems"
              :key="index"
              class="py-4 flex items-center"
            >
              <div class="w-16 h-16 bg-gray-200 rounded flex-shrink-0 mr-4">
                <img
                  v-if="item.image"
                  :src="item.image"
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

          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Subtotal</span>
              <span>{{ formatCurrency(cart?.totalprice || 0) }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Shipping</span>
              <span>{{ formatCurrency(cart?.shipping || 0) }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Tax</span>
              <span>{{ formatCurrency(cart?.tax || 0) }}</span>
            </div>
            <div
              class="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-gray-200"
            >
              <span>Total</span>
              <span>{{ formatCurrency(cart?.totalprice || 0) }}</span>
            </div>
          </div>
        </div>

        <div class="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h4 class="font-medium mb-2">Secure Checkout</h4>
          <p class="text-sm text-gray-600">
            Your payment information is processed securely. We do not store
            credit card details.
          </p>
          <div class="mt-4 flex items-center">
            <span class="text-sm text-gray-600">Secure SSL Encryption</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
