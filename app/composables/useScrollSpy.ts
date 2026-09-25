import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

/**
 * Scrollspy por banda central: observa os cabeçalhos (`#id`) dentro de um
 * container e expõe `activeId`. Baseado em IntersectionObserver (sem
 * scroll handlers pesados). Re-observa quando `ids` muda (ex.: i18n).
 */
export function useScrollSpy<T extends HTMLElement>(container: Ref<T | undefined>, ids: Ref<string[]>) {
  const activeId = ref<string | null>(null)
  let observer: IntersectionObserver | undefined
  let observed = new Set<string>()

  function stop() {
    observer?.disconnect()
    observer = undefined
    observed = new Set()
  }

  function start() {
    const root = container.value
    if (!root) return
    if (!('IntersectionObserver' in window)) return

    const headings = new Map<string, Element>()
    for (const id of ids.value) {
      if (observed.has(id)) continue
      const el = root.querySelector(`#${CSS.escape(id)}`)
      if (el) headings.set(id, el)
    }
    if (!headings.size) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeId.value = entry.target.id
        }
      },
      { rootMargin: '-38% 0px -54% 0px', threshold: 0 },
    )
    for (const [id, el] of headings) {
      observed.add(id)
      observer.observe(el)
    }
  }

  onMounted(start)
  watch(ids, () => {
    stop()
    start()
  })
  onBeforeUnmount(stop)

  return { activeId }
}