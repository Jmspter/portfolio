import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Progresso [0..1] da rolagem de um container (padrão: a página toda).
 * Scroll handler único, passive e batcheado com requestAnimationFrame.
 * Não roda trabalho em `prefers-reduced-motion: reduce`.
 */
export function useScrollProgress(container?: Ref<HTMLElement | undefined>) {
  const progress = ref(0)
  let raf = 0

  onMounted(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    function update() {
      const host = container?.value ?? document.scrollingElement ?? document.documentElement
      const max = host.scrollHeight - host.clientHeight
      progress.value = max > 0 ? clamp01(host.scrollTop / max) : 0
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    })
  })

  return { progress }
}