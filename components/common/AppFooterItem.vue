<template>
  <div>
    <p v-if="!isMobile" class="font-extrabold text-violet-600">{{ label }}</p>

    <ul class="flex flex-col gap-1 mt-1">
      <li v-for="link in footerLinks" :key="link.label">
        <CommonAppLink class="text-sm font-light" :to="link.to">{{
          link.label
        }}</CommonAppLink>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  label: string
  footerLinks: { label: string; to: string }[]
}

const { isMobile } = useUtilities()

defineProps<Props>()
</script>
