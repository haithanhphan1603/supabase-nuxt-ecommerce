<template>
  <section class="flex flex-col gap-10">
    <CategoryCarousel
      v-for="id in HOME_PAGE_CATEGORIES_ID"
      :key="id"
      :category-id="id"
    />
  </section>
</template>

<script setup lang="ts">
const HOME_PAGE_CATEGORIES_ID = [1, 2, 3]
</script>
