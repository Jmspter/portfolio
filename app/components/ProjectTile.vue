<script setup lang="ts">
defineProps<{
  to: string
  title: string
  description: string
  tags?: string[]
  cover?: string
  coverAlt?: string
}>()
</script>

<template>
  <article class="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[0_2px_8px_rgba(7,18,43,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_44px_rgba(7,18,43,0.12)] dark:hover:border-accent/50">
    <NuxtLink :to="to" class="overflow-hidden" :aria-label="title">
      <AppImage v-if="cover" :id="cover" :alt="coverAlt" class="aspect-[16/9] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
      <div v-else class="grid aspect-[16/9] place-items-center bg-surface-muted dark:bg-surface-raised">
        <svg class="h-10 w-10 text-accent/70" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2 22 22H2L12 2Z" />
        </svg>
      </div>
    </NuxtLink>
    <div class="flex flex-1 flex-col p-5">
      <h3 class="font-display text-lg font-semibold text-ink transition-colors duration-200">
        <NuxtLink :to="to" class="group-hover:text-accent">{{ title }}</NuxtLink>
      </h3>
      <p class="mt-2 flex-1 text-sm leading-6 text-muted line-clamp-3">{{ description }}</p>
      <ul v-if="tags?.length" class="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
        <li v-for="tag in tags" :key="tag" class="border-b-2 border-highlight pb-0.5">
          {{ tag }}
        </li>
      </ul>
    </div>
  </article>
</template>