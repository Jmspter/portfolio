<script setup lang="ts">
const { t } = useI18n()
withDefaults(defineProps<{
  to: string
  image?: string
  cover?: string
  coverAlt?: string
  category?: string
  title: string
  description?: string
  date: string
  readMinutes: number
}>(), {
  image: undefined,
  cover: undefined,
  coverAlt: undefined,
  category: undefined,
  description: undefined,
})
</script>

<template>
  <article class="group flex flex-col border-t border-line pt-5">
    <NuxtLink :to="to" :aria-label="title" class="block">
      <BlogCover :image="image" :cover="cover" :alt="coverAlt ?? ''" ratio="16/9" />
    </NuxtLink>
    <p class="eyebrow mt-4">{{ category ?? to.slice(1) }}</p>
    <h3 class="mt-2 font-display text-lg font-bold leading-snug tracking-tight text-ink">
      <NuxtLink :to="to" class="hover:text-accent">{{ title }}</NuxtLink>
    </h3>
    <p v-if="description" class="mt-2 line-clamp-3 text-sm leading-6 text-secondary">{{ description }}</p>
    <p class="mt-3 text-sm font-medium text-muted">{{ date }} · {{ t('blog.reading_time', { minutes: readMinutes }) }}</p>
  </article>
</template>