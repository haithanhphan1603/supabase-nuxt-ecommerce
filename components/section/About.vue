<template>
  <div class="about-section grid grid-cols-2 lg:grid-cols-4 gap-4">
    <CommonAppMagicCard
      v-for="(CONTENT, i) in CONTENTS"
      :key="i"
      :icon="CONTENT.icon"
      :description="CONTENT.description"
      :title="CONTENT.title"
    />
  </div>
</template>

<script lang="ts" setup>
import { CreditCard, Headset, Package, MapPin } from 'lucide-vue-next'
const CONTENTS = [
  {
    title: 'Payments',
    icon: CreditCard,
    description:
      'We offer secure and convenient payment options to ensure a smooth checkout experience for all users.',
  },
  {
    title: 'Customer Support',
    icon: Headset,
    description:
      'Our customer support team is available 24/7 to assist with any inquiries or issues you may have.',
  },
  {
    title: 'Returns',
    icon: Package,
    description:
      'Enjoy an easy and hassle-free return process with clear instructions and quick refunds.',
  },
  {
    title: 'Tracking',
    icon: MapPin,
    description:
      'Stay updated with real-time order tracking to know exactly where your package is at all times.',
  },
]
</script>
