<script setup lang="ts">
const { t } = useI18n()

const props = withDefaults(defineProps<{
  posts: {
    path: string
    title: string
    description?: string
    excerpt?: string
    date: string
    readTime?: string
    image?: string
    cover?: string
    coverAlt?: string
  }[]
  headingLevel?: string
}>(), { headingLevel: 'h2' })

const trackRef = ref<HTMLElement>()
const slideCount = computed(() => props.posts.length)
const activeIndex = ref(0)
const prefersReduced = ref(false)

function scrollToIndex(index: number) {
  const track = trackRef.value
  if (!track) return
  const slides = Array.from(track.querySelectorAll('[data-carousel-slide]'))
  const target = slides[Math.max(0, Math.min(index, slides.length - 1))]
  target?.scrollIntoView({ behavior: prefersReduced.value ? 'auto' : 'smooth', inline: 'nearest', block: 'nearest' })
}

function updateActive() {
  const track = trackRef.value
  if (!track) return
  const slides = Array.from(track.querySelectorAll('[data-carousel-slide]')) as HTMLElement[]
  if (!slides.length) return
  const trackLeft = track.getBoundingClientRect().left
  let nearest = 0
  let nearestDist = Infinity
  slides.forEach((slide, index) => {
    const dist = Math.abs(slide.getBoundingClientRect().left - trackLeft)
    if (dist < nearestDist) {
      nearestDist = dist
      nearest = index
    }
  })
  activeIndex.value = nearest
}

function prev() { scrollToIndex(activeIndex.value - 1) }
function next() { scrollToIndex(activeIndex.value + 1) }

let rafId = 0
function onScroll() {
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(updateActive)
}

let intervalId: ReturnType<typeof setInterval> | undefined
let paused = false

function startAutoplay() {
  if (prefersReduced.value || slideCount.value < 2 || intervalId) return
  intervalId = setInterval(() => {
    if (!paused) scrollToIndex((activeIndex.value + 1) % slideCount.value)
  }, 5200)
}

function stopAutoplay() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = undefined
  }
}

onMounted(() => {
  prefersReduced.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  updateActive()
  startAutoplay()
})
onBeforeUnmount(stopAutoplay)
</script>

<template>
  <section class="carousel" aria-roledescription="carousel" :aria-label="t('blog.carousel_label')">
    <div class="mb-4 flex items-end justify-between gap-4">
      <component :is="headingLevel" class="font-display text-sm font-semibold uppercase tracking-[0.18em] text-muted">{{ t('blog.featured') }}</component>
      <div class="flex items-center gap-3">
        <p class="hidden text-sm tabular-nums text-muted sm:block">
          <span class="font-semibold text-ink">{{ activeIndex + 1 }}</span>
          <span aria-hidden="true"> / </span>
          <span>{{ slideCount }}</span>
        </p>
        <div class="flex gap-2">
          <button
            type="button"
            class="btn-icon min-h-10 min-w-10"
            :aria-label="t('blog.carousel_prev')"
            aria-controls="featured-track"
            :disabled="activeIndex === 0"
            @click="prev"
          >
            <svg viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.5 14 4.5 8l6-6" /></svg>
          </button>
          <button
            type="button"
            class="btn-icon min-h-10 min-w-10"
            :aria-label="t('blog.carousel_next')"
            aria-controls="featured-track"
            :disabled="slideCount < 2 || activeIndex === slideCount - 1"
            @click="next"
          >
            <svg viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 2l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </div>
    <div
      id="featured-track"
      ref="trackRef"
      class="carousel__track"
      role="list"
      tabindex="0"
      :aria-label="t('blog.featured')"
      @scroll.passive="onScroll"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
      @focusin="paused = true"
      @focusout="paused = false"
    >
      <article
        v-for="post in posts"
        :key="post.path"
        data-carousel-slide
        role="listitem"
        class="carousel__slide group"
      >
        <NuxtLink :to="post.path" class="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-200 hover:border-highlight/50 dark:bg-surface-raised" :aria-label="post.title">
          <span class="relative block overflow-hidden">
            <img
              v-if="post.image"
              :src="post.image"
              :alt="post.coverAlt ?? ''"
              class="aspect-video w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            >
            <AppImage
              v-else-if="post.cover"
              :id="post.cover"
              :alt="post.coverAlt"
              class="aspect-video w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
            <span v-else class="grid aspect-video w-full place-items-center bg-surface-muted dark:bg-surface-raised">
              <svg class="h-10 w-10 text-accent/70" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 22 22H2L12 2Z" /></svg>
            </span>
          </span>
          <span class="flex flex-1 flex-col gap-3 p-5">
            <span class="text-xs font-semibold uppercase tracking-wider text-accent">{{ post.category }}</span>
            <span class="font-display text-lg font-bold leading-snug text-ink transition-colors duration-200 group-hover:text-accent">{{ post.title }}</span>
            <span class="mt-auto text-xs text-muted">{{ post.date }} · {{ t('blog.reading_time', { minutes: readMinutesOf(post) }) }}</span>
          </span>
        </NuxtLink>
      </article>
    </div>
  </section>
</template>

<style scoped>
.carousel__track {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 0.5rem;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
}
.carousel__track::-webkit-scrollbar { height: 6px; }
.carousel__track::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--text), transparent 70%); border-radius: 999px; }
.carousel__track::-webkit-scrollbar-track { background: color-mix(in srgb, var(--bg), transparent 50%); }
.carousel__slide {
  flex: 0 0 85%;
  scroll-snap-align: start;
  scroll-margin-left: 0;
}
@media (min-width: 480px) { .carousel__slide { flex-basis: 380px; } }
@media (prefers-reduced-motion: reduce) {
  .carousel__track { scroll-behavior: auto; }
}
</style>