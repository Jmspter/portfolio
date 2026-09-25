import { readFileSync, writeFileSync } from 'node:fs'

const base = '/home/james/Work/portfolio/'
const failures = []
function edit(f, pairs) {
  const fp = base + f
  let s = readFileSync(fp, 'utf8')
  for (const [old, neu] of pairs) {
    if (!s.includes(old)) { failures.push(`${f} :: ${old.slice(0, 56)}`); continue }
    s = s.split(old).join(neu)
  }
  writeFileSync(fp, s)
}

// ================= EN.yml — subtitle (41) + body (94) =================
edit('i18n/locales/en.yml', [
  ['subtitle: Full stack developer. I build durable web applications — secure APIs and clear interfaces, from Vue to Ruby on Rails.',
   'subtitle: Full stack developer. I build durable web applications, secure APIs and clear interfaces, from Vue to Ruby on Rails.'],
])

console.log('EN: done')
