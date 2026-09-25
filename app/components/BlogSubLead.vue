<script setup lang="ts">
const { t } = useI18n()
withDefaults(defineProps<{
  to: string
  image?: string
  cover?: string
  coverAlt?: string
  category?: string
  title: string
  date: string
  readMinutes: number
}>(), {
  image: undefined,
  cover: undefined,
  coverAlt: undefined,
  category: undefined,
})
</script>

<template>
  <article class="group flex gap-6 py-6 first:pt-0 last:pb-0">
    <div class="block w-36 shrink-0 md:w-44">
      <NuxtLink :to="to" :aria-label="title" class="block">
        <BlogCover :image="image" :cover="cover" :alt="coverAlt ?? ''" ratio="16/9" />
      </NuxtLink>
    </div>
    <div class="min-w-0">
      <p class="eyebrow">{{ category ?? to.slice(1) }}</p>
      <h3 class="mt-2 font-display text-lg font-bold leading-snug tracking-tight text-ink">
        <NuxtLink :to="to" class="hover:text-accent">{{ title }}</NuxtLink>
      </h3>
      <p class="mt-2 text-sm font-medium text-muted">{{ date }} · {{ t('blog.reading_time', { minutes: readMinutes }) }}</p>
    </div>
  </article>
</template>