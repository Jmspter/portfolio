import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Sigo a "faixa central" da viewport (band-trick do IntersectionObserver):
 * a seção considerada ativa é a que cruza a banda entre 40% e 45% da altura
 * da tela. Com seções contíguas sempre há uma ativa; se houver folga, a
 * última entrada observada é mantida. SSR-safe: nada roda sem `window`.
 */
export function useActiveSection(getSections: () => HTMLElement[]) {
  const active = ref(-1)
  let observer: IntersectionObserver | undefined
  const intersects = new Map<number, boolean>()

  function pick() {
    let best = -1
    for (const [index, isIntersecting] of intersects) {
      if (isIntersecting && index > best) best = index
    }
    if (best === -1) return
    active.value = best
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    if (!('IntersectionObserver' in window)) return
    const sections = getSections()
    if (!sections.length) return
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = sections.indexOf(entry.target as HTMLElement)
          if (index >= 0) intersects.set(index, entry.isIntersecting)
        }
        pick()
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer?.observe(section))
  })
  onBeforeUnmount(() => observer?.disconnect())

  return { active }
}