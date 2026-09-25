<script setup lang="ts">
withDefaults(defineProps<{
  src?: string
  alt?: string
  title?: string
  width?: string | number
  height?: string | number
}>(), {
  src: '',
  alt: '',
  title: undefined,
  width: undefined,
  height: undefined,
})
</script>

<template>
  <figure class="my-8 max-w-full">
    <img
      :src="src"
      :alt="alt"
      :title="title"
      :width="width"
      :height="height"
      loading="lazy"
      decoding="async"
      class="h-auto w-full"
    >
    <figcaption v-if="title" class="mt-2 text-center text-sm text-muted">
      {{ title }}
    </figcaption>
  </figure>
</template>