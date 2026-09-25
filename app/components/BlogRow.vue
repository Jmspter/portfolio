<script setup lang="ts">
const { t } = useI18n()
const props = withDefaults(defineProps<{
  to: string
  image?: string
  cover?: string
  coverAlt?: string
  category?: string
  title: string
  description?: string
  date: string
  readMinutes: number
  tags?: string[]
  highlight?: string
}>(), {
  image: undefined,
  cover: undefined,
  coverAlt: undefined,
  category: undefined,
  description: undefined,
  tags: () => [],
  highlight: '',
})

const hlTitle = computed(() => highlightMatches(props.title, props.highlight))
const hlDescription = computed(() => highlightMatches(props.description, props.highlight))
</script>

<template>
  <article class="group grid gap-5 border-t border-line py-6 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-7">
    <NuxtLink :to="to" :aria-label="title" class="block">
      <BlogCover :image="image" :cover="cover" :alt="coverAlt ?? ''" ratio="16/9" />
    </NuxtLink>
    <div class="min-w-0">
      <p class="eyebrow">{{ category ?? to.slice(1) }}</p>
      <h3 class="mt-2 font-display text-xl font-bold leading-snug tracking-tight text-ink">
        <NuxtLink :to="to" v-html="hlTitle" class="hover:text-accent" />
      </h3>
      <p v-if="description" class="mt-2 line-clamp-2 text-sm leading-6 text-secondary" v-html="hlDescription" />
      <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
        <span class="tabular-nums">{{ date }} · {{ t('blog.reading_time', { minutes: readMinutes }) }}</span>
        <span v-for="tag in tags" :key="tag" class="uppercase tracking-wide text-secondary"><span class="text-highlight">#</span>{{ tag }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
:deep(mark) {
  background-color: rgb(var(--highlight));
  color: rgb(var(--highlight-text));
  border-radius: 2px;
  padding: 0 1px;
}
</style>