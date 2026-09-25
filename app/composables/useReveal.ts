import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Suporte a scroll-driven animations (Chrome 115+, Edge). Quando presente,
 * a revelação é 100% CSS (`animation-timeline: view()`) e nada de JS roda.
 */
export function supportsScrollDriven() {
  return typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()') === true
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/**
 * Marca <html> com js-anim uma única vez — somente quando o fallback via
 * IntersectionObserver é realmente necessário (sem scroll-driven, sem
 * reduced-motion, com IO disponível). Fora disso, o conteúdo nasce visível.
 */
let warned = false
export function ensureJsAnim() {
  if (typeof document === 'undefined' || warned) return
  warned = true
  if (supportsScrollDriven() || prefersReducedMotion()) return
  if (!('IntersectionObserver' in window)) return
  const root = document.documentElement
  if (!root.classList.contains('js-anim')) root.classList.add('js-anim')
}

export interface RevealOptions {
  threshold?: number
  rootMargin?: string
}

/**
 * Observa um elemento e marca `isVisible` quando entra na viewport.
 * SSR-safe: só toca `window`/`document` dentro de onMounted; o estado padrão
 * de `.reveal` no CSS já é visível (conteúdo nunca some sem JS).
 */
export function useReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const el = ref<T>()
  const isVisible = ref(false)
  let observer: IntersectionObserver | undefined

  function observe() {
    ensureJsAnim()
    if (!el.value) return
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            isVisible.value = true
            observer?.disconnect()
            observer = undefined
          }
        },
        {
          threshold: options.threshold ?? 0.12,
          rootMargin: options.rootMargin ?? '0px 0px -8% 0px',
        },
      )
      observer.observe(el.value)
    } else {
      isVisible.value = true
    }
  }

  onMounted(observe)
  onBeforeUnmount(() => observer?.disconnect())

  return { el, isVisible }
}