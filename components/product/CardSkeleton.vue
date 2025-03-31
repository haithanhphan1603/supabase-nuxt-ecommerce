<script lang="ts" setup>
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <div class="flex flex-col space-y-3">
    <Skeleton class="h-full w-full rounded-xl" />
    <div class="space-y-4">
      <Skeleton class="h-4" />
      <Skeleton class="h-4" />
    </div>
  </div>
</template>
