import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const locales = ['pt', 'en'] as const

// `postId` é o mesmo nas traduções de um post/projeto, assim comentários
// e reações são compartilhados entre os idiomas.
const blogSchema = z.object({
  postId: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  excerpt: z.string().optional(),
  date: z.string(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  author: z.object({
    name: z.string(),
    avatar: z.string(),
  }).optional(),
  readTime: z.string().optional(),
  featured: z.boolean().optional(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  image: z.string().optional(),
})

const projectSchema = z.object({
  postId: z.string(),
  title: z.string(),
  description: z.string(),
  stack: z.array(z.string()).default([]),
  repo: z.string().optional(),
  url: z.string().optional(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  gallery: z.array(z.string()).default([]),
})

const collections: Record<string, ReturnType<typeof defineCollection>> = {}

for (const l of locales) {
  collections[`blog_${l}`] = defineCollection({
    type: 'page',
    source: { include: `${l}/blog/**/*.md`, prefix: '/blog' },
    schema: blogSchema,
  })
  collections[`projects_${l}`] = defineCollection({
    type: 'page',
    source: { include: `${l}/projects/**/*.md`, prefix: '/projects' },
    schema: projectSchema,
  })
}

export default defineContentConfig({ collections })
