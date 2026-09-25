<script setup lang="ts">
const { t } = useI18n()
withDefaults(defineProps<{
  label: string
  posts: Array<{
    to: string
    title: string
    date: string
    readMinutes: number
  }>
}>(), {
  posts: () => [],
})
</script>

<template>
  <aside>
    <h2 class="border-t border-line pt-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">{{ label }}</h2>
    <ul v-if="posts.length" class="mt-3 divide-y divide-line">
      <li v-for="p in posts" :key="p.to" class="py-3.5 first:pt-1">
        <NuxtLink :to="p.to" class="group block">
          <p class="font-display text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-accent">{{ p.title }}</p>
          <p class="mt-1 text-xs font-medium tabular-nums text-muted">{{ p.date }} · {{ t('blog.reading_time', { minutes: p.readMinutes }) }}</p>
        </NuxtLink>
      </li>
    </ul>
  </aside>
</template>