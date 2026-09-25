<script setup lang="ts">
const { locale, setLocale, t } = useI18n()
const colorMode = useColorMode()
const route = useRoute()

const siteName = 'James Peter'

const mainLinks = [
  { to: '/', key: 'nav.home' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/projects', key: 'nav.projects' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
]

const isMenuOpen = ref(false)
const isScrolled = ref(false)
const menuButton = ref<HTMLButtonElement>()
const isDark = computed(() => colorMode.value === 'dark')

const pageLabel = computed(() => {
  const path = route.path
  if (path === '/') return t('nav.home')
  if (path.startsWith('/blog')) return t('nav.blog')
  if (path.startsWith('/projects')) return t('nav.projects')
  if (path.startsWith('/about')) return t('nav.about')
  if (path.startsWith('/contact')) return t('nav.contact')
  if (path.startsWith('/admin')) return t('admin.title')
  return t('nav.home')
})

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}

function toggleTheme() { colorMode.preference = isDark.value ? 'light' : 'dark' }
const otherLang = computed(() => (locale.value === 'pt' ? 'en' : 'pt'))
const otherFlag = computed(() => (locale.value === 'pt' ? 'us' : 'br'))
const otherLangName = computed(() => (locale.value === 'pt' ? 'English' : 'Português'))

function onScroll() {
  isScrolled.value = window.scrollY > 8
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isMenuOpen.value) {
    isMenuOpen.value = false
    menuButton.value?.focus()
  }
}

watch(() => route.path, () => { isMenuOpen.value = false })

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header
    class="glass sticky top-0 z-30 border-b transition-[border-color,box-shadow,background-color] duration-200 md:hidden"
    :class="isScrolled
      ? 'border-line shadow-[0_8px_30px_rgba(7,18,43,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
      : 'border-transparent'"
  >
    <nav
      class="mx-auto flex h-12 w-full max-w-6xl items-center justify-between gap-1 px-3"
      :aria-label="t('nav.navigation')"
    >
      <NuxtLink
        to="/"
        class="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform duration-150 active:scale-90 motion-reduce:transform-none"
        :aria-label="siteName"
      >
        <svg viewBox="0 0 24 24" class="h-5 w-5" aria-hidden="true">
          <circle cx="6" cy="6" r="5" class="fill-accent" />
          <rect x="13" y="1" width="10" height="10" class="fill-highlight" />
          <path d="M1 23 12 13l11 10Z" class="fill-ink" />
        </svg>
      </NuxtLink>

      <div class="flex min-w-0 flex-1 items-center justify-center px-1">
        <span
          class="truncate rounded-full border border-line px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-secondary dark:border-line/70"
          :aria-label="t('nav.section', { section: pageLabel })"
          role="status"
        >{{ pageLabel }}</span>
      </div>

      <div class="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          :lang="otherLang"
          class="grid h-10 w-10 place-items-center rounded-full transition-transform duration-150 active:scale-90 motion-reduce:transform-none"
          :aria-label="t('nav.language')"
          @click="setLocale(otherLang)"
        >
          <img
            :src="`/flags/${otherFlag}.svg`"
            :alt="otherLangName"
            width="24"
            height="24"
            class="h-5 w-5 rounded-full"
          >
        </button>

        <ClientOnly>
          <button
            type="button"
            class="grid h-10 w-10 place-items-center rounded-full transition-transform duration-150 active:scale-90 motion-reduce:transform-none"
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
            <span class="h-10 w-10" aria-hidden="true" />
          </template>
        </ClientOnly>

        <button
          ref="menuButton"
          type="button"
          class="relative grid h-10 w-10 place-items-center rounded-full transition-transform duration-150 active:scale-90 motion-reduce:transform-none"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="t(isMenuOpen ? 'nav.close_menu' : 'nav.more')"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span
            class="absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-200"
            :class="isMenuOpen ? 'rotate-45' : '-translate-y-2'"
          />
          <span
            class="absolute h-0.5 w-5 rounded-full bg-current transition-opacity duration-200"
            :class="isMenuOpen ? 'opacity-0' : 'opacity-100'"
          />
          <span
            class="absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-200"
            :class="isMenuOpen ? '-rotate-45' : 'translate-y-2'"
          />
        </button>
      </div>
    </nav>

    <Transition name="menu-drop">
      <div
        v-if="isMenuOpen"
        id="mobile-menu"
        class="absolute inset-x-0 top-full border-b border-line bg-surface/95 shadow-[0_24px_40px_rgba(7,18,43,0.14)] backdrop-blur-xl dark:bg-baseBg/95 dark:shadow-[0_24px_40px_rgba(0,0,0,0.4)]"
      >
        <nav class="flex flex-col gap-1 px-4 py-4" :aria-label="t('nav.navigation')">
          <NuxtLink
            v-for="link in mainLinks"
            :key="link.to"
            :to="link.to"
            class="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold text-ink transition-colors duration-150 active:bg-surfaceMuted dark:active:bg-surface"
            :class="isActive(link.to) ? 'bg-surfaceMuted text-accent dark:bg-surface' : ''"
          >
            <span
              class="h-1.5 w-1.5 shrink-0 rotate-45 bg-accent transition-opacity duration-150"
              :class="isActive(link.to) ? 'opacity-100' : 'opacity-0'"
              aria-hidden="true"
            />
            {{ t(link.key) }}
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>