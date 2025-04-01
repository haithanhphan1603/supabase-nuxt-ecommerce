<template>
  <Card class="w-full lg:w-1/2 lg:my-10 my-4 border-0">
    <CardHeader>
      <CardTitle class="uppercase text-3xl">
        {{ isLogin ? 'Login into' : 'Sign up for' }}
        <span class="text-violet-600">Vinyl</span> realm
      </CardTitle>
      <CardDescription>
        {{
          isLogin
            ? 'Enter your credentials to access your account'
            : 'Create your account to join the Vinyl community'
        }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
    <CardFooter class="flex flex-col space-y-4">
      <div
        class="flex flex-col lg:flex-row justify-between w-full space-y-4 lg:space-y-0"
      >
        <CommonAppLink v-if="isLogin" to="/auth/forget-password">
          Forgot Password?
        </CommonAppLink>
        <Button variant="link" @click="toggleAuthMode">
          {{
            isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Login'
          }}
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>

<script lang="ts" setup>
interface Props {
  isLogin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLogin: false,
})

const toggleAuthMode = () => {
  props.isLogin ? navigateTo('/account/register') : navigateTo('/account/login')
}
</script>

<style></style>
