<script setup lang="ts">
const props = defineProps<{ postId: string }>()
const { t } = useI18n()
const status = ref<'idle' | 'loading' | 'error'>('idle')

const types = [
  { type: 'like', icon: '👍' },
  { type: 'love', icon: '❤️' },
] as const

const { data, refresh } = await useFetch<{ type: string; count: number; mine: boolean }[]>(
  '/api/reactions',
  { query: { postId: props.postId }, default: () => [] },
)

const info = (type: string) => data.value.find(r => r.type === type) ?? { count: 0, mine: false }

async function toggle(type: string) {
  status.value = 'loading'
  try {
    await $fetch('/api/reactions', { method: 'POST', body: { postId: props.postId, type } })
    await refresh()
    status.value = 'idle'
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      v-for="r in types"
      :key="r.type"
      type="button"
      class="btn-ghost gap-1.5"
      :class="{ 'border-accent bg-accent/10': info(r.type).mine }"
      :disabled="status === 'loading'"
      :aria-pressed="info(r.type).mine"
      :aria-label="t(`reactions.${r.type}`)"
      @click="toggle(r.type)"
    >
      <span aria-hidden="true">{{ r.icon }}</span>
      <span :key="`${r.type}-${info(r.type).count}`" class="react-count inline-block">{{ info(r.type).count }}</span>
    </button>
    <span v-if="status === 'loading'" class="text-sm text-muted" role="status">{{ t('reactions.loading') }}</span>
    <span v-if="status === 'error'" class="text-sm text-danger" role="alert">{{ t('reactions.error') }}</span>
  </div>
</template>
