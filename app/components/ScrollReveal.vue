<script setup lang="ts">
const props = withDefaults(defineProps<{ delay?: number }>(), { delay: 0 })
</script>

<template>
  <Reveal :delay="delay">
    <slot />
  </Reveal>
</template>