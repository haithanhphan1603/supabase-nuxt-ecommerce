import Stripe from 'stripe'
import { serverSupabaseClient } from '#supabase/server'
import { defineEventHandler, readBody, useRuntimeConfig } from '#imports'
import type { TablesInsert } from '~/types/database.types'

type CartItem = TablesInsert<'cartItem'>

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
    apiVersion: '2025-03-31.basil',
  })

  const supabase = await serverSupabaseClient(event)
  const body = await readBody(event)
  const { items }: { items: CartItem[] } = body

  // Fetch product data for all items
  const productIds = items.map((item) => item.productId)
  const { data: products, error } = await supabase
    .from('product')
    .select('id, name, image, currency')
    .in('id', productIds)

  if (error || !products) {
    console.error('Error fetching product info:', error)
    return { error: 'Unable to fetch product data' }
  }

  const line_items = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)

    if (!product) {
      throw new Error(`Product not found for ID: ${item.productId}`)
    }

    return {
      price_data: {
        currency: product.currency || 'usd',
        product_data: {
          name: product.name,
          images: product.image ? [product.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${config.public.siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.public.siteUrl}/cancel`,
  })

  return { id: session.id }
})
