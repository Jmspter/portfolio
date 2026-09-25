<script setup lang="ts">
const { t, tm } = useI18n()
useSeoMeta({
  title: () => withSiteTitle(t('about.title')),
  description: () => t('about.intro'),
})

const stats = computed(() => [
  { value: Number(t('about.stats.years.value')), label: t('about.stats.years.label') },
  { value: Number(t('about.stats.projects.value')), label: t('about.stats.projects.label') },
  { value: Number(t('about.stats.languages.value')), label: t('about.stats.languages.label') },
])

const milestones = computed(() => {
  const raw = tm('about.timeline')
  if (!Array.isArray(raw) || !raw.length) return []
  return raw.map((_, index) => ({
    year: t(`about.timeline.${index}.year`),
    title: t(`about.timeline.${index}.title`),
    body: t(`about.timeline.${index}.body`),
  }))
})
</script>

<template>
  <div class="space-y-20 lg:space-y-28">
    <div>
      <Reveal direction="up">
        <p class="eyebrow">{{ t('nav.about') }}</p>
        <h1 class="mt-3 text-5xl font-bold text-ink sm:text-7xl">{{ t('about.title') }}</h1>
      </Reveal>
    </div>

    <div>
      <Reveal :delay="120" direction="up">
        <p class="max-w-3xl text-xl leading-9 text-secondary sm:text-2xl sm:leading-10">{{ t('about.intro') }}</p>
      </Reveal>
    </div>

    <section>
      <Reveal direction="up">
        <div class="relative overflow-visible">
          <span class="geo-drift absolute -left-8 top-2 hidden h-16 w-16 bg-brandBlue/15 lg:block" aria-hidden="true" />
          <div class="grid gap-px overflow-hidden rounded-2xl border border-line bg-line dark:bg-line sm:grid-cols-3">
            <div v-for="stat in stats" :key="stat.label" class="bg-surface p-8 dark:bg-surface-raised">
              <p class="font-display text-4xl font-bold text-accent">
                <CountUp :value="stat.value" /><span aria-hidden="true">+</span>
              </p>
              <p class="mt-2 text-sm font-semibold uppercase tracking-wide text-muted">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>

    <section>
      <Reveal direction="up">
        <h2 class="eyebrow">{{ t('about.timeline_title') }}</h2>
      </Reveal>
      <Timeline :items="milestones" class="mt-10" />
    </section>

    <div>
      <Reveal direction="up">
        <figure class="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-line bg-surface p-8 sm:p-12 dark:bg-surface-raised">
          <span class="geo-drift absolute -right-8 -top-8 h-20 w-20 rounded-lg bg-highlight/20" aria-hidden="true" />
          <span class="geo-drift absolute -bottom-6 -left-6 h-14 w-14 rounded-full bg-accent/15" aria-hidden="true" />
          <blockquote class="relative text-center font-display text-2xl font-medium leading-snug text-ink sm:text-3xl whitespace-pre-line">
            “{{ t('about.quote_a') }}<mark class="mark-fill">{{ t('about.quote_mark') }}</mark>{{ t('about.quote_b') }}”
          </blockquote>
          <figcaption class="mt-6 text-center text-sm font-semibold uppercase tracking-[0.18em] text-muted">James Peter</figcaption>
        </figure>
      </Reveal>
    </div>

    <div>
      <Reveal direction="up">
        <p class="prose-brand whitespace-pre-line">{{ t('about.body') }}</p>
      </Reveal>
    </div>
  </div>
</template>
