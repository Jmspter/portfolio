<script setup lang="ts">
const { t } = useI18n()
const collection = useCollectionName('projects')

const { data: projects } = await useAsyncData(
  'projects-list',
  () => queryCollection(collection.value as 'projects_pt').all(),
  { watch: [collection], default: () => [] },
)

useSeoMeta({
  title: () => withSiteTitle(t('projects.title')),
  description: () => t('projects.intro'),
})

const sections: HTMLElement[] = []
const setSection = (index: number) => (el: unknown) => {
  if (el) sections[index] = el as HTMLElement
}

const { active } = useActiveSection(() => sections)
const isActive = (index: number) => active.value === index
const total = computed(() => projects.value.length + 1)
const sectionLabel = (index: number) => t('projects.section_label', { n: index + 1 })

function scrollToSection(index: number) {
  const target = sections[index]
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="space-y-12 lg:grid lg:grid-cols-[1.75rem_minmax(0,1fr)] lg:items-start lg:gap-10 xl:gap-12">
    <nav
      class="hidden lg:sticky lg:top-[38vh] lg:block"
      :aria-label="t('projects.storyrail_label')"
    >
      <StoryRail
        :count="total"
        :active="active"
        :get-section-label="sectionLabel"
        @select="scrollToSection"
      />
    </nav>

    <div class="min-w-0 space-y-16 xl:space-y-24">
      <section
        :ref="setSection(0)"
        class="scroll-story-section"
        :class="{ 'is-active': isActive(0) }"
      >
        <Reveal direction="up">
          <p class="eyebrow">{{ t('nav.projects') }}</p>
          <h1 class="mt-3 text-5xl font-bold text-ink sm:text-7xl">{{ t('projects.title') }}</h1>
          <p class="mt-4 max-w-reading text-lg leading-8 text-secondary">{{ t('projects.intro') }}</p>
        </Reveal>
      </section>

      <div v-if="!projects.length" class="flex flex-col items-start gap-4 text-muted">
        <GeometricIllustration variant="projects" />
        <p>{{ t('projects.empty') }}</p>
      </div>

      <template v-else>
        <section
          v-for="(p, index) in projects"
          :key="p.path"
          :ref="setSection(index + 1)"
          class="scroll-story-section"
          :class="{ 'is-active': isActive(index + 1) }"
        >
          <Reveal :delay="70">
            <ProjectRow
              :index="index"
              :to="p.path"
              :title="p.title"
              :description="p.description"
              :tags="p.stack"
              :cover="p.cover"
              :cover-alt="p.coverAlt"
              :align="index % 2 === 1 ? 'right' : 'left'"
            />
          </Reveal>
        </section>
      </template>
    </div>
  </div>
</template>