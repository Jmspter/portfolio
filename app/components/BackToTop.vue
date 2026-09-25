<script setup lang="ts">
const { t } = useI18n()
const { progress } = useScrollProgress()
const shown = computed(() => progress.value > 0.2 && progress.value < 0.99)

function goTop() {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}
</script>

<template>
  <button
    type="button"
    class="back-to-top fixed bottom-[calc(env(safe-area-inset-bottom)_+_4.75rem)] right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-[0_10px_30px_rgba(7,18,43,0.16)] transition-colors duration-200 hover:border-accent/40 hover:text-accent md:bottom-5"
    :class="{ 'is-shown': shown }"
    :aria-label="t('blog.back_top')"
    @click="goTop"
  >
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  </button>
</template>