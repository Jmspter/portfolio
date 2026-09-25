import { generatedImages } from './generated-images'

export type ImageLoading = 'eager' | 'lazy'

export interface ImageSlot {
  id: string
  aspectRatio: `${number}/${number}`
  width: number
  height: number
  widths: number[]
  sizes: string
  dominantColor: string
  loading: ImageLoading
  fetchPriority?: 'high' | 'low' | 'auto'
  decorative?: boolean
  fallback: 'jpeg' | 'png'
}

export const imageSlots = {
  'hero-visual': {
    id: 'hero-visual',
    aspectRatio: '4/3',
    width: 1200,
    height: 900,
    widths: [480, 720, 1200],
    sizes: '(min-width: 1024px) 40vw, 100vw',
    dominantColor: '#0B1B3A',
    loading: 'eager',
    fetchPriority: 'high',
    decorative: true,
    fallback: 'png',
  },
  'about-portrait': {
    id: 'about-portrait',
    aspectRatio: '4/5',
    width: 1200,
    height: 1500,
    widths: [320, 640, 1200],
    sizes: '(min-width: 768px) 35vw, 90vw',
    dominantColor: '#18315F',
    loading: 'lazy',
    fallback: 'jpeg',
  },
  'about-workspace': {
    id: 'about-workspace',
    aspectRatio: '3/2',
    width: 1600,
    height: 1067,
    widths: [480, 960, 1600],
    sizes: '(min-width: 1024px) 55vw, 100vw',
    dominantColor: '#07122B',
    loading: 'lazy',
    fallback: 'jpeg',
  },
  'piaf-01': {
    id: 'piaf-01',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    widths: [480, 960, 1920],
    sizes: '(min-width: 768px) 70vw, 100vw',
    dominantColor: '#F4F6FA',
    loading: 'lazy',
    fallback: 'png',
  },
  'piaf-02': {
    id: 'piaf-02',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    widths: [480, 960, 1920],
    sizes: '(min-width: 768px) 70vw, 100vw',
    dominantColor: '#0B1B3A',
    loading: 'lazy',
    fallback: 'png',
  },
  'piaf-03': {
    id: 'piaf-03',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    widths: [480, 960, 1920],
    sizes: '(min-width: 768px) 70vw, 100vw',
    dominantColor: '#FFCC00',
    loading: 'lazy',
    fallback: 'png',
  },
  'rookie-01': {
    id: 'rookie-01',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    widths: [480, 960, 1920],
    sizes: '(min-width: 768px) 70vw, 100vw',
    dominantColor: '#F8F8F8',
    loading: 'lazy',
    fallback: 'png',
  },
  'windcraft-01': {
    id: 'windcraft-01',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    widths: [480, 960, 1920],
    sizes: '(min-width: 768px) 70vw, 100vw',
    dominantColor: '#182838',
    loading: 'lazy',
    fallback: 'png',
  },
  'windcraft-02': {
    id: 'windcraft-02',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    widths: [480, 960, 1920],
    sizes: '(min-width: 768px) 70vw, 100vw',
    dominantColor: '#F8F8F8',
    loading: 'lazy',
    fallback: 'png',
  },
  'windcraft-03': {
    id: 'windcraft-03',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    widths: [480, 960, 1920],
    sizes: '(min-width: 768px) 70vw, 100vw',
    dominantColor: '#F8F8F8',
    loading: 'lazy',
    fallback: 'png',
  },
  'og-default': {
    id: 'og-default',
    aspectRatio: '1200/630',
    width: 1200,
    height: 630,
    widths: [1200],
    sizes: '1200px',
    dominantColor: '#07122B',
    loading: 'lazy',
    decorative: true,
    fallback: 'png',
  },
} satisfies Record<string, ImageSlot>

export type ImageSlotId = keyof typeof imageSlots

export function getImageSlot(id: string): ImageSlot {
  return imageSlots[id as ImageSlotId] ?? imageSlots['hero-visual']
}

export function getImagePath(id: string, width: number, extension: string) {
  const generated = generatedImages[id]
  const path = extension === 'avif'
    ? generated?.avif[width]
    : extension === 'webp'
      ? generated?.webp[width]
      : generated?.fallback[width]
  return path ?? `/img/${id}-${width}.${extension}`
}