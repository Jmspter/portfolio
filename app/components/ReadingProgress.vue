<script setup lang="ts">
const { progress } = useScrollProgress()
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 top-0 z-50" aria-hidden="true">
    <span class="reading-progress block h-[3px] w-full" :style="{ transform: `scaleX(${progress})` }" />
  </div>
</template>