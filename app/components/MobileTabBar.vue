<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const items = [
  { to: '/', key: 'nav.home', icon: 'home' },
  { to: '/blog', key: 'nav.blog', icon: 'book' },
  { to: '/projects', key: 'nav.projects', icon: 'layers' },
  { to: '/about', key: 'nav.about', icon: 'user' },
  { to: '/contact', key: 'nav.contact', icon: 'mail' },
] as const

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <nav
    class="mobile-tabbar fixed inset-x-0 bottom-0 z-40 md:hidden"
    :aria-label="t('nav.bottom')"
  >
    <div
      class="tabbar-rise border-t border-line bg-surface/85 shadow-[0_-8px_30px_rgba(7,18,43,0.08)] backdrop-blur-xl dark:bg-baseBg/85 dark:shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
      :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }"
    >
      <div class="mx-auto flex w-full max-w-lg items-stretch px-1">
        <NuxtLink
          v-for="(item, index) in items"
          :key="item.to"
          :to="item.to"
          class="tabbar-item-in relative flex min-h-[3.75rem] flex-1 flex-col items-center justify-center gap-1 rounded-xl pt-2 pb-1.5 transition-transform duration-150 active:scale-90 motion-reduce:transform-none"
          :style="{ '--i': index }"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <span
            class="grid h-7 w-12 place-items-center rounded-full transition-[background-color,transform] duration-200 ease-out"
            :class="isActive(item.to) ? 'transform scale-105 bg-accent/10 text-accent dark:bg-accent/15' : 'text-muted'"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <template v-if="item.icon === 'home'">
                <path d="M3 10.2 12 3l9 7.2" />
                <path d="M5.5 9.5V21h13V9.5" />
                <path d="M10 21v-6h4v6" />
              </template>
              <template v-else-if="item.icon === 'book'">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z" />
                <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
                <path d="M9 7h7M9 11h7" />
              </template>
              <template v-else-if="item.icon === 'layers'">
                <path d="m12 2 9 5-9 5-9-5 9-5Z" />
                <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
              </template>
              <template v-else-if="item.icon === 'user'">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.2-3.6 4.2-5.5 8-5.5s6.8 1.9 8 5.5" />
              </template>
              <template v-else-if="item.icon === 'mail'">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </template>
            </svg>
          </span>
          <span
            class="text-[10px] font-semibold leading-none tracking-wide transition-colors duration-200"
            :class="isActive(item.to) ? 'text-accent' : 'text-muted'"
          >{{ t(item.key) }}</span>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>