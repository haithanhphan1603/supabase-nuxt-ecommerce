import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const stripe = new Stripe(config.stripeSecretKey, {
      apiVersion: '2025-03-31.basil',
    })

    const body = await readBody(event)
    const { amount, currency = 'usd', metadata = {} } = body

    if (!amount || amount <= 0) {
      return createError({ statusCode: 400, message: 'Invalid amount' })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
    })

    return {
      clientSecret: paymentIntent.client_secret,
    }
  } catch (err) {
    console.error('Payment Intent creation failed:', err)
    return createError({
      statusCode: 500,
      message: 'Unable to create payment intent',
    })
  }
})
