import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { imageSlots } from '../app/data/images'

const root = process.cwd()
const sourceDir = join(root, 'assets-src', 'images')
const outputDir = join(root, 'public', 'img')
const iconDir = join(root, 'public', 'icons')
const extensions = ['jpg', 'jpeg', 'png', 'webp', 'tiff'] as const
const generatedImages: Record<string, { avif: Record<number, string>; webp: Record<number, string>; fallback: Record<number, string> }> = {}

function findSource(id: string) {
  if (!existsSync(sourceDir)) return undefined
  const files = readdirSync(sourceDir)
  return extensions
    .map(extension => `${id}.${extension}`)
    .map(name => files.find(file => file.toLowerCase() === name))
    .find(Boolean)
}

function ratioIsValid(actual: number, expected: string) {
  const [width, height] = expected.split('/').map(Number)
  return Math.abs(actual - width / height) <= 0.02
}

async function optimize(id: string, slot: (typeof imageSlots)[keyof typeof imageSlots]) {
  const sourceName = findSource(id)
  if (!sourceName) return false

  const sourcePath = join(sourceDir, sourceName)
  const sourceStats = statSync(sourcePath)
  const sourceHash = createHash('sha1').update(Buffer.from(await Bun.file(sourcePath).arrayBuffer())).digest('hex').slice(0, 8)
  const metadata = await sharp(sourcePath).metadata()
  const sourceWidth = metadata.width ?? 0
  const sourceHeight = metadata.height ?? 0
  const actualRatio = sourceHeight ? sourceWidth / sourceHeight : 0

  if (sourceWidth < slot.width || sourceHeight < slot.height) {
    throw new Error(`${sourceName}: resolução ${sourceWidth}x${sourceHeight} abaixo do mínimo ${slot.width}x${slot.height}`)
  }
  if (!ratioIsValid(actualRatio, slot.aspectRatio)) {
    throw new Error(`${sourceName}: proporção ${sourceWidth}:${sourceHeight} não corresponde a ${slot.aspectRatio}`)
  }

  let generatedCount = 0
  const paths = {
    avif: {} as Record<number, string>,
    webp: {} as Record<number, string>,
    fallback: {} as Record<number, string>,
  }
  for (const width of slot.widths) {
    const base = sharp(sourcePath).resize({ width, withoutEnlargement: true })
    const outputs = [
      { extension: 'avif', pipeline: base.clone().avif({ quality:  fiftyFive }) },
      { extension: 'webp', pipeline: base.clone().webp({ quality:  seventyFive }) },
      {
        extension: slot.fallback,
        pipeline: slot.fallback === 'png'
          ? base.clone().png({ compressionLevel: 9, palette: true })
          : base.clone().jpeg({ quality:  eightyFive, mozjpeg: true }),
      },
    ] as const

    for (const output of outputs) {
      const filename = `${id}-${width}-${sourceHash}.${output.extension}`
      const destination = join(outputDir, filename)
      const type = output.extension === 'avif' ? 'avif' : output.extension === 'webp' ? 'webp' : 'fallback'
      paths[type][width] = `/img/${filename}`
      if (existsSync(destination) && statSync(destination).mtimeMs >= sourceStats.mtimeMs) continue
      await output.pipeline.toFile(destination)
      generatedCount += 1
    }
  }

  generatedImages[id] = paths
  console.info(`${id}: ${generatedCount ? `${generatedCount} variante(s) gerada(s)` : 'já atualizado'}`)
  return true
}

// Keep quality values named so the output policy is easy to tune in one place.
const fiftyFive = 55
const seventyFive = 75
const eightyFive = 85

const brandMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="32" fill="#07122B"/><circle cx="150" cy="150" r="106" fill="#E10600"/><rect x="270" y="44" width="198" height="198" fill="#FFCC00"/><path d="M44 468 256 256l212 212Z" fill="#fff"/></svg>`

async function generateBrandAssets() {
  mkdirSync(iconDir, { recursive: true })
  const mark = sharp(Buffer.from(brandMark))
  await Promise.all([
    mark.clone().resize(16, 16).png().toFile(join(iconDir, 'favicon-16x16.png')),
    mark.clone().resize(32, 32).png().toFile(join(iconDir, 'favicon-32x32.png')),
    mark.clone().resize(180, 180).png().toFile(join(iconDir, 'apple-touch-icon.png')),
    mark.clone().resize(192, 192).png().toFile(join(iconDir, 'icon-192.png')),
    mark.clone().resize(512, 512).png().toFile(join(iconDir, 'icon-512.png')),
    sharp({
      create: { width: 1200, height: 630, channels: 4, background: '#07122B' },
    })
      .composite([{ input: Buffer.from(brandMark), blend: 'over', gravity: 'center' }])
      .png()
      .toFile(join(root, 'public', 'og-default.png')),
    sharp({
      create: { width: 1200, height: 630, channels: 4, background: '#18315F' },
    })
      .composite([{ input: Buffer.from(brandMark), blend: 'over', gravity: 'center' }])
      .png()
      .toFile(join(root, 'public', 'og-blog-ola-mundo.png')),
  ])
}

mkdirSync(outputDir, { recursive: true })
await generateBrandAssets()

let processed = 0
for (const [id, slot] of Object.entries(imageSlots)) {
  if (await optimize(id, slot)) processed += 1
}

writeFileSync(
  join(root, 'app', 'data', 'generated-images.ts'),
  `export interface GeneratedImageSet {\n  avif: Record<number, string>\n  webp: Record<number, string>\n  fallback: Record<number, string>\n}\n\nexport const generatedImages: Record<string, GeneratedImageSet> = ${JSON.stringify(generatedImages, null, 2)}\n`,
)

if (!processed) {
  console.info('Nenhum original encontrado em assets-src/images; placeholders permanecem ativos.')
}