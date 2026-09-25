<script setup lang="ts">
withDefaults(defineProps<{
  sticky?: boolean
}>(), {
  sticky: true,
})
</script>

<template>
  <div :class="sticky ? 'lg:sticky lg:top-24 lg:self-start' : ''">
    <div class="project-frame overflow-hidden bg-surface dark:bg-surface-raised">
      <slot />
    </div>
    <a
      v-if="sticky"
      href="#case-body"
      class="stage-hint mt-4 hidden items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted hover:text-accent lg:flex"
      aria-label="scroll"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </a>
  </div>
</template>