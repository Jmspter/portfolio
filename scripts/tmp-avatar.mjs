import sharp from 'sharp'
await sharp('assets-src/images/screenshot-2026-09-23_19-13-23.png')
  .resize(512, 512, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile('public/about-photo.jpg')
const m = await sharp('public/about-photo.jpg').metadata()
console.log('public/about-photo.jpg', m.width + 'x' + m.height, '~' + Math.round(m.size / 1024) + 'KB')
