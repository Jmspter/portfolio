<script setup lang="ts">
import { getImagePath, getImageSlot } from '~/data/images'

const props = withDefaults(defineProps<{
  id: string
  alt?: string
  decorative?: boolean
}>(), {
  alt: undefined,
  decorative: undefined,
})

const { t } = useI18n()
const slot = computed(() => getImageSlot(props.id))
const hasImage = ref(true)
const isDevelopment = import.meta.dev

const imageAlt = computed(() => props.decorative ?? slot.value.decorative
  ? ''
  : props.alt ?? t(`images.${props.id}.alt`))

const sourceSet = (extension: string) => slot.value.widths
  .map(width => `${getImagePath(props.id, width, extension)} ${width}w`)
  .join(', ')

function markMissing() {
  hasImage.value = false
}
</script>

<template>
  <figure
    class="app-image relative isolate overflow-hidden"
    :style="{ aspectRatio: slot.aspectRatio, backgroundColor: slot.dominantColor }"
  >
    <picture v-if="hasImage" class="block h-full w-full">
      <source type="image/avif" :srcset="sourceSet('avif')" :sizes="slot.sizes">
      <source type="image/webp" :srcset="sourceSet('webp')" :sizes="slot.sizes">
      <img
        :src="getImagePath(id, slot.widths[0], slot.fallback)"
        :srcset="sourceSet(slot.fallback)"
        :sizes="slot.sizes"
        :width="slot.width"
        :height="slot.height"
        :alt="imageAlt"
        :loading="slot.loading"
        decoding="async"
        :fetchpriority="slot.fetchPriority"
        class="h-full w-full object-cover"
        @error="markMissing"
      >
    </picture>

    <svg v-else viewBox="0 0 400 300" class="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect width="400" height="300" style="fill: rgb(var(--bg))" />
      <circle cx="112" cy="92" r="62" fill="#E10600" />
      <rect x="230" y="46" width="94" height="94" fill="#FFCC00" />
      <path d="M56 270 188 142l132 128Z" fill="#3671C6" />
      <path d="M0 236h400M0 204h400M0 172h400" stroke="#fff" stroke-opacity=".12" />
      <text v-if="isDevelopment" x="200" y="286" text-anchor="middle" fill="#fff" font-size="12">
        {{ t('images.pending', { id }) }}
      </text>
    </svg>
  </figure>
</template>