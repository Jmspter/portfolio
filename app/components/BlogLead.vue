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
  author?: string
}>(), {
  image: undefined,
  cover: undefined,
  coverAlt: undefined,
  category: undefined,
  description: undefined,
  author: undefined,
})
</script>

<template>
  <article class="group lg:grid lg:grid-cols-[1.15fr_1fr] lg:gap-10">
    <NuxtLink :to="to" :aria-label="title" class="block">
      <BlogCover :image="image" :cover="cover" :alt="coverAlt ?? ''" ratio="16/10" priority />
    </NuxtLink>
    <div class="pt-6 lg:pt-0">
      <p class="eyebrow">{{ category ?? to.slice(1) }}</p>
      <h2 class="mt-3 font-editorial text-3xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
        <NuxtLink :to="to" class="hover:text-accent">{{ title }}</NuxtLink>
      </h2>
      <p v-if="description" class="mt-4 max-w-prose text-base leading-7 text-secondary">{{ description }}</p>
      <p class="mt-4 text-sm font-medium text-muted">
        <span v-if="author">{{ author }} · </span>{{ date }} · {{ t('blog.reading_time', { minutes: readMinutes }) }}
      </p>
    </div>
  </article>
</template>