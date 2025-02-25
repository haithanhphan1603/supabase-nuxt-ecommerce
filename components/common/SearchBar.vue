<template>
  <div class="relative w-full mx-4 lg:mx-8 items-center flex">
    <Input id="search" type="text" placeholder="Search..." class="pl-10" />
    <span
      class="absolute inset-y-0 start-0 flex items-center justify-center px-2"
    >
      <Search class="size-6 text-muted-foreground"></Search>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { Input } from '../ui/input'
import { Search } from 'lucide-vue-next'
</script>
