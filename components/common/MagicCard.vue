<template>
  <div
    ref="el"
    class="p-0.5 dark:bg-gray-900 relative card"
    :style="{
      '--x': `${x - (el?.offsetLeft ?? 0)}px`,
      '--y': `${y - (el?.offsetTop ?? 0)}px`,
    }"
  >
    <div
      class="dark:bg-gray-950 bg-white relative p-4 border border-slate-200 dark:border-slate-700 h-full"
    >
      <component
        :is="icon"
        size="2rem"
        :stroke-width="1"
        class="mb-2"
        color="#7c3aed"
      />
      <p class="text-gray-900 dark:text-white text-base font-bold truncate">
        {{ title }}
      </p>
      <p class="text-[15px] text-gray-500 dark:text-gray-400 mt-1">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  title: string
  description: string
  icon: Component
}
defineProps<Props>()

const { x, y } = useMouse()
const el = ref<HTMLElement | null>(null)
</script>

<style scoped>
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    200px circle at var(--x) var(--y),
    #7c3aed,
    transparent
  );
}
</style>
