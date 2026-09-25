<script setup lang="ts">
const { t } = useI18n()

const props = withDefaults(defineProps<{
  post: {
    path: string
    title: string
    description?: string
    excerpt?: string
    date: string
    readTime?: string
    featured?: boolean
    category?: string
    cover?: string
    coverAlt?: string
    image?: string
    rawbody?: unknown
  }
  tag?: string
}>(), { tag: 'h2' })

const coverRef = computed(() => coverOf(props.post))
const meta = computed(() => `${props.post.date} · ${t('blog.reading_time', { minutes: readMinutesOf(props.post) }) }`)
</script>

<template>
  <article class="group grid overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_2px_8px_rgba(7,18,43,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_44px_rgba(7,18,43,0.12)] dark:hover:border-accent/50 md:grid-cols-2">
    <NuxtLink :to="post.path" class="relative block overflow-hidden" :aria-label="post.title">
      <img
        v-if="coverRef?.kind === 'path'"
        :src="coverRef.src"
        :alt="post.coverAlt ?? ''"
        class="aspect-video h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] md:aspect-auto"
        fetchpriority="high"
      >
      <AppImage
        v-else-if="coverRef?.kind === 'cover'"
        :id="coverRef.id"
        :alt="post.coverAlt"
        class="aspect-video h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] md:aspect-auto"
      />
      <div v-else class="grid aspect-video h-full place-items-center bg-surface-muted dark:bg-surface-raised">
        <svg class="h-10 w-10 text-accent/70" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2 22 22H2L12 2Z" />
        </svg>
      </div>
    </NuxtLink>
    <div class="flex flex-col justify-center gap-4 p-6 sm:p-8">
      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider" :class="post.featured ? 'border-highlight bg-highlight/15 text-highlightText dark:text-highlight' : 'border-line bg-surface-muted text-muted dark:bg-surface-raised'">
          {{ post.featured ? t('blog.featured') : t('blog.article') }}
        </span>
        <span v-if="post.category" class="text-xs font-semibold uppercase tracking-wider text-accent">{{ post.category }}</span>
      </div>
      <component :is="tag" class="font-display text-2xl font-bold leading-snug text-ink sm:text-3xl">
        <NuxtLink :to="post.path" class="transition-colors duration-200 group-hover:text-accent">{{ post.title }}</NuxtLink>
      </component>
      <p class="max-w-prose text-base leading-7 text-secondary">{{ post.excerpt ?? post.description }}</p>
      <p class="text-sm text-muted">{{ meta }}</p>
    </div>
  </article>
</template>