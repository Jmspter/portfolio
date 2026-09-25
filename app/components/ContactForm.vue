<script setup lang="ts">
const { t } = useI18n()

const form = reactive({ name: '', email: '', message: '', website: '' })
const token = ref('')
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const turnstile = ref<{ reset: () => void }>()

const messageLength = computed(() => form.message.length)

async function submit() {
  status.value = 'sending'
  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...form, token: token.value } })
    status.value = 'success'
    Object.assign(form, { name: '', email: '', message: '', website: '' })
  } catch {
    status.value = 'error'
  } finally {
    turnstile.value?.reset()
    token.value = ''
  }
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div class="grid gap-6 sm:grid-cols-2">
      <label class="block text-sm font-semibold text-ink">
        <span>{{ t('contact.name') }}<span class="text-accent" aria-hidden="true"> *</span></span>
        <input v-model="form.name" class="field mt-2" required minlength="2" maxlength="100" autocomplete="name">
      </label>
      <label class="block text-sm font-semibold text-ink">
        <span>{{ t('contact.email') }}<span class="text-accent" aria-hidden="true"> *</span></span>
        <input v-model="form.email" type="email" class="field mt-2" required autocomplete="email">
      </label>
    </div>

    <label class="block text-sm font-semibold text-ink">
      <span>{{ t('contact.message') }}<span class="text-accent" aria-hidden="true"> *</span></span>
      <textarea v-model="form.message" class="field mt-2 resize-y" rows="6" required minlength="10" maxlength="5000" />
    </label>
    <p class="-mt-3 text-right text-xs font-semibold tabular-nums text-muted" aria-hidden="true">{{ messageLength }} / 5000</p>

    <!-- honeypot: escondido de humanos -->
    <input v-model="form.website" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true">

    <TurnstileWidget ref="turnstile" @verified="token = $event" @expired="token = ''" />

    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <button
        class="btn min-h-12 px-6"
        :disabled="status === 'sending' || !token"
        :aria-busy="status === 'sending'"
      >
        {{ status === 'sending' ? t('contact.sending') : t('contact.send') }}
        <svg v-if="status !== 'sending'" viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 13 13 3M6 3h7v7" /></svg>
      </button>
      <p class="text-sm text-muted">{{ t('contact.required_note') }}</p>
    </div>

    <p v-if="status === 'success'" role="status" class="border-l-4 border-highlight bg-highlight/15 p-3 text-sm text-ink">{{ t('contact.success') }}</p>
    <p v-if="status === 'error'" role="alert" class="border-l-4 border-danger bg-danger/10 p-3 text-sm text-danger">{{ t('contact.error') }}</p>
  </form>
</template>