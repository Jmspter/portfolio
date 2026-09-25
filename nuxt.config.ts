export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  experimental: {
    // View Transitions API (cross-fade) como melhoria progressiva; os
    // navegadores sem suporte caem no pageTransition CSS.
    viewTransition: true,
  },

  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    'nitro-cloudflare-dev', // expõe os bindings (D1) no `nuxt dev`
  ],

  fonts: {
    families: [
      { name: 'Space Grotesk', weights: [400, 500, 600, 700] },
      { name: 'Instrument Sans', weights: [400, 500, 600, 700] },
      { name: 'Fraunces', weights: [400, 500, 600, 700, 900] },
    ],
  },

  tailwindcss: { cssPath: '~/assets/css/main.css' },

  nitro: {
    preset: 'cloudflare-pages',
    cloudflare: { nodeCompat: true },
  },

  // Em produção o Nuxt Content usa um D1 próprio (binding CONTENT_DB).
  // Em desenvolvimento ele usa um SQLite local automaticamente.
  content: {
    database: { type: 'd1', bindingName: 'CONTENT_DB' },
  },

  colorMode: { classSuffix: '', preference: 'system', fallback: 'light' },

  routeRules: {
    '/img/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/sw.js': {
      headers: { 'cache-control': 'no-cache, must-revalidate' },
    },
    '/manifest.webmanifest': {
      headers: { 'cache-control': 'public, max-age=86400' },
    },
    '/sitemap.xml': {
      swr: 3600,
      headers: { 'cache-control': 'public, max-age=900, s-maxage=3600' },
    },
    '/robots.txt': {
      swr: 3600,
      headers: { 'cache-control': 'public, max-age=900, s-maxage=3600' },
    },
  },

  i18n: {
    strategy: 'no_prefix', // a URL é a mesma nos dois idiomas
    defaultLocale: 'pt',
    locales: [
      { code: 'pt', language: 'pt-BR', name: 'Português', file: 'pt.yml' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.yml' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'locale',
      fallbackLocale: 'pt',
      redirectOn: 'root',
    },
  },

  runtimeConfig: {
    // Secrets: NUXT_RESEND_API_KEY, NUXT_TURNSTILE_SECRET, ...
    resendApiKey: '',
    contactTo: '',
    contactFrom: 'Portfolio <onboarding@resend.dev>',
    turnstileSecret: '',
    accessTeamDomain: '', // ex.: meutime.cloudflareaccess.com
    accessAud: '', // Application Audience (AUD) tag do Cloudflare Access
    visitorSalt: 'troque-este-valor',
    public: {
      turnstileSiteKey: '',
      siteUrl: 'http://localhost:3000',
    },
  },
})
