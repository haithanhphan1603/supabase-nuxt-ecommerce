<script lang="ts" setup>
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  MailIcon,
  GithubIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-vue-next'
import AppFooterItem from './AppFooterItem.vue'

const footerLinks = ref([
  { to: '/collections/new-release', label: 'New Release' },
  { to: '/pre-orders', label: 'Pre-orders' },
  { to: '/collections/all', label: 'Genres' },
  { to: '/pop', label: 'Pop' },
])

const supportLinks = ref([
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
  { to: '/shipping', label: 'Shipping' },
  { to: '/returns', label: 'Returns' },
])

const accountLinks = ref([
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
  { to: '/shipping', label: 'My Cart' },
  { to: '/returns', label: 'My Wishlist' },
  { to: '/orders', label: 'My Order' },
])

const socialLinks = ref([
  { href: '#', icon: FacebookIcon, label: 'Facebook' },
  { href: '#', icon: TwitterIcon, label: 'Twitter' },
  { href: '#', icon: InstagramIcon, label: 'Instagram' },
  { href: '#', icon: MailIcon, label: 'Mail' },
  {
    href: 'https://github.com/haithanhphan1603',
    icon: GithubIcon,
    label: 'Github',
    target: '_blank',
  },
])

const expandedSections = ref<Record<string, boolean>>({
  letsVinyl: false,
  support: false,
  account: false,
})

const toggleSection = (section: string | number) => {
  expandedSections.value[section] = !expandedSections.value[section]
}
</script>

<template>
  <footer class="bg-background pt-10 pb-8">
    <div class="px-4 sm:px-6 lg:px-16 mx-auto">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 sm:gap-4"
      >
        <div class="flex flex-col gap-2">
          <CommonAppLogo />
          <a class="font-extralight">therecord@vinylata.com</a>
          <div class="flex gap-2 mt-2">
            <a
              v-for="link in socialLinks"
              :key="link.label"
              :href="link.href"
              :target="link.target || '_self'"
              class="border-none rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <component :is="link.icon" class="h-5 w-5" />
              <span class="sr-only">{{ link.label }}</span>
            </a>
          </div>
        </div>

        <div class="sm:hidden">
          <div
            class="flex justify-between items-center py-2 cursor-pointer"
            @click="toggleSection('letsVinyl')"
          >
            <h3 class="font-semibold">Let's Vinyl</h3>
            <component
              :is="expandedSections.letsVinyl ? ChevronUpIcon : ChevronDownIcon"
              class="h-5 w-5"
            />
          </div>
          <AppFooterItem
            v-if="expandedSections.letsVinyl"
            label="Let's Vinyl"
            :footer-links="footerLinks"
          />
        </div>

        <div class="sm:hidden">
          <div
            class="flex justify-between items-center py-2 cursor-pointer"
            @click="toggleSection('support')"
          >
            <h3 class="font-semibold">Support</h3>
            <component
              :is="expandedSections.support ? ChevronUpIcon : ChevronDownIcon"
              class="h-5 w-5"
            />
          </div>
          <AppFooterItem
            v-if="expandedSections.support"
            label="Support"
            :footer-links="supportLinks"
          />
        </div>

        <div class="sm:hidden">
          <div
            class="flex justify-between items-center py-2 cursor-pointer"
            @click="toggleSection('account')"
          >
            <h3 class="font-semibold">Account</h3>
            <component
              :is="expandedSections.account ? ChevronUpIcon : ChevronDownIcon"
              class="h-5 w-5"
            />
          </div>
          <AppFooterItem
            v-if="expandedSections.account"
            label="Account"
            :footer-links="accountLinks"
          />
        </div>

        <div class="hidden sm:block">
          <AppFooterItem label="Let's Vinyl" :footer-links="footerLinks" />
        </div>
        <div class="hidden sm:block">
          <AppFooterItem label="Support" :footer-links="supportLinks" />
        </div>
        <div class="hidden sm:block">
          <AppFooterItem label="Account" :footer-links="accountLinks" />
        </div>
      </div>
    </div>
  </footer>
</template>
