<template>
  <Card>
    <CardHeader>
      <CardTitle>Account</CardTitle>
      <CardDescription>
        Make changes to your account here. Click save when you're done.
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-2">
      <form @submit="onSubmit">
        <FormInput
          type="text"
          label="First Name"
          name="firstName"
          placeholder="Enter your new first name"
        >
        </FormInput>
        <FormInput
          type="text"
          label="Last Name"
          name="lastName"
          placeholder="Enter your new last name"
        >
        </FormInput>
      </form>
    </CardContent>
    <CardFooter class="grid grid-cols-2 gap-4">
      <Button type="submit">Save changes</Button>
      <Button variant="outline" type="button" @click="resetForm">Cancel</Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
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

const { userInfoSchema } = validators()

const { toast } = useToast()

// Initialize form with vee-validate
const { handleSubmit, resetForm } = useForm({
  validationSchema: userInfoSchema,
  initialValues: {
    firstName: user.value?.user_metadata.firstName || '',
    lastName: user.value?.user_metadata.lastName || '',
  },
})

// Form submission handler
const onSubmit = handleSubmit(async (values) => {
  const { error } = await supabase.auth.updateUser({
    data: {
      firstName: values.firstName,
      lastName: values.lastName,
    },
  })
  if (error) {
    errorMsg.value = error.message
    throw createError({
      name: 'Update failed',
      message: error.message,
    })
  }
  toast({
    variant: 'success',
    description: 'Your profile has been updated',
    title: 'Profile updated',
  })
})
</script>

<style></style>
