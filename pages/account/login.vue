<template>
  <AuthContainer is-login>
    <form class="space-y-6" @submit="onSubmit">
      <div class="grid w-full items-center gap-4">
        <AuthInput
          name="email"
          label="Email"
          placeholder="Enter your email here"
          type="email"
        ></AuthInput>
        <AuthInput
          name="password"
          label="Password"
          placeholder="Enter your password here"
          type="password"
        ></AuthInput>
      </div>
      <span v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</span>
      <Button class="w-full" type="submit">Login</Button>
    </form>
  </AuthContainer>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const errorMsg = ref('')
const { loginSchema } = validators()

const { handleSubmit } = useForm({
  validationSchema: loginSchema,
  validateOnMount: false,
})

const onSubmit = handleSubmit(async (values) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })
  if (error) {
    throw createError({
      name: 'Login failed',
      message: error.message,
    })
  }
})

watchEffect(() => {
  if (user.value) {
    navigateTo('/')
  }
})
</script>

<style></style>
