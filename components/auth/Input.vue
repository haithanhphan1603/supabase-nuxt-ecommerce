<template>
  <FormField v-slot="{ componentField }" :name>
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <Input :type :placeholder v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script lang="ts" setup>
import type { InputTypeHTMLAttribute } from 'vue'
import { Input } from '../ui/input'

interface Props {
  name: string
  label: string
  placeholder: string
  type: InputTypeHTMLAttribute
}

defineProps<Props>()
</script>

<style></style>
