<script setup lang="ts">
const { t } = useI18n()
const props = defineProps<{ error: { statusCode?: number } }>()

useSeoMeta({ title: () => `${props.error.statusCode ?? 404} · ${t('error.title')}` })
</script>

<template>
  <main class="relative flex min-h-[60vh] items-center justify-center overflow-hidden text-center">
    <div class="relative z-[1] flex flex-col items-center">
      <p class="eyebrow">{{ error.statusCode ?? 404 }}</p>
      <h1 class="mt-4 max-w-xl text-5xl font-bold leading-none text-ink sm:text-7xl">{{ t('error.title') }}</h1>
      <p class="mt-5 max-w-md text-lg leading-8 text-secondary">{{ t('error.body') }}</p>
      <NuxtLink to="/" class="btn mt-8">{{ t('error.back') }} <span aria-hidden="true">↗</span></NuxtLink>
    </div>
    <div class="absolute right-0 top-1/2 hidden h-72 w-72 -translate-y-1/2 sm:block" aria-hidden="true">
      <span class="geo-float absolute right-10 top-0 h-44 w-44 rounded-full bg-accent" />
      <span class="geo-drift absolute bottom-0 left-0 h-36 w-36 rotate-45 bg-highlight" />
      <span class="geo-spin absolute bottom-12 right-0 h-28 w-28 bg-ink" />
    </div>
  </main>
</template>