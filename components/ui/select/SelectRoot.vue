<script setup lang="ts" generic="TValue">
import { SelectRoot } from 'radix-vue'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: TValue | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TValue | undefined]
}>()

const model = computed<string | undefined>({
  get: () => {
    return JSON.stringify(props.modelValue)
  },
  set: (value) => {
    if (value === undefined) {
      emit('update:modelValue', undefined)
      return
    }

    emit('update:modelValue', JSON.parse(value))
  },
})
</script>

<template>
  <SelectRoot v-model="model">
    <slot />
  </SelectRoot>
</template>
