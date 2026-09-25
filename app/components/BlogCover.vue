<script setup lang="ts">
const props = withDefaults(defineProps<{
  image?: string
  cover?: string
  alt?: string
  ratio?: '16/10' | '16/9' | '3/2'
  priority?: boolean
}>(), {
  image: undefined,
  cover: undefined,
  alt: '',
  ratio: '16/10',
  priority: false,
})

const broken = ref(false)
watch(() => props.image, () => { broken.value = false })

const ratioClass = computed(() => props.ratio === '3/2'
  ? 'aspect-[3/2]'
  : props.ratio === '16/9' ? 'aspect-video' : 'aspect-[16/10]')
</script>

<template>
  <span class="relative block w-full overflow-hidden bg-baseBg" :class="ratioClass">
    <img
      v-if="image && !broken"
      :src="image"
      :alt="alt"
      class="absolute inset-0 h-full w-full object-cover"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      @error="broken = true"
    >
    <AppImage v-else-if="cover" :id="cover" :alt="alt" class="absolute inset-0 h-full w-full" />
    <svg v-else viewBox="0 0 400 300" class="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="300" fill="#07122B" />
      <circle cx="112" cy="92" r="62" fill="#E10600" />
      <rect x="230" y="46" width="94" height="94" fill="#FFCC00" />
      <path d="M56 270 188 142l132 128Z" fill="#3671C6" />
      <path d="M0 236h400M0 204h400M0 172h400" stroke="#fff" stroke-opacity=".12" />
    </svg>
  </span>
</template>