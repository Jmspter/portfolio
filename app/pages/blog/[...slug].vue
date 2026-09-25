<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()
const { absoluteUrl, absoluteImage } = resolveSiteUrl()
const collection = useCollectionName('blog')
const article = ref<HTMLElement>()

const { data: post } = await useAsyncData(
  () => `post:${route.path}`,
  () => queryCollection(collection.value as 'blog_pt').path(route.path).first(),
  { watch: [collection] },
)

const coverRef = computed(() => (post.value ? coverOf(post.value) : null))
const canonical = computed(() => absoluteUrl(route.path))
const postImage = computed(() => absoluteImage(post.value?.image ?? '/og-default.png'))
const isoDate = computed(() => publishedIso(post.value?.date))

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => post.value ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: canonical.value,
        headline: post.value.title,
        description: post.value.description ?? post.value.excerpt,
        image: postImage.value,
        datePublished: isoDate.value,
        dateModified: isoDate.value,
        inLanguage: locale.value,
        author: {
          '@type': 'Person',
          name: post.value.author?.name ?? 'James Peter',
          ...(post.value.author?.avatar ? { image: absoluteImage(post.value.author.avatar) } : {}),
        },
        publisher: { '@type': 'Person', name: 'James Peter' },
      }) : undefined),
    },
  ],
}))

useSeoMeta({
  title: () => post.value ? withSiteTitle(post.value.title ?? '') : withSiteTitle(t('blog.title')),
  description: () => post.value?.description ?? post.value?.excerpt,
  ogType: 'article',
  ogUrl: canonical,
  ogImage: postImage,
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogImageAlt: () => post.value?.coverAlt ?? t('images.og-default.alt'),
  articlePublishedTime: isoDate,
  articleSection: () => post.value?.category,
  articleTag: () => post.value?.tags,
  twitterCard: 'summary_large_image',
  twitterImage: postImage,
})
</script>

<template>
  <article v-if="post" ref="article" class="relative">
    <ReadingProgress />

    <NuxtLink to="/blog" class="text-sm font-semibold text-accent underline-offset-2 hover:underline">← {{ t('blog.back') }}</NuxtLink>

    <header class="mt-10 border-t-4 border-accent pt-6">
      <p class="eyebrow">{{ post.category ?? t('nav.blog') }}</p>
      <h1 class="mt-4 max-w-prose font-editorial text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">{{ post.title }}</h1>
      <p v-if="post.description ?? post.excerpt" class="mt-5 max-w-reading text-lg leading-8 text-secondary">{{ post.description ?? post.excerpt }}</p>
      <div class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-line py-4 text-sm font-medium text-muted">
        <span v-if="post.author" class="flex items-center gap-2">
          <img v-if="post.author.avatar" :src="post.author.avatar" :alt="post.author.name" class="h-7 w-7 rounded-full object-cover" loading="lazy">
          <span>{{ post.author.name }}</span>
        </span>
        <span v-if="post.author" class="h-3.5 w-px bg-lineStrong" aria-hidden="true"></span>
        <span>{{ post.date }}</span>
        <span class="h-3.5 w-px bg-lineStrong" aria-hidden="true"></span>
        <span>{{ t('blog.reading_time', { minutes: readMinutesOf(post) }) }}</span>
      </div>
    </header>

    <img v-if="coverRef?.kind === 'path'" :src="coverRef.src" :alt="post.coverAlt ?? ''" class="mt-8 aspect-video w-full rounded-xl object-cover">
    <AppImage v-else-if="coverRef?.kind === 'cover'" :id="coverRef.id" :alt="post.coverAlt" class="mt-8" />

    <div class="mt-10 lg:grid lg:grid-cols-[1fr_240px] lg:gap-12 xl:gap-16">
      <div class="mx-auto w-full max-w-reading">
        <details class="group mt-2 rounded-xl border border-line bg-surface lg:hidden dark:bg-surface-raised">
          <summary class="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-ink">
            {{ t('blog.toc') }}
            <span class="text-accent transition-transform duration-200 group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <div class="border-t border-line px-4 py-3">
            <TableOfContents :container="article" compact />
          </div>
        </details>

        <ContentRenderer :value="post" class="prose-brand mt-12" />

        <div class="mt-10">
          <ReactionBar :post-id="postIdOf(post)" />
        </div>
        <CommentSection :post-id="postIdOf(post)" />
      </div>

      <aside class="hidden self-start lg:sticky lg:top-24 lg:block">
        <TableOfContents :container="article" />
      </aside>
    </div>

    <BackToTop />
  </article>

  <div v-else>
    <p class="text-lg">{{ t('blog.not_found') }}</p>
    <NuxtLink to="/blog" class="mt-2 inline-block text-sm underline">{{ t('blog.back') }}</NuxtLink>
  </div>
</template>