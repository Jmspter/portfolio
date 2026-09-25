<script setup lang="ts">
const { t } = useI18n()
const query = defineModel<string>('query', { default: '' })
const category = defineModel<string | null>('category', { default: null })
const tag = defineModel<string | null>('tag', { default: null })

const props = withDefaults(defineProps<{
  categories: string[]
  tags: string[]
  count: number
  total: number
  searching: boolean
  liveQuery: string
}>(), {
  categories: () => [],
  tags: () => [],
  count: 0,
  total: 0,
  searching: false,
  liveQuery: '',
})

const inputRef = ref<HTMLInputElement>()

function onGlobalKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null
  if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
  if (target?.isContentEditable) return
  if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault()
    inputRef.value?.focus()
  }
}

function onInputKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  if (query.value || category.value || tag.value) {
    query.value = ''
    category.value = null
    tag.value = null
  } else {
    inputRef.value?.blur()
  }
}

function clearAll() {
  query.value = ''
  category.value = null
  tag.value = null
  inputRef.value?.focus()
}

const statusText = computed(() => {
  if (!props.searching) return t('blog.result_count', props.total)
  const q = props.liveQuery
  if (props.count === 0) return t('blog.result_count', 0)
  return q ? t('blog.search_live', { count: props.count, query: q }) : t('blog.result_count', props.count)
})

onMounted(() => window.addEventListener('keydown', onGlobalKeydown, { passive: false }))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown))
</script>

<template>
  <div class="scroll-mt-24">
    <div class="flex flex-wrap items-center gap-4 border-b border-line pb-5">
      <div class="relative w-full max-w-md">
        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="7" cy="7" r="5" /><path d="m10.8 10.8 3.2 3.2" /></svg>
        <label for="blog-search" class="sr-only">{{ t('blog.search_label') }}</label>
        <input
          id="blog-search"
          ref="inputRef"
          v-model="query"
          type="search"
          class="field pr-10 pl-9"
          :placeholder="t('blog.search_placeholder')"
          autocomplete="off"
          spellcheck="false"
          @keydown="onInputKeydown"
        >
        <button
          v-if="query"
          type="button"
          class="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-focus"
          :aria-label="t('blog.search_clear')"
          @click="clearAll"
        >
          <svg viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
        </button>
        <kbd v-else class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-sm border border-lineStrong bg-surfaceMuted px-1.5 py-0.5 font-sans text-xs font-semibold text-muted" aria-hidden="true">/</kbd>
      </div>
      <p id="blog-status" role="status" aria-live="polite" class="text-sm font-medium tabular-nums text-muted">{{ statusText }}</p>
    </div>

    <nav class="mt-4 flex flex-wrap items-center gap-2" :aria-label="t('blog.category_all')">
      <button type="button" class="btn-ghost min-h-9 px-3 py-1.5 text-sm" :class="{ 'border-accent bg-accent text-accentOnAccent': !category }" :aria-pressed="!category" @click="category = null">{{ t('blog.category_all') }}</button>
      <button
        v-for="item in categories"
        :key="item"
        type="button"
        class="btn-ghost min-h-9 px-3 py-1.5 text-sm"
        :class="{ 'border-accent bg-accent text-accentOnAccent': category === item }"
        :aria-pressed="category === item"
        @click="category = category === item ? null : item"
      >{{ item }}</button>
    </nav>

    <div v-if="tags.length" class="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
      <span class="mr-1 text-sm font-semibold text-muted">{{ t('blog.filter') }}</span>
      <button
        v-for="item in tags"
        :key="item"
        type="button"
        class="btn-ghost min-h-9 px-3 py-1.5 text-sm"
        :class="{ 'border-highlight bg-highlight/15 text-highlightText dark:text-highlight': tag === item }"
        :aria-pressed="tag === item"
        @click="tag = tag === item ? null : item"
      >
        <svg v-if="tag === item" viewBox="0 0 16 16" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" /></svg>
        {{ item }}
      </button>
    </div>
  </div>
</template>