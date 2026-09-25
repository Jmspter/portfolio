<script setup lang="ts">
withDefaults(defineProps<{
  count: number
  active?: number
  getSectionLabel?: (index: number) => string
}>(), {
  active: -1,
  getSectionLabel: (index: number) => `#${index + 1}`,
})

const emit = defineEmits<{
  select: [index: number]
}>()

function onKeydown(index: number, e: KeyboardEvent) {
  if (e.key !== 'Enter' && e.key !== ' ') return
  e.preventDefault()
  emit('select', index)
}
</script>

<template>
  <div class="story-rail">
    <button
      v-for="i in count"
      :key="i"
      type="button"
      class="story-rail__dot"
      :class="{
        'is-past': typeof active === 'number' && active > i - 1,
        'is-current': active === i - 1,
      }"
      :aria-label="getSectionLabel(i - 1)"
      :aria-current="active === i - 1 ? 'step' : undefined"
      :tabindex="active === i - 1 ? 0 : -1"
      @click="emit('select', i - 1)"
      @keydown="onKeydown(i - 1, $event)"
    />
  </div>
</template>