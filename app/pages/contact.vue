<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({
  title: () => withSiteTitle(t('contact.title')),
  description: () => t('contact.intro'),
})
</script>

<template>
  <div class="relative">
    <span
      class="contact-ghost absolute -top-6 right-0 -z-10 hidden select-none lg:block"
      aria-hidden="true"
    >{{ t('contact.title') }}</span>

    <div class="relative grid gap-16 lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] lg:items-start lg:gap-16">
      <Reveal class="relative z-10" direction="up">
        <div>
          <p class="eyebrow">{{ t('nav.contact') }}</p>
          <h1 class="mt-3 max-w-[9ch] text-5xl font-bold leading-[0.98] text-ink sm:text-7xl">
            {{ t('contact.title') }}<span class="text-accent" aria-hidden="true">.</span>
          </h1>
          <p class="mt-6 max-w-reading text-lg leading-8 text-secondary">{{ t('contact.intro') }}</p>

          <ol class="mt-12 border-t border-line">
            <li
              v-for="n in 3"
              :key="n"
              class="grid grid-cols-[2.75rem_minmax(0,1fr)] items-baseline gap-4 border-b border-line py-5"
            >
              <span class="font-display text-sm font-bold tabular-nums tracking-[0.18em] text-accent">{{ String(n).padStart(2, '0') }}</span>
              <div>
                <p class="font-semibold text-ink">{{ t(`contact.step_${n}_title`) }}</p>
                <p class="mt-1 text-sm leading-6 text-muted">{{ t(`contact.step_${n}_body`) }}</p>
              </div>
            </li>
          </ol>
        </div>
      </Reveal>

      <Reveal class="relative z-10" :delay="140" direction="up">
        <div class="relative">
          <span class="geo-spin absolute -left-8 -top-8 h-14 w-14 rounded-lg bg-highlight/25" aria-hidden="true" />
          <span class="geo-float absolute -bottom-10 -right-6 h-16 w-16 rounded-full bg-brandBlue/15" aria-hidden="true" />
          <span class="geo-drift absolute -right-5 top-1/2 h-6 w-6 rotate-45 bg-accent/20" aria-hidden="true" />

          <div class="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_16px_44px_rgba(7,18,43,0.10)] dark:bg-surface dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div class="flex h-10 items-center gap-1.5 border-b border-line bg-surfaceMuted px-4 dark:bg-surfaceMuted">
              <span class="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
              <span class="h-2.5 w-2.5 rounded-full bg-highlight" aria-hidden="true" />
              <span class="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
              <span class="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
                <svg class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>
                {{ t('contact.secure') }}
              </span>
            </div>
            <div class="p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </div>
</template>