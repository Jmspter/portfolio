import { readdirSync, readFileSync } from 'node:fs'
const root = '/home/james/Work/portfolio'
const files = [
  'i18n/locales/pt.yml',
  'i18n/locales/en.yml',
  ...readdirSync(root + '/content/pt/blog').map(f => 'content/pt/blog/' + f),
  ...readdirSync(root + '/content/en/blog').map(f => 'content/en/blog/' + f),
]
for (const f of files) {
  const s = readFileSync(root + '/' + f, 'utf8')
  const n = (s.match(/—/g) || []).length
  if (n) console.log(String(n).padStart(3), f)
}
