<script setup lang="ts">
const props = defineProps<{ postId: string }>()
const { t, locale } = useI18n()

const { data: comments, refresh, pending: commentsPending } = await useFetch<{ id: number; author: string; body: string; createdAt: string }[]>(
  '/api/comments',
  { query: { postId: props.postId }, default: () => [] },
)

const form = reactive({ author: '', body: '', website: '' })
const token = ref('')
const status = ref<'idle' | 'sending' | 'pending' | 'error'>('idle')
const turnstile = ref<{ reset: () => void }>()

const fmt = (d: string) => new Date(d).toLocaleDateString(locale.value === 'pt' ? 'pt-BR' : 'en-US')

async function submit() {
  status.value = 'sending'
  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: { postId: props.postId, ...form, token: token.value },
    })
    status.value = 'pending'
    Object.assign(form, { author: '', body: '', website: '' })
    await refresh()
  } catch {
    status.value = 'error'
  } finally {
    turnstile.value?.reset()
    token.value = ''
  }
}
</script>

<template>
  <section class="mt-16 border-t border-line pt-10">
    <h2 class="text-3xl font-bold text-ink">{{ t('comments.title') }}</h2>

    <p v-if="commentsPending" class="mt-4 text-sm text-muted" role="status">{{ t('comments.sending') }}</p>
    <p v-else-if="!comments.length" class="mt-4 text-sm text-muted">{{ t('comments.empty') }}</p>
    <ul v-else class="mt-6 max-w-reading divide-y divide-line">
      <li v-for="c in comments" :key="c.id" class="py-3">
        <p class="text-sm font-semibold">
          {{ c.author }} <span class="font-normal text-muted">{{ fmt(c.createdAt) }}</span>
        </p>
        <p class="mt-1 whitespace-pre-line text-sm">{{ c.body }}</p>
      </li>
    </ul>

    <form class="mt-10 max-w-2xl space-y-5" @submit.prevent="submit">
      <label class="block text-sm font-semibold">
        {{ t('comments.name') }}
        <input v-model="form.author" class="field mt-1" required minlength="2" maxlength="60">
      </label>
      <label class="block text-sm font-semibold">
        {{ t('comments.body') }}
        <textarea v-model="form.body" class="field mt-1" rows="4" required minlength="2" maxlength="2000" />
      </label>
      <input v-model="form.website" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true">

      <TurnstileWidget ref="turnstile" @verified="token = $event" @expired="token = ''" />

      <button class="btn" :disabled="status === 'sending' || !token">
        {{ status === 'sending' ? t('comments.sending') : t('comments.send') }}
      </button>

      <p v-if="status === 'pending'" role="status" class="border-l-4 border-highlight bg-highlight/15 p-3 text-sm text-ink">{{ t('comments.pending') }}</p>
      <p v-if="status === 'error'" role="alert" class="border-l-4 border-danger bg-danger/10 p-3 text-sm text-danger">{{ t('comments.error') }}</p>
    </form>
  </section>
</template>
