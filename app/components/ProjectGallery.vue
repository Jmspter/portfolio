<script setup lang="ts">
defineProps<{ images: string[] }>()
</script>

<template>
  <section class="mt-12 space-y-8">
    <div v-for="image in images" :key="image" class="project-frame">
      <div class="project-frame__bar" aria-hidden="true">
        <span class="h-2.5 w-2.5 rounded-full bg-accent" />
        <span class="h-2.5 w-2.5 rounded-full bg-highlight" />
        <span class="h-2.5 w-2.5 rounded-full bg-ink" />
      </div>
      <AppImage :id="image" />
    </div>
  </section>
</template>