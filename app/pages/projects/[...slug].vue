<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()
const { absoluteUrl, absoluteImage } = resolveSiteUrl()
const collection = useCollectionName('projects')

const { data: project } = await useAsyncData(
  () => `project:${route.path}`,
  () => queryCollection(collection.value as 'projects_pt').path(route.path).first(),
  { watch: [collection] },
)

const canonical = computed(() => absoluteUrl(route.path))

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => project.value ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        mainEntityOfPage: canonical.value,
        headline: project.value.title,
        description: project.value.description,
        image: absoluteImage('/og-default.png'),
        inLanguage: locale.value,
        author: { '@type': 'Person', name: 'James Peter' },
        publisher: { '@type': 'Person', name: 'James Peter' },
      }) : undefined),
    },
  ],
}))

useSeoMeta({
  title: () => project.value ? withSiteTitle(project.value.title ?? '') : withSiteTitle(t('projects.title')),
  description: () => project.value?.description,
  ogType: 'article',
  ogUrl: canonical,
  ogImage: computed(() => absoluteImage('/og-default.png')),
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogImageAlt: () => project.value?.coverAlt ?? t('images.og-default.alt'),
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <article v-if="project">
    <NuxtLink to="/projects" class="text-sm font-semibold text-accent underline-offset-2 hover:underline">← {{ t('projects.back') }}</NuxtLink>

    <div class="mt-10 max-w-3xl">
      <p class="eyebrow">{{ t('nav.projects') }}</p>
      <h1 class="mt-4 text-4xl font-bold leading-tight text-ink sm:text-6xl">{{ project.title }}</h1>
      <p class="mt-5 text-lg leading-8 text-secondary">{{ project.description }}</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <a v-if="project.repo" :href="project.repo" class="btn-ghost" target="_blank" rel="noopener">
          {{ t('projects.repo') }}
        </a>
        <a v-if="project.url" :href="project.url" class="btn-ghost" target="_blank" rel="noopener">
          {{ t('projects.live') }}
        </a>
      </div>
    </div>

    <AppImage v-if="project.cover" :id="project.cover" :alt="project.coverAlt" class="mt-12 lg:hidden" />

    <div class="mt-14 lg:grid lg:grid-cols-[1fr_2fr] lg:gap-12 xl:gap-16">
      <StickyStage class="hidden lg:block">
        <AppImage v-if="project.cover" :id="project.cover" :alt="project.coverAlt" />
        <div v-else class="grid aspect-[16/10] place-items-center">
          <svg class="h-12 w-12 text-accent/60" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2 22 22H2L12 2Z" />
          </svg>
        </div>
        <p class="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{{ t('projects.stage_label') }}</p>
      </StickyStage>

      <div id="case-body" class="lg:pt-1">
        <div class="hidden text-sm font-semibold uppercase tracking-[0.18em] text-muted lg:mb-8 lg:block">{{ t('projects.stage_label') }}</div>
        <ContentRenderer :value="project" class="prose-brand" />
      </div>
    </div>

    <ProjectGallery v-if="project.gallery?.length" :images="project.gallery" class="mt-14" />
  </article>

  <div v-else>
    <p>{{ t('blog.not_found') }}</p>
    <NuxtLink to="/projects" class="mt-2 inline-block text-sm underline">{{ t('projects.back') }}</NuxtLink>
  </div>
</template>