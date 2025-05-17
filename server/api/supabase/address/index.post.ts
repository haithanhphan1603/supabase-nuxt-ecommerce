import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = event.context.supabase as SupabaseClient<Database>
  const user = await serverSupabaseUser(event)
  const body = await readBody(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  const { data, error } = await client
    .from('addresses')
    .insert({
      userId: user.id,
      address: body.address,
      city: body.city,
      country: body.country,
      name: body.name,
      zipcode: body.zipcode,
      created_at: new Date().toISOString(),
    })
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
