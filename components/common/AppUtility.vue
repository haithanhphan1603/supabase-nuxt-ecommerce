<template>
  <div class="flex gap-2 items-center">
    <Heart class="h-[1.2rem] w-[1.2rem] p-2"></Heart>
    <UserCircle2 class="h-[1.2rem] w-[1.2rem] p-2"></UserCircle2>
    <ShoppingBag class="h-[1.2rem] w-[1.2rem] p-2"></ShoppingBag>
    <AppColorMode></AppColorMode>
  </div>
</template>

<script lang="ts" setup>
import AppColorMode from './AppColorMode.vue'
import { UserCircle2, Heart, ShoppingBag } from 'lucide-vue-next'
</script>

<style></style>
