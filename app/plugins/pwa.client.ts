export default defineNuxtPlugin(() => {
  if (!import.meta.prod) return
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator)) return
  if (!window.isSecureContext) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
})