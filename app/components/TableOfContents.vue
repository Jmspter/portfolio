<script setup lang="ts">
type TocItem = { id: string; title: string; depth: number }

const props = withDefaults(defineProps<{
  container?: Ref<HTMLElement | undefined>
  compact?: boolean
}>(), {
  container: undefined,
  compact: false,
})

const { t } = useI18n()

const el = ref<HTMLElement>()
const items = ref<TocItem[]>([])
const ids = ref<string[]>([])
const mounted = ref(false)

const rootRef = computed<HTMLElement | undefined>(() =>
  props.container?.value ?? el.value?.closest('article') ?? undefined,
)

const { activeId } = useScrollSpy(rootRef, ids)

let observer: MutationObserver | undefined
let retries = 0

function scan() {
  const root = rootRef.value
  if (!root) return
  const found: TocItem[] = []
  for (const heading of root.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]')) {
    const text = heading.textContent?.trim()
    if (!text) continue
    found.push({ id: heading.id, title: text, depth: Number(heading.tagName[1]) })
  }
  items.value = found
  ids.value = found.map((item) => item.id)
  if (found.length) {
    observer?.disconnect()
    observer = undefined
  }
}

function ensureScan() {
  if (items.value.length || retries++ > 30) return
  requestAnimationFrame(scan)
}

function watchRoot() {
  observer?.disconnect()
  observer = undefined
  const root = rootRef.value
  if (root && 'MutationObserver' in window) {
    observer = new MutationObserver(scan)
    observer.observe(root, { childList: true, subtree: true })
  }
  scan()
  ensureScan()
}

onMounted(() => {
  watchRoot()
  mounted.value = true
})

watch(rootRef, watchRoot)

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="el">
    <nav
      v-if="mounted && items.length"
      :class="compact ? 'text-sm' : 'text-base'"
      :aria-label="t('blog.toc')"
    >
      <p :class="compact ? 'text-xs' : 'text-sm'" class="font-display font-bold uppercase tracking-[0.18em] text-muted">{{ t('blog.toc') }}</p>
      <ul :class="compact ? 'mt-3 space-y-1.5' : 'mt-4 space-y-2'">
        <li v-for="item in items" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="inline-block rounded-md py-0.5 transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-focus"
            :class="[
              activeId === item.id ? 'font-semibold text-accent' : 'text-secondary',
              item.depth === 3 ? (compact ? 'pl-3' : 'pl-5') : '',
            ]"
          >{{ item.title }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>