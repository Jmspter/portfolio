<script setup lang="ts">
withDefaults(defineProps<{
  index: number
  to: string
  title: string
  description: string
  tags?: string[]
  cover?: string
  coverAlt?: string
  align?: 'left' | 'right'
}>(), {
  tags: undefined,
  cover: undefined,
  coverAlt: '',
  align: 'left',
})

const { t } = useI18n()
</script>

<template>
  <article class="group grid items-center gap-6 border-t border-line py-10 lg:grid-cols-2 lg:gap-14 lg:py-16">
    <div :class="align === 'right' ? 'lg:order-2' : ''">
      <p class="font-display text-sm font-bold uppercase tracking-[0.18em] text-muted">
        <span class="text-accent" aria-hidden="true">/</span> {{ String(index).padStart(2, '0') }}
      </p>
      <h2 class="mt-3 font-display text-3xl font-bold text-ink transition-colors duration-200">
        <NuxtLink :to="to" class="group-hover:text-accent">{{ title }}</NuxtLink>
      </h2>
      <p class="mt-4 max-w-xl text-base leading-7 text-secondary">{{ description }}</p>
      <ul v-if="tags?.length" class="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-wide text-muted">
        <li v-for="tag in tags" :key="tag" class="border-b-2 border-highlight pb-0.5">{{ tag }}</li>
      </ul>
    </div>
    <div :class="align === 'right' ? 'lg:order-1' : ''">
      <NuxtLink
        :to="to"
        class="project-row__media block overflow-hidden rounded-2xl border border-line bg-surface transition-transform duration-200 active:scale-[0.99] motion-reduce:transform-none dark:bg-surface-raised"
        :aria-label="title"
      >
        <AppImage v-if="cover" :id="cover" :alt="coverAlt" class="project-row__img aspect-[16/10] w-full object-cover" />
        <div v-else class="project-row__img grid aspect-[16/10] place-items-center">
          <svg class="h-12 w-12 text-accent/60" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2 22 22H2L12 2Z" />
          </svg>
        </div>
      </NuxtLink>
      <p class="mt-4 text-sm font-semibold text-accent">
        {{ t('projects.case_link') }} <span aria-hidden="true">→</span>
      </p>
    </div>
  </article>
</template>