<template>
  <div class="container lg:w-1/2 md:w-3/4 w-full mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold mb-4 lg:mb-8">Welcome, {{ username }}</h2>
    <Tabs v-model="tab" class="mx-auto">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="address">Address</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <ProfileForm />
      </TabsContent>
      <TabsContent value="orders">
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <h6 class="text-base">You haven't placed any orders yet.</h6>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    <Button class="mt-4 px-8" @click="logOut">
      <span class="mr-2">Logout</span>
      <LogOut class="w-4 h-4" stroke-width="3"> </LogOut
    ></Button>
  </div>
</template>

<script setup lang="ts">
import { Tabs, TabsList, TabsContent, TabsTrigger } from '~/components/ui/tabs'
import ProfileForm from '~/components/auth/ProfileForm.vue'
import { LogOut } from 'lucide-vue-next'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const tab = ref('orders')

const username = computed(() => {
  return `${user.value?.user_metadata.firstName} ${user.value?.user_metadata.lastName}`
})

const logOut = async () => {
  await supabase.auth.signOut()
  navigateTo('/')
}
</script>
