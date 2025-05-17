<template>
  <Card>
    <CardHeader>
      <CardTitle>Account</CardTitle>
      <CardDescription>
        Make changes to your account here. Click save when you're done.
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-2">
      <form @submit.prevent="onSubmit">
        <div class="space-y-4">
          <FormInput
            type="text"
            label="First Name"
            name="firstName"
            placeholder="Enter your new first name"
          />
          <FormInput
            type="text"
            label="Last Name"
            name="lastName"
            placeholder="Enter your new last name"
          />
          <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
        </div>
      </form>
    </CardContent>
    <CardFooter class="grid grid-cols-2 gap-4">
      <Button type="button" @click="onSubmit">Save changes</Button>
      <Button variant="outline" type="button" @click="resetForm">Cancel</Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import FormInput from './Input.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '../ui/toast'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const errorMsg = ref('')

// Define validation schema
const userInfoSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
})

const { toast } = useToast()

// Initialize form with vee-validate
const { handleSubmit, resetForm } = useForm({
  validationSchema: userInfoSchema,
  initialValues: {
    firstName: user.value?.user_metadata?.firstName || '',
    lastName: user.value?.user_metadata?.lastName || '',
  },
})

// Form submission handler
const onSubmit = handleSubmit(async (values) => {
  try {
    errorMsg.value = ''
    const { error } = await supabase.auth.updateUser({
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
      },
    })

    if (error) {
      errorMsg.value = error.message
      return
    }

    toast({
      variant: 'success',
      description: 'Your profile has been updated',
      title: 'Profile updated',
    })
  } catch (err) {
    errorMsg.value =
      err instanceof Error ? err.message : 'An unexpected error occurred'
  }
})
</script>

<style></style>
