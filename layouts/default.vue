<template>
  <div>
    <NuxtLoadingIndicator color="#7c3aed" />
    <CommonAppHeader />
    <section class="px-4 sm:px-6 lg:px-16 overflow-hidden">
      <slot />
    </section>
    <CommonAppFooter />
  </div>
</template>
