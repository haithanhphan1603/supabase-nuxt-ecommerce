<template>
  <div
    class="bg-gradient-to-b from-violet-950 to-violet-900 py-6 sm:py-10 px-4 sm:px-6 lg:px-8"
  >
    <h2
      class="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-violet-50 text-center uppercase"
    >
      Keep In Touch
    </h2>
    <div
      class="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-6 w-full mx-auto px-0 lg:px-16"
    >
      <Input placeholder="Name" class="w-full h-10" />
      <Input placeholder="Email" type="email" class="w-full h-10" />
      <Button
        class="w-full lg:w-auto px-6 py-2 h-10 text-sm sm:text-md font-bold bg-violet-500 uppercase"
      >
        Sign up
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Input from '../ui/input/Input.vue'
import Button from '../ui/button/Button.vue'
</script>
