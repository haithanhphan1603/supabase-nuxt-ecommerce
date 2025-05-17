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
        <Dialog v-model:open="isDialogOpen">
          <DialogTrigger as-child>
            <Button @click="openAddModal">Add address</Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{{
                isEditing ? 'Edit address' : 'Add new address'
              }}</DialogTitle>
              <DialogDescription>
                Fill in the details of your {{ isEditing ? '' : 'new' }} address
                below.
              </DialogDescription>
            </DialogHeader>
            <form @submit.prevent="onSubmit">
              <div class="space-y-4 py-2">
                <FormInput
                  type="text"
                  label="Name"
                  name="name"
                  placeholder="Enter your address name"
                />
                <FormInput
                  type="text"
                  label="Address"
                  name="address"
                  placeholder="Enter your address"
                />
                <FormInput
                  type="text"
                  label="City"
                  name="city"
                  placeholder="Enter your city"
                />
                <FormInput
                  type="text"
                  label="Zipcode"
                  name="zipcode"
                  placeholder="Enter your zipcode"
                />
                <FormInput
                  type="text"
                  label="Country"
                  name="country"
                  placeholder="Enter your country"
                />
                <p v-if="errorMsg" class="text-sm text-red-500">
                  {{ errorMsg }}
                </p>
              </div>

              <DialogFooter class="mt-4">
                <Button type="button" variant="outline" @click="closeDialog"
                  >Cancel</Button
                >
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div v-if="addresses.length" class="grid gap-4 md:grid-cols-2">
        <Card v-for="address in addresses" :key="address.id" class="relative">
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
              @click="confirmDeleteAddress(address.id)"
              >Delete</Button
            >
          </div>
        </Card>
      </div>

      <div v-else class="text-center py-8 text-sm text-muted-foreground">
        No addresses available.
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { Tables } from '~/types/database.types'
import { useToast } from '../ui/toast'
import FormInput from './Input.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Address = Tables<'addresses'>

const addresses = ref<Address[]>([])
const isDialogOpen = ref(false)
const currentAddressId = ref<string | null>(null)
const errorMsg = ref('')
const { toast } = useToast()

// Define validation schema
const addressSchema = yup.object({
  name: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  zipcode: yup.string().required('Zipcode is required'),
  country: yup.string().required('Country is required'),
})

const isEditing = computed(() => currentAddressId.value !== null)

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: addressSchema,
  initialValues: {
    name: '',
    address: '',
    city: '',
    zipcode: '',
    country: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    errorMsg.value = ''

    if (isEditing.value) {
      // Update existing address
      const { data, error } = await useFetch(
        `/api/supabase/address/${currentAddressId.value}`,
        {
          method: 'put',
          body: values,
        },
      )

      if (error.value) {
        errorMsg.value = 'Failed to update address'
        console.error('Error updating address:', error.value)
        return
      }

      if (data.value) {
        // Update the address in the list
        const index = addresses.value.findIndex(
          (a) => a.id === currentAddressId.value,
        )
        if (index !== -1) {
          addresses.value[index] = data.value.address
        }

        toast({
          title: 'Success',
          description: 'Address updated successfully',
          variant: 'success',
        })
      }
    } else {
      // Add new address
      const { data, error } = await useFetch(`/api/supabase/address`, {
        method: 'POST',
        body: values,
      })

      if (error.value) {
        errorMsg.value = 'Failed to add address'
        console.error('Error adding address:', error.value)
        return
      }

      if (data.value) {
        addresses.value.push(data.value.address)

        toast({
          title: 'Success',
          description: 'Address added successfully',
          variant: 'success',
        })
      }
    }

    // Close dialog and reset form
    closeDialog()
  } catch (err) {
    errorMsg.value =
      err instanceof Error ? err.message : 'An unexpected error occurred'
  }
})

function openAddModal() {
  currentAddressId.value = null
  resetForm()
  isDialogOpen.value = true
}

function editAddress(address: Address) {
  currentAddressId.value = address.id
  setValues({
    name: address.name,
    address: address.address,
    city: address.city,
    zipcode: address.zipcode,
    country: address.country,
  })
  isDialogOpen.value = true
}

function closeDialog() {
  isDialogOpen.value = false
  resetForm()
  currentAddressId.value = null
  errorMsg.value = ''
}

async function confirmDeleteAddress(id: string) {
  if (confirm('Are you sure you want to delete this address?')) {
    await deleteAddress(id)
  }
}

async function deleteAddress(id: string) {
  try {
    const { error } = await useFetch(`/api/supabase/address/${id}`, {
      method: 'DELETE',
    })

    if (error.value) {
      toast({
        title: 'Error',
        description: 'Failed to delete address',
        variant: 'destructive',
      })
      console.error('Error deleting address:', error.value)
      return
    }

    addresses.value = addresses.value.filter((address) => address.id !== id)

    toast({
      title: 'Success',
      description: 'Address deleted successfully',
      variant: 'success',
    })
  } catch (err) {
    console.error('Error deleting address:', err)
    toast({
      title: 'Error',
      description: 'Failed to delete address',
      variant: 'destructive',
    })
  }
}

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleDateString()
}

async function fetchAddresses() {
  try {
    const { data, error } = await useFetch(`/api/supabase/address`)

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
  } catch (err) {
    console.error('Error fetching addresses:', err)
    toast({
      title: 'Error',
      description: 'Failed to fetch addresses',
      variant: 'destructive',
    })
  }
}

// Fetch addresses on component mount
fetchAddresses()
</script>

<style scoped></style>
