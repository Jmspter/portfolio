<script setup lang="ts">
const { t } = useI18n()
const blog = useCollectionName('blog')
const projects = useCollectionName('projects')

// `watch` refaz a busca quando o idioma muda (a URL não muda com no_prefix)
const { data: posts } = await useAsyncData(
  'home-posts',
  () => queryCollection(blog.value as 'blog_pt').all(),
  { watch: [blog], default: () => [] },
)
const { data: featured } = await useAsyncData(
  'home-projects',
  () => queryCollection(projects.value as 'projects_pt').limit(3).all(),
  { watch: [projects], default: () => [] },
)

useSeoMeta({ description: () => t('home.subtitle') })

const sortedPosts = computed(() => [...posts.value].sort((a, b) => dateKey(b.date) - dateKey(a.date)))
const featuredPost = computed(() => sortedPosts.value.find(p => p.featured) ?? sortedPosts.value[0])
const restPosts = computed(() => sortedPosts.value.filter(p => p !== featuredPost.value).slice(0, 3))
</script>

<template>
  <div class="space-y-24 lg:space-y-32">
    <section class="relative grid gap-10 overflow-hidden border-b border-line pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:pb-24">
      <div class="relative z-[1] max-w-3xl">
        <Reveal as="p" direction="no-move" class="eyebrow">{{ t('home.eyebrow') }}</Reveal>
        <Reveal as="h1" :delay="90" direction="up" class="mt-4 max-w-2xl text-5xl font-bold leading-[0.98] text-ink sm:text-7xl">{{ t('home.title') }}</Reveal>
        <Reveal :delay="180" direction="up" class="mt-7 max-w-xl text-lg leading-8 text-secondary sm:text-xl">{{ t('home.subtitle') }}</Reveal>
        <Reveal :delay="260" class="mt-8 flex flex-wrap gap-3">
          <NuxtLink to="/projects" class="btn">{{ t('home.projects_cta') }} <span aria-hidden="true">↗</span></NuxtLink>
          <NuxtLink to="/contact" class="btn-ghost">{{ t('home.contact_cta') }}</NuxtLink>
        </Reveal>
        <AppHeroArt />
      </div>
      <GeoStage class="hidden px-6 lg:block" />
    </section>

    <section class="scroll-mt-24">
      <ChapterHeading :index="1" :label="t('home.featured_projects')">
        <template #aside>
          <NuxtLink to="/projects" class="hidden whitespace-nowrap text-sm font-semibold text-accent underline-offset-2 hover:underline sm:inline">{{ t('home.view_all') }} <span aria-hidden="true">↗</span></NuxtLink>
        </template>
      </ChapterHeading>
      <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Reveal v-for="(p, index) in featured" :key="p.path" :delay="index * 90">
          <ProjectTile
            :to="p.path"
            :title="p.title"
            :description="p.description"
            :tags="p.stack"
            :cover="p.gallery?.[0] ?? p.cover"
            :cover-alt="p.coverAlt"
          />
        </Reveal>
      </div>
    </section>

    <section class="relative overflow-hidden">
      <div class="max-w-3xl">
        <ChapterHeading :index="2" :label="t('home.chapter_think')" />
      </div>
      <Reveal direction="up" :delay="120">
        <figure class="relative mt-10 overflow-hidden rounded-2xl border border-line bg-surface p-8 sm:p-14 dark:bg-surface-raised">
          <span class="geo-spin absolute -right-6 -top-6 h-24 w-24 rounded-lg bg-highlight/20" aria-hidden="true" />
          <blockquote class="relative font-display text-2xl font-medium leading-snug text-ink sm:text-3xl whitespace-pre-line">
            “{{ t('home.think.a') }}<mark class="mark-fill">{{ t('home.think.mark') }}</mark>{{ t('home.think.b') }}”
          </blockquote>
          <figcaption class="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-muted">James Peter</figcaption>
        </figure>
      </Reveal>
    </section>

    <section class="scroll-mt-24">
<ChapterHeading :index="3" :label="t('home.latest_posts')">
        <template #aside>
          <NuxtLink to="/blog" class="hidden whitespace-nowrap text-sm font-semibold text-accent underline-offset-2 hover:underline sm:inline">{{ t('home.view_all') }} <span aria-hidden="true">↗</span></NuxtLink>
        </template>
      </ChapterHeading>
      <Reveal v-if="featuredPost" direction="up">
        <ArticleFeature :post="featuredPost" tag="h3" class="mt-8" />
      </Reveal>
      <div v-if="restPosts.length" class="mt-10 space-y-2">
        <Reveal v-for="(p, index) in restPosts" :key="p.path" :delay="index * 90">
          <PostCard
            :to="p.path"
            :title="p.title"
            :description="p.description ?? p.excerpt"
            :meta="`${p.date} · ${t('blog.reading_time', { minutes: readMinutesOf(p) })}`"
            :tags="p.tags"
            :category="p.category"
          />
        </Reveal>
      </div>
    </section>

    <section class="scroll-mt-24 border-t border-line pt-10">
      <div class="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <Reveal direction="up">
          <div>
            <ChapterHeading :index="4" :label="t('home.chapter_talk')" />
            <p class="mt-5 max-w-xl text-lg leading-8 text-secondary">{{ t('home.talk.body') }}</p>
          </div>
        </Reveal>
        <Reveal direction="up" :delay="120">
          <NuxtLink to="/contact" class="btn">{{ t('home.contact_cta') }} <span aria-hidden="true">↗</span></NuxtLink>
        </Reveal>
      </div>
    </section>
  </div>
</template>