<script setup lang="ts">
const { locale, setLocale, t } = useI18n()
const colorMode = useColorMode()

const siteName = 'James Peter'
const languages = [
  { code: 'pt', name: 'Português', flag: 'br' },
  { code: 'en', name: 'English', flag: 'us' },
] as const

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/projects', key: 'nav.projects' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
]

const isScrolled = ref(false)
const isDark = computed(() => colorMode.value === 'dark')

const toggleTheme = () => { colorMode.preference = isDark.value ? 'light' : 'dark' }

function onScroll() {
  isScrolled.value = window.scrollY > 8
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header
    class="glass sticky top-0 z-20 hidden border-b transition-[border-color,box-shadow,background-color] duration-200 md:block"
    :class="isScrolled
      ? 'border-line shadow-[0_8px_30px_rgba(7,18,43,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
      : 'border-transparent'"
    >
    <nav
      class="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-3"
      :aria-label="t('nav.navigation')"
    >
      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-ink"
      >
        <svg viewBox="0 0 24 24" class="h-6 w-6" aria-hidden="true">
          <circle cx="6" cy="6" r="5" class="fill-accent" />
          <rect x="13" y="1" width="10" height="10" class="fill-highlight" />
          <path d="M1 23 12 13l11 10Z" class="fill-ink" />
        </svg>
        {{ siteName }}
      </NuxtLink>

      <div class="flex items-center gap-7">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link-underline relative py-2 text-sm font-medium text-ink transition-colors hover:text-accent dark:hover:text-accent"
        >
          {{ t(link.key) }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2">
        <div role="group" :aria-label="t('nav.language')" class="flex items-center gap-1">
          <button
            v-for="l in languages"
            :key="l.code"
            type="button"
            :lang="l.code"
            :aria-label="l.name"
            :aria-pressed="locale === l.code"
            class="flex h-9 w-9 items-center justify-center rounded-full transition duration-150 active:scale-95 motion-reduce:transform-none"
            :class="locale === l.code
              ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface dark:ring-offset-base-bg'
              : 'opacity-60 hover:opacity-100'"
            @click="setLocale(l.code)"
          >
            <img
              :src="`/flags/${l.flag}.svg`"
              alt=""
              width="28"
              height="28"
              class="h-7 w-7 rounded-full"
            >
          </button>
        </div>

        <ClientOnly>
          <button
            class="flex h-9 w-9 items-center justify-center"
            type="button"
            :aria-label="t('nav.dark_mode')"
            :aria-pressed="isDark"
            @click="toggleTheme"
          >
            <svg :key="isDark ? 'light' : 'dark'" viewBox="0 0 24 24" class="theme-swap h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <g v-if="isDark">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </g>
              <path v-else d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
            </svg>
          </button>
          <template #fallback>
            <span class="h-9 w-9" aria-hidden="true" />
          </template>
        </ClientOnly>
      </div>
    </nav>
  </header>
</template>