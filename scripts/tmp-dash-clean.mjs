import { readFileSync, writeFileSync } from 'node:fs'

const base = '/home/james/Work/portfolio/'
let fails = []
const edit = (f, pairs) => {
  const fp = base + f
  let s = readFileSync(fp, 'utf8')
  const miss = []
  for (const [old, neu] of pairs) {
    if (!s.includes(old)) { miss.push('NAOACHOU: ' + old.slice(0, 58)); continue }
    s = s.split(old).join(neu)
  }
  writeFileSync(fp, s)
  const left = (s.match(/—/g) || []).length
  console.log('ok', f.padEnd(52), '| restam', left, miss.length ? '\n  ' + miss.join('\n  ') : '')
  fails.push(...miss.map(m => f + ' :: ' + m))
}

// ================= i18n — PT =================
edit('i18n/locales/pt.yml', [
  ['subtitle: Desenvolvedor full stack. Construo aplicações web duráveis — APIs seguras e interfaces claras, do Vue ao Ruby on Rails.',
   'subtitle: Desenvolvedor full stack. Construo aplicações web duráveis, com APIs seguras e interfaces claras, do Vue ao Ruby on Rails.'],
  ['"\\nMinha trajetória começou no Instituto Metrópole Digital (IMD/UFRN), onde fiz o curso técnico em TI — e foi lá que a área de tecnologia virou caminho, não só curiosidade. Em paralelo, concluí a formação em Cibersegurança Júnior da Cisco, que mudou a forma como encaro qualquer sistema: a segurança não vem depois, ela nasce junto.',
   '"\\nMinha trajetória começou no Instituto Metrópole Digital (IMD/UFRN), onde fiz o curso técnico em TI, e foi lá que a área de tecnologia virou caminho, não só curiosidade. Em paralelo, concluí a formação em Cibersegurança Júnior da Cisco, que mudou a forma como encaro qualquer sistema: a segurança não vem depois, ela nasce junto.'],
  ['onde aprendi que bom software é aquele que resolve um problema real de gente de verdade — sem fricção, sem ruído.',
   'onde aprendi que bom software é aquele que resolve um problema real de gente de verdade, sem fricção e sem ruído.'],
  ['pesquisa e desenvolvimento — quero construir software que dure e que faça diferença na vida de quem usa.',
   'pesquisa e desenvolvimento. Quero construir software que dure e que faça diferença na vida de quem usa.'],
])

// ================= i18n — EN =================
edit('i18n/locales/en.yml', [
  ['subtitle: Full stack developer. I build durable web applications — secure APIs and clear interfaces, from Vue to Ruby on Rails.',
   'subtitle: Full stack developer. I build durable web applications, with secure APIs and clear interfaces, from Vue to Ruby on Rails.'],
  ['"\\nMy journey started at the Metrópole Digital Institute (IMD/UFRN), where I took the technical IT course — and that\'s when technology stopped being a curiosity and became a path. Along the way I completed Cisco\'s Junior Cybersecurity course, which changed the way I look at any system: security isn\'t an afterthought, it\'s built in from the start.',
   '"\\nMy journey started at the Metrópole Digital Institute (IMD/UFRN), where I took the technical IT course, and that\'s when technology stopped being a curiosity and became a path. Along the way I completed Cisco\'s Junior Cybersecurity course, which changed the way I look at any system: security isn\'t an afterthought, it\'s built in from the start.'],
  ['that good software is software that solves a real problem for real people — without friction, without noise.',
   'that good software is software that solves a real problem for real people, without friction and without noise.'],
  ['research and development — I want to build software that lasts and that makes a difference in the lives of the people who use it.',
   'research and development. I want to build software that lasts and that makes a difference in the lives of the people who use it.'],
])

// ================= prosa EN: operating-systems =================
edit('content/en/blog/operating-systems.md', [
  ['Every computer — modern or not, Windows, Linux, Mac, server or cheap laptop — starts its life thinking it still lives in the era of the Intel 8086.',
   'Every computer, modern or not, whether Windows, Linux, Mac, server or cheap laptop, starts its life thinking it still lives in the era of the Intel 8086.'],
  ['That jump — the famous `jmp` in Assembly — is the moment the system stops pretending it lives in 1970.',
   'That jump, the famous `jmp` in Assembly, is the moment the system stops pretending it lives in 1970.'],
  ['interrupts, drivers, multitasking — all the stuff you learn *afterwards*.',
   'interrupts, drivers and multitasking, all the stuff you learn *afterwards*.'],
  ['My friend, on the other hand, uses **Fedora Workstation** — the one with pure GNOME, polished, aligned and full of minimalist charm.',
   'My friend, on the other hand, uses **Fedora Workstation**, the one with pure GNOME, polished, aligned and full of minimalist charm.'],
  ['"more corporate", "more future-proof" — and every week he invents a new adjective.',
   '"more corporate" and "more future-proof", and every week he invents a new adjective.'],
  ['it really does — after all, it\'s the most compatible system on the planet.',
   'it really does. After all, it\'s the most compatible system on the planet.'],
])

// ================= prosa EN: databricks-spark =================
edit('content/en/blog/databricks-spark.md', [
  ['I was scrolling through Twitter — that natural habitat where developers mix venting with epiphanies',
   'I was scrolling through Twitter, that natural habitat where developers mix venting with epiphanies'],
  ['**it\'s half hype, half serious technical foundation** — and precisely for that reason',
   '**it\'s half hype, half serious technical foundation**, and precisely for that reason'],
  ['impossible to maintain — all to solve something',
   'impossible to maintain, all to solve something'],
])

// ================= prosa EN: api-security =================
edit('content/en/blog/api-security-best-practices.md', [
  ['how — in 2025 — I still have to repeat',
   'how, in 2025, I still have to repeat'],
  ['But the problem isn\'t generating the token — it\'s **how** you treat it afterwards.',
   'But the problem isn\'t generating the token. It\'s **how** you treat it afterwards.'],
])

// ================= prosa EN: market-and-technology =================
edit('content/en/blog/market-and-technology.md', [
  ['They programmed in BASIC, Pascal, Assembly — not as a career, but out of curiosity.',
   'They programmed in BASIC, Pascal and Assembly, not as a career but out of curiosity.'],
])

// ================= prosa EN: programming-in-the-public-sector =================
edit('content/en/blog/programming-in-the-public-sector.md', [
  ['the government realized late — but it realized — that without technology',
   'the government realized late, but it did realize, that without technology'],
])

// ================= prosa PT: operating-systems =================
edit('content/pt/blog/operating-systems.md', [
  ['“mais preparado para o futuro” — e toda semana inventa um adjetivo novo.',
   '“mais preparado para o futuro”, e toda semana inventa um adjetivo novo.'],
])

if (fails.length) { console.log('\nFALHAS:\n' + fails.join('\n')); process.exit(1) }
console.log('\nTODOS os 26 travessões tratados.')
