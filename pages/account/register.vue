<template>
  <AuthContainer>
    <form class="space-y-6" @submit="onSubmit">
      <div class="grid w-full items-center gap-4">
        <AuthInput
          name="firstName"
          label="First Name"
          placeholder="What's your first name?"
          type="text"
        ></AuthInput>
        <AuthInput
          name="lastName"
          label="Last Name"
          placeholder="And your last name?"
          type="text"
        ></AuthInput>
        <AuthInput
          name="email"
          label="Email"
          placeholder="Where can we reach you?"
          type="email"
        ></AuthInput>
        <AuthInput
          name="password"
          label="Password"
          placeholder="Create a strong password"
          type="password"
        ></AuthInput>
        <AuthInput
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Type it again to confirm"
          type="password"
        ></AuthInput>
      </div>
      <span v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</span>
      <Button class="w-full" type="submit">Sign up</Button>
    </form>
  </AuthContainer>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const errorMsg = ref('')

const { signupSchema } = validators()

const { handleSubmit } = useForm({
  validationSchema: signupSchema,
})

const onSubmit = handleSubmit(async (values) => {
  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
      },
    },
  })
  if (error) {
    throw createError({
      name: 'Register failed',
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
