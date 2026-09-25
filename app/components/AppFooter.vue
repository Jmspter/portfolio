<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <footer class="mt-16 border-t border-line">
    <div class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)_+_5rem)] pt-8 text-sm text-muted dark:text-secondary sm:flex-row sm:items-center sm:px-6 md:pb-8">
      <span class="font-display font-semibold text-ink">James Peter<span class="text-accent" aria-hidden="true">.</span></span>
      <span>© {{ new Date().getFullYear() }}. {{ t('footer.rights') }}</span>
    </div>
  </footer>
</template>
