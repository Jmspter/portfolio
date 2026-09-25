<script setup lang="ts">
defineProps<{
  index: number
  label: string
}>()
</script>

<template>
  <div class="chapter-opener">
    <h2 class="text-3xl font-bold text-ink">
      <span class="mr-3 align-middle text-sm font-bold uppercase tracking-[0.18em] text-accent">{{ String(index).padStart(2, '0') }}</span>{{ label }}
    </h2>
    <slot name="aside" />
  </div>
</template>