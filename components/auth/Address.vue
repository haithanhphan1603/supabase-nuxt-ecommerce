<template>
  <Card>
    <CardHeader>
      <CardTitle>Addresses Management</CardTitle>
      <CardDescription>
        Manage your addresses here. You can add, edit, or delete addresses.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div class="mb-4">
        <Button @click="openAddModal">Add Address</Button>
      </div>

      <div v-if="addresses.length" class="grid gap-4 grid-cols-2">
        <Card v-for="address in addresses" :key="address.id">
          <CardHeader>
            <CardTitle>{{ address.name }}</CardTitle>
            <CardDescription class="text-xs text-muted-foreground">
              {{ formatDate(address.created_at) }}
            </CardDescription>
          </CardHeader>
          <CardContent class="text-sm space-y-1">
            <p><strong>Address:</strong> {{ address.address }}</p>
            <p><strong>Zipcode:</strong> {{ address.zipcode }}</p>
            <p><strong>City:</strong> {{ address.city }}</p>
            <p><strong>Country:</strong> {{ address.country }}</p>
          </CardContent>
          <div class="flex justify-end gap-2 p-4 pt-0">
            <Button variant="ghost" size="sm" @click="editAddress(address)"
              >Edit</Button
            >
            <Button
              variant="destructive"
              size="sm"
              @click="deleteAddress(address.id)"
              >Delete</Button
            >
          </div>
        </Card>
      </div>

      <div v-else class="text-sm text-muted-foreground">
        No addresses available.
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types'
import { toast } from '../ui/toast'

type Address = Tables<'addresses'>

const addresses = ref<Address[]>([])
const user = useSupabaseUser()

function openAddModal() {
  // show modal for adding address
}

function editAddress(address: Address) {
  // open modal with data
}

function deleteAddress(id: string) {
  addresses.value = addresses.value.filter((a) => a.id !== id)
}

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleDateString()
}

async function fetchAddresses() {
  const userId = user.value?.id
  const { data, error } = await useFetch(`/api/supabase/address/${userId}`)
  if (error.value) {
    toast({
      title: 'Error',
      description: 'Failed to fetch addresses',
      variant: 'destructive',
    })
    console.error('Error fetching addresses:', error.value)
    return
  }
  addresses.value = data.value?.address || []
}

fetchAddresses()
</script>

<style scoped></style>
