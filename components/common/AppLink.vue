<script setup lang="ts">
interface Props {
  to: string
}
defineProps<Props>()
</script>

<template>
  <div class="hover:text-violet-600 font-normal text-base cursor-pointer">
    <nuxt-link :to>
      <slot />
    </nuxt-link>
  </div>
</template>

<style scoped lang="scss">
a {
  transition: color 0.3s ease-in-out;
}
.router-link-exact-active {
  color: #7c3aed;
  font-weight: 900;
}
</style>
