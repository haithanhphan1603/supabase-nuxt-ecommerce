import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = event.context.supabase as SupabaseClient<Database>
  const addressId = event.context.params?.id as string
  const body = await readBody(event)
  const { data, error } = await client
    .from('addresses')
    .update({
      address: body.address,
      city: body.city,
      country: body.country,
      name: body.name,
      zipcode: body.zipcode,
    })
    .eq('id', addressId)
    .select()
    .single()
  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }
  return { address: data }
})
