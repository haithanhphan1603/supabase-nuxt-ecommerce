// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    'nuxt-lodash',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxtjs/supabase',
    '@nuxt/fonts',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    'nuxt-swiper',
    '@pinia-plugin-persistedstate/nuxt',
    'radix-vue/nuxt',
    '@vee-validate/nuxt',
  ],

  supabase: {
    redirect: false,
  },

  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'first' }],
    configPath: './tailwind.config.js',
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true,
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },

  colorMode: {
    classSuffix: '',
  },

  css: ['~/assets/css/tailwind.css', '~/assets/scss/main.scss'],
  compatibilityDate: '2024-08-17',
  fonts: {
    provider: 'google', // sets default provider
    families: [
      {
        name: 'Roboto', // the 'canonical' name of the font used to look it up in a provider database
        provider: 'google', // you can override the provider on a per-family basis
        // provider specific options can be provided
        // specific configuration will be used to generate `@font-face` definitions
        subsets: ['latin', 'greek'],
        display: 'swap', // or 'block'
        weight: [400, 700],
        styles: ['normal', 'italic'],
        // and produce CSS overrides to reduce layout shift (using fontaine)
        fallbacks: ['Arial'],
      },
    ],
  },
  devServer: {
    port: 3000,
    host: '0.0.0.0',
  },
  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    public: {
      stripePublishableKey: process.env.STRIPE_PUBLIC_KEY,
    },
  },
})
