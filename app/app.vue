<script setup lang="ts">
const { locale, t } = useI18n()
const route = useRoute()
const { absoluteUrl, absoluteImage } = resolveSiteUrl()

const htmlLang = computed(() => (locale.value === 'pt' ? 'pt-BR' : 'en-US'))
const ogLocale = computed(() => (locale.value === 'pt' ? 'pt_BR' : 'en_US'))
const canonical = computed(() => absoluteUrl(route.path))
const defaultOgImage = computed(() => absoluteImage('/og-default.png'))

const schemaGraph = computed(() => {
  const url = canonical.value
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url,
        name: siteName,
        description: t('meta.default_description'),
        inLanguage: locale.value,
        publisher: { '@id': `${url}#person` },
      },
      {
        '@type': 'Person',
        '@id': `${url}#person`,
        url,
        name: siteName,
        jobTitle: t('meta.job_title'),
      },
    ],
  })
})

useHead(() => ({
  htmlAttrs: { lang: htmlLang.value },
  link: [
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
    { rel: 'manifest', href: '/manifest.webmanifest' },
    { rel: 'canonical', href: canonical.value },
    { rel: 'alternate', hreflang: 'pt-BR', href: canonical.value },
    { rel: 'alternate', hreflang: 'en-US', href: canonical.value },
    { rel: 'alternate', hreflang: 'x-default', href: canonical.value },
  ],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-title', content: 'James Peter' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#ffffff' },
    { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#07122b' },
  ],
  script: [
    { type: 'application/ld+json', innerHTML: schemaGraph.value },
  ],
}))

useSeoMeta({
  title: computed(() => t('meta.home_title')),
  description: computed(() => t('meta.default_description')),
  ogType: 'website',
  ogSiteName: siteName,
  ogLocale,
  ogUrl: canonical,
  ogImage: defaultOgImage,
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogImageAlt: computed(() => t('images.og-default.alt')),
  twitterCard: 'summary_large_image',
  twitterImage: defaultOgImage,
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#conteudo"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-highlight focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-highlightText"
    >
      {{ t('nav.skip') }}
    </a>
    <MobileHeader />
    <AppHeader />
    <main id="conteudo" tabindex="-1" class="page-enter mx-auto w-full max-w-6xl flex-1 px-4 pb-36 pt-10 sm:px-6 md:pb-20 lg:py-20">
      <NuxtPage />
    </main>
    <AppFooter />
    <MobileTabBar />
  </div>
</template>