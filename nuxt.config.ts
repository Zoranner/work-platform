// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],

  css: [
    '@/assets/css/tailwind.css'
  ],

  components: {
    dirs: [
      '~/components',
      '~/components/ui',
      '~/components/layout'
    ]
  },

  app: {
    head: {
      title: 'WorkPlatform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      oidc: {
        authority: process.env.OIDC_AUTHORITY,
        clientId: process.env.OIDC_CLIENT_ID,
        clientSecret: process.env.OIDC_CLIENT_SECRET,
        redirectUri: process.env.OIDC_REDIRECT_URI,
        postLogoutRedirectUri: process.env.OIDC_POST_LOGOUT_REDIRECT_URI,
        scope: 'openid profile email',
      }
    }
  },

  typescript: {
    strict: true
  },

  ssr: false,
  
  compatibilityDate: '2025-01-01'
})