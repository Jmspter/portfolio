<script setup lang="ts">
const { t } = useI18n()
const collection = useCollectionName('blog')

const { data: posts } = await useAsyncData(
  'blog-list',
  () => queryCollection(collection.value as 'blog_pt').all(),
  { watch: [collection], default: () => [] },
)

const sortedPosts = computed(() =>
  [...posts.value].sort((a, b) => dateKey(b.date) - dateKey(a.date)))

const query = ref('')
const debouncedQuery = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | undefined
watch(query, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { debouncedQuery.value = value.trim().toLowerCase() }, 160)
})
onBeforeUnmount(() => clearTimeout(debounceTimer))

const activeCategory = ref<string | null>(null)
const activeTag = ref<string | null>(null)

const allCategories = computed(() => [...new Set(posts.value.map(p => p.category).filter(Boolean))].sort())
const allTags = computed(() => [...new Set(posts.value.flatMap(p => p.tags))].sort())

const searching = computed(() => !!(debouncedQuery.value || activeCategory.value || activeTag.value))
const total = computed(() => posts.value.length)

const filtered = computed(() => {
  const q = debouncedQuery.value
  return sortedPosts.value.filter((p) => {
    if (activeCategory.value && p.category !== activeCategory.value) return false
    if (activeTag.value && !p.tags?.includes(activeTag.value)) return false
    if (!q) return true
    const hay = [p.title, p.description, p.excerpt, p.category, (p.tags ?? []).join(' ')]
      .filter(Boolean).join(' \n ').toLowerCase()
    return hay.includes(q)
  })
})

const lead = computed(() => sortedPosts.value[0])
const subLeads = computed(() => sortedPosts.value.slice(1, 3))
const foldPosts = computed(() => sortedPosts.value.slice(3, 7))
const mainPosts = computed(() => sortedPosts.value.slice(7))
const notesPosts = computed(() => sortedPosts.value)

function clearFilters() {
  query.value = ''
  debouncedQuery.value = ''
  activeCategory.value = null
  activeTag.value = null
}

useSeoMeta({
  title: () => withSiteTitle(t('blog.title')),
  description: () => t('blog.intro'),
})
</script>

<template>
  <div class="space-y-12">
    <Reveal as="section" direction="up" class="scroll-mt-24 border-t-4 border-accent pt-6">
      <p class="eyebrow">{{ t('nav.blog') }}</p>
      <h1 class="mt-3 max-w-prose font-editorial text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">{{ t('blog.title') }}</h1>
      <p class="mt-5 max-w-reading text-lg leading-8 text-secondary">{{ t('blog.intro') }}</p>
      <p class="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-muted">{{ t('blog.result_count', total) }}</p>
    </Reveal>

    <Reveal :delay="40" direction="up">
      <BlogSearchBar
        v-model:query="query"
        v-model:category="activeCategory"
        v-model:tag="activeTag"
        :categories="allCategories"
        :tags="allTags"
        :count="filtered.length"
        :total="total"
        :searching="searching"
        :live-query="debouncedQuery"
      />
    </Reveal>

    <Transition name="list-fade" mode="out-in">
      <div v-if="!sortedPosts.length" key="empty" class="scroll-mt-24 flex flex-col items-start gap-4 text-muted">
        <GeometricIllustration variant="blog" />
        <p>{{ t('blog.empty') }}</p>
      </div>

      <div v-else-if="searching" key="search" class="scroll-mt-24">
        <p v-if="!filtered.length" class="flex flex-col items-start gap-4 py-6 text-muted">
          <GeometricIllustration variant="blog" class="h-32 w-32" />
          <span class="text-lg font-medium text-ink">{{ t('blog.no_results', { query: debouncedQuery }) }}</span>
          <button type="button" class="btn-ghost" @click="clearFilters">{{ t('blog.search_clear') }}</button>
        </p>
        <div v-else>
          <BlogRow
            v-for="p in filtered"
            :key="p.path"
            :to="p.path"
            :image="p.image"
            :cover="p.cover"
            :cover-alt="p.coverAlt"
            :category="p.category"
            :title="p.title"
            :description="p.description ?? p.excerpt"
            :date="p.date"
            :read-minutes="readMinutesOf(p)"
            :tags="p.tags"
            :highlight="debouncedQuery"
          />
        </div>
      </div>

      <div v-else key="issue" class="scroll-mt-24 space-y-14">
        <section class="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div class="lg:col-span-8">
            <h2 class="border-t border-line pt-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">{{ t('blog.section_destaques') }}</h2>
            <div v-if="lead" class="mt-6">
              <BlogLead
                :to="lead.path"
                :image="lead.image"
                :cover="lead.cover"
                :cover-alt="lead.coverAlt"
                :category="lead.category"
                :title="lead.title"
                :description="lead.description ?? lead.excerpt"
                :date="lead.date"
                :read-minutes="readMinutesOf(lead)"
                :author="lead.author?.name"
              />
            </div>
          </div>
          <div class="lg:col-span-4">
            <div v-if="subLeads.length" class="border-t border-line pt-4 lg:border-t-0 lg:pt-0">
              <BlogSubLead
                v-for="p in subLeads"
                :key="p.path"
                :to="p.path"
                :image="p.image"
                :cover="p.cover"
                :cover-alt="p.coverAlt"
                :category="p.category"
                :title="p.title"
                :date="p.date"
                :read-minutes="readMinutesOf(p)"
              />
            </div>
          </div>
        </section>

        <section v-if="foldPosts.length">
          <h2 class="border-t border-line pt-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">{{ t('blog.section_latest') }}</h2>
          <div class="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            <BlogGridItem
              v-for="p in foldPosts"
              :key="p.path"
              :to="p.path"
              :image="p.image"
              :cover="p.cover"
              :cover-alt="p.coverAlt"
              :category="p.category"
              :title="p.title"
              :description="p.description ?? p.excerpt"
              :date="p.date"
              :read-minutes="readMinutesOf(p)"
            />
          </div>
        </section>

        <section class="grid gap-8 lg:grid-cols-12">
          <div v-if="mainPosts.length" class="lg:col-span-8">
            <h2 class="border-t border-line pt-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">{{ t('blog.all') }}</h2>
            <div class="mt-0">
              <BlogRow
                v-for="p in mainPosts"
                :key="p.path"
                :to="p.path"
                :image="p.image"
                :cover="p.cover"
                :cover-alt="p.coverAlt"
                :category="p.category"
                :title="p.title"
                :description="p.description ?? p.excerpt"
                :date="p.date"
                :read-minutes="readMinutesOf(p)"
                :tags="p.tags"
              />
            </div>
          </div>
          <div class="lg:col-span-4">
            <BlogNotesColumn
              :label="t('blog.section_notes')"
              :posts="notesPosts.map(p => ({ to: p.path, title: p.title, date: p.date, readMinutes: readMinutesOf(p) }))"
            />
          </div>
        </section>
      </div>
    </Transition>
  </div>
</template>