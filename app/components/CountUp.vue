<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: number
  duration?: number
}>(), {
  value: 0,
  duration: 1100,
})

const { locale } = useI18n()
const shown = ref(props.value)
const el = ref<HTMLElement>()
let raf = 0
let observer: IntersectionObserver | undefined

const formatted = computed(() =>
  new Intl.NumberFormat(locale.value === 'pt' ? 'pt-BR' : 'en-US').format(shown.value),
)

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function run() {
  if (props.duration <= 0 || prefersReducedMotion()) return
  cancelAnimationFrame(raf)
  const start = performance.now()
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / props.duration)
    const eased = 1 - Math.pow(1 - p, 3)
    shown.value = Math.round(props.value * eased)
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  if (prefersReducedMotion()) return
  shown.value = 0
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer?.disconnect()
          observer = undefined
          run()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el.value!)
  } else {
    run()
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
})
</script>

<template>
  <span ref="el" class="count-value"><slot name="prefix" /><slot :value="formatted">{{ formatted }}</slot><slot name="suffix" /></span>
</template>