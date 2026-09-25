<script setup lang="ts">
type RevealAs = 'div' | 'section' | 'article' | 'li' | 'span' | 'header'
type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'no-move'

const props = withDefaults(defineProps<{
  as?: RevealAs
  delay?: number
  direction?: RevealDirection
  threshold?: number
}>(), {
  as: 'div',
  delay: 0,
  direction: 'up',
  threshold: 0.12,
})

const { el, isVisible } = useReveal({ threshold: props.threshold })
const directionClass = computed(() => `reveal--${props.direction}`)
</script>

<template>
  <component
    :is="as"
    ref="el"
    class="reveal"
    :class="[directionClass, { 'is-visible': isVisible }]"
    :style="{ '--reveal-delay': `${delay}ms` }"
  >
    <slot />
  </component>
</template>