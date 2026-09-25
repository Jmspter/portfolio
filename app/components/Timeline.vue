<script setup lang="ts">
type TimelineItem = { year: string; title: string; body: string }

defineProps<{
  items: TimelineItem[]
}>()
</script>

<template>
  <ol class="timeline timeline--fill">
    <Reveal
      v-for="(item, index) in items"
      :key="index"
      as="li"
      direction="no-move"
      class="timeline-item grid grid-cols-[2rem_1fr] gap-4 pb-10 last:pb-0"
    >
      <span class="timeline__marker mt-1.5" aria-hidden="true" />
      <div>
        <p class="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">{{ item.year }}</p>
        <h3 class="mt-1 text-xl font-semibold text-ink">{{ item.title }}</h3>
        <p class="mt-1.5 text-base leading-7 text-secondary">{{ item.body }}</p>
      </div>
    </Reveal>
  </ol>
</template>