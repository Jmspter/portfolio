<script setup lang="ts">
type Status = 'pending' | 'approved' | 'rejected'
interface AdminComment {
  id: number
  postId: string
  author: string
  body: string
  status: Status
  createdAt: string
}

const { t } = useI18n()
useSeoMeta({ title: () => t('admin.title'), robots: 'noindex, nofollow' })

const tabs: Status[] = ['pending', 'approved', 'rejected']
const status = ref<Status>('pending')

const { data: comments, refresh } = await useFetch<AdminComment[]>('/api/admin/comments', {
  query: { status },
  default: () => [],
})

async function setStatus(id: number, next: Status) {
  await $fetch(`/api/admin/comments/${id}`, { method: 'PATCH', body: { status: next } })
  await refresh()
}

async function remove(id: number) {
  await $fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div>
    <p class="eyebrow">{{ t('admin.eyebrow') }}</p>
    <h1 class="mt-3 text-4xl font-bold text-ink">{{ t('admin.title') }}</h1>

    <div class="mt-4 flex gap-2" role="tablist">
      <button
        v-for="s in tabs"
        :key="s"
        type="button"
        role="tab"
        class="btn-ghost"
        :class="{ 'border-accent bg-accent text-accentOnAccent': status === s }"
        :aria-selected="status === s"
        @click="status = s"
      >
        {{ t(`admin.${s}`) }}
      </button>
    </div>

    <p v-if="!comments.length" class="mt-8 text-muted">{{ t('admin.empty') }}</p>
    <ul v-else class="mt-8 divide-y divide-line">
      <li v-for="c in comments" :key="c.id" class="py-4">
        <p class="text-sm font-medium">
          {{ c.author }} <span class="font-normal text-muted">· {{ c.postId }}</span>
        </p>
        <p class="mt-1 whitespace-pre-line text-sm">{{ c.body }}</p>
        <div class="mt-3 flex gap-2">
          <button v-if="c.status !== 'approved'" class="btn-ghost" @click="setStatus(c.id, 'approved')">
            {{ t('admin.approve') }}
          </button>
          <button v-if="c.status !== 'rejected'" class="btn-ghost" @click="setStatus(c.id, 'rejected')">
            {{ t('admin.reject') }}
          </button>
          <button class="btn-ghost" @click="remove(c.id)">{{ t('admin.delete') }}</button>
        </div>
      </li>
    </ul>
  </div>
</template>
