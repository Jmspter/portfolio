<script setup lang="ts">
defineProps<{
  to: string
  title: string
  description?: string
  meta?: string
  tags?: string[]
  category?: string
  cover?: string
  coverAlt?: string
  image?: string
}>()
</script>

<template>
  <article class="group grid gap-4 border-t border-line py-6 transition-colors duration-200 hover:border-accent/40 dark:hover:border-accent/50 sm:grid-cols-[minmax(0,1fr)_2fr] sm:gap-8">
    <div class="flex items-start gap-3">
      <span class="mt-2 h-3 w-3 shrink-0 bg-accent transition-transform duration-200 group-hover:rotate-45" aria-hidden="true" />
      <div>
        <NuxtLink :to="to" class="font-display text-xl font-semibold text-ink transition-colors hover:text-accent">{{ title }}</NuxtLink>
        <p v-if="meta" class="mt-1 text-sm text-muted">{{ meta }}</p>
      </div>
    </div>
<div>
        <NuxtLink v-if="cover || image" :to="to" class="mb-5 block overflow-hidden" :aria-label="title">
          <img v-if="image" :src="image" :alt="coverAlt ?? ''" class="aspect-video w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015]" loading="lazy">
          <AppImage v-else :id="cover || ''" :alt="coverAlt" class="transition-transform duration-300 ease-out group-hover:scale-[1.015]" />
        </NuxtLink>
        <p v-if="category" class="text-xs font-semibold uppercase tracking-wider text-accent">{{ category }}</p>
        <p class="text-base leading-7 text-secondary dark:text-secondary">{{ description }}</p>
      <ul v-if="tags?.length" class="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-wide text-muted">
      <li v-for="tag in tags" :key="tag" class="border-b-2 border-highlight pb-0.5">
        {{ tag }}
      </li>
      </ul>
    </div>
  </article>
</template>
