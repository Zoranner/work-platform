// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
  ],
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
  }
})
