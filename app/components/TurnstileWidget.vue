<script setup lang="ts">
// Renderiza o Cloudflare Turnstile e emite o token quando o desafio é resolvido.
const emit = defineEmits<{ (e: 'verified', token: string): void; (e: 'expired'): void }>()
const config = useRuntimeConfig()
const el = ref<HTMLElement>()
let widgetId: string | undefined

const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).turnstile) return resolve()
    const existing = document.querySelector(`script[src="${SRC}"]`)
    const script = existing ?? Object.assign(document.createElement('script'), { src: SRC, async: true })
    script.addEventListener('load', () => resolve())
    script.addEventListener('error', () => reject(new Error('turnstile')))
    if (!existing) document.head.appendChild(script)
  })
}

onMounted(async () => {
  await loadScript()
  widgetId = (window as any).turnstile.render(el.value, {
    sitekey: config.public.turnstileSiteKey,
    callback: (token: string) => emit('verified', token),
    'expired-callback': () => emit('expired'),
  })
})

onBeforeUnmount(() => {
  if (widgetId) (window as any).turnstile?.remove(widgetId)
})

function reset() {
  if (widgetId) (window as any).turnstile?.reset(widgetId)
}
defineExpose({ reset })
</script>

<template>
  <div ref="el" />
</template>
