<template>
  <Accordion
    type="multiple"
    class="w-full lg:pr-8 md:pr-4"
    :default-value="defaultAccordionItems"
  >
    <AccordionItem
      :key="accordionItems[0].value"
      :value="accordionItems[0].value"
    >
      <AccordionTrigger class="text-lg font-extrabold">{{
        accordionItems[0].title
      }}</AccordionTrigger>
      <AccordionContent>
        <div class="flex gap-2 flex-col">
          <div v-for="option in productTypeOptions" :key="option.id">
            <Checkbox
              :id="option.id"
              :checked="searchInfo.productType.includes(option.id)"
              @update:checked="
                (checked) => {
                  if (checked) {
                    searchInfo.productType.push(option.id)
                  } else {
                    const index = searchInfo.productType.indexOf(option.id)
                    if (index > -1) {
                      searchInfo.productType.splice(index, 1)
                    }
                  }
                }
              "
            />
            <label
              :for="option.id"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pl-2"
            >
              {{ option.label }} Vinyl
            </label>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem
      :key="accordionItems[1].value"
      :value="accordionItems[1].value"
    >
      <AccordionTrigger class="text-lg font-extrabold">{{
        accordionItems[1].title
      }}</AccordionTrigger>
      <AccordionContent>
        <div class="flex gap-2 flex-col">
          <RadioGroup v-model="searchInfo.sortBy">
            <div v-for="option in sortByOptions" :key="option.value">
              <RadioGroupItem :id="option.value" :value="option.value" />
              <label
                :for="option.value"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pl-2"
              >
                {{ option.label }}
              </label>
            </div>
          </RadioGroup>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>

<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import type { Enums } from '~/types/database.types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import RadioGroup from '../ui/radio-group/RadioGroup.vue'
import RadioGroupItem from '../ui/radio-group/RadioGroupItem.vue'
import { SortBy, type CollectionSearchParams } from '~/types/search.types'

const searchInfo = defineModel({
  type: Object as () => CollectionSearchParams,
  required: true,
})

const { width } = useWindowSize()

const productTypeOptions: {
  id: Enums<'productType'>
  label: Enums<'productType'>
}[] = [
  {
    id: 'LP',
    label: 'LP',
  },
  {
    id: 'CD',
    label: 'CD',
  },
  {
    id: '2LP',
    label: '2LP',
  },
  {
    id: 'CD+DVD',
    label: 'CD+DVD',
  },
]

const sortByOptions = [
  { value: SortBy.MANUAL, label: 'Manual' },
  { value: SortBy.PRICE_ASC, label: 'Price: Low to High' },
  { value: SortBy.PRICE_DESC, label: 'Price: High to Low' },
  { value: SortBy.NAME_ASC, label: 'Name: A to Z' },
  { value: SortBy.NAME_DESC, label: 'Name: Z to A' },
  { value: SortBy.CREATED_AT_DESC, label: 'Newest Arrivals' },
]

const accordionItems = [
  {
    value: 'item-1',
    title: 'Format',
  },
  {
    value: 'item-2',
    title: 'Sort By',
  },
]

const defaultAccordionItems = computed(() => {
  if (width.value < 768) {
    return []
  }
  return accordionItems.map((item) => item.value)
})
</script>
