<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'blog' | 'projects' }>(), {
  variant: 'blog',
})
</script>

<template>
  <svg viewBox="0 0 160 120" class="h-28 w-36" aria-hidden="true">
    <rect width="160" height="120" fill="#07122B" />
    <template v-if="variant === 'blog'">
      <rect x="28" y="24" width="76" height="68" fill="#fff" />
      <path d="M42 43h48M42 57h34M42 71h42" stroke="#18315F" stroke-width="5" />
      <circle cx="122" cy="32" r="19" fill="#E10600" />
      <rect x="108" y="73" width="28" height="28" fill="#FFCC00" />
      <circle cx="73" cy="82" r="9" fill="#3671C6" />
    </template>
    <template v-else>
      <circle cx="48" cy="60" r="30" fill="#E10600" />
      <rect x="84" y="23" width="48" height="48" fill="#FFCC00" />
      <path d="m72 105 24-27 24 27Z" fill="#3671C6" />
    </template>
  </svg>
</template>