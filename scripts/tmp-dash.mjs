import { readFileSync, writeFileSync } from 'node:fs'

const base = '/home/james/Work/portfolio/'
const fail = []

function fix(f, pairs) {
  const fp = base + f
  let s = readFileSync(fp, 'utf8')
  for (const [old, neu] of pairs) {
    if (!s.includes(old)) { fail.push(`${f} :: NÃO ACHOU → ${old.slice(0, 60)}`); continue }
    s = s.split(old).join(neu)
  }
  writeFileSync(fp, s)
}

// ================= i18n — PT =================
fix('i18n/locales/pt.yml', [
  // subtitle (linha 41)
  ['subtitle: Desenvolvedor full stack. Construo aplicações web duráveis — APIs seguras e interfaces claras, do Vue ao Ruby on Rails.',
   'subtitle: Desenvolvedor full stack. Construo aplicações web duráveis, com APIs seguras e interfaces claras, do Vue ao Ruby on Rails.'],
  // body (linha 94)
  ['onde fiz o curso técnico em TI — e foi lá que a área de tecnologia virou caminho, não só curiosidade.',
   'onde fiz o curso técnico em TI, e foi lá que a área de tecnologia virou caminho, não só curiosidade.'],
  ['bom software é aquele que resolve um problema real de gente de verdade — sem fricção, sem ruído.',
   'bom software é aquele que resolve um problema real de gente de verdade, sem fricção e sem ruído.'],
  ['pesquisa e desenvolvimento — quero construir software que dure e que faça diferença na vida de quem usa.',
   'pesquisa e desenvolvimento. Quero construir software que dure e que faça diferença na vida de quem usa.'],
])

// ================= i18n — EN =================
fix('i18n/locales/en.yml', [
  // subtitle (linha 41)
  ['subtitle: Full stack developer. I build durable web applications — secure APIs and clear interfaces, from Vue to Ruby on Rails.',
   'subtitle: Full stack developer. I build durable web applications, with secure APIs and clear interfaces, from Vue to Ruby on Rails.'],
  // body (linha 94)
  ["where I took the technical IT course — and that's when technology stopped being a curiosity and became a path.",
   "where I took the technical IT course, and that's when technology stopped being a curiosity and became a path."],
  ['a real problem for real people — without friction, without noise.',
   'a real problem for real people, without friction and without noise.'],
  ['research and development — I want to build software that lasts and that makes a difference.',
   'research and development. I want to build software that lasts and that makes a difference.'],
])

// ================= PROSA — EN: api-security =================
fix('content/en/blog/api-security-best-practices.md', [
  ["how — in 2025 — I still have to repeat fundamental API security concepts.",
   "how, in 2025, I still have to repeat fundamental API security concepts."],
  ["But the problem isn't generating the token — it's **how** you treat it afterwards.",
   "But the problem isn't generating the token. It's **how** you treat it afterwards."],
])

// ================= PROSA — EN: databricks/spark =================
fix('content/en/blog/databricks-spark.md', [
  ['I was scrolling through Twitter — that natural habitat where developers mix venting with epiphanies',
   'I was scrolling through Twitter, that natural habitat where developers mix venting with epiphanies'],
  ['**it\'s half hype, half serious technical foundation** — and precisely for that reason it deserves',
   '**it\'s half hype, half serious technical foundation**, and precisely for that reason it deserves'],
  ['impossible to maintain — all to solve something that a handful of routes in .NET or Rails',
   'impossible to maintain, all to solve something that a handful of routes in .NET or Rails'],
  // 152 last dash (the "impossible to maintain — all" above is 152; check 4th occurrence)
  ['that all runs on something way too small. I\'ve seen a PHP monolith', 'that all runs on something way too small. I\'ve seen a PHP monolith'],
])

// ================= PROSA — EN: market-and-technology (113) =================
fix('content/en/blog/market-and-technology.md', [
  ['They programmed in BASIC, Pascal, Assembly — not as a career, but out of curiosity.',
   'They programmed in BASIC, Pascal and Assembly, not as a career but out of curiosity.'],
])

// ================= PROSA — EN: operating-systems =================
fix('content/en/blog/operating-systems.md', [
  ['Every computer — modern or not, Windows, Linux, Mac, server or cheap laptop — starts its life',
   'Every computer, modern or not, whether Windows, Linux, Mac, server or cheap laptop, starts its life'],
  ['That jump — the famous `jmp` in Assembly — is the moment',
   'That jump, the famous `jmp` in Assembly, is the moment'],
  // 113
  ['multitasking — all the stuff you learn *afterwards*.',
   'multitasking, all the stuff you learn *afterwards*.'],
  // 200
  ['uses **Fedora Workstation** — the one with pure GNOME',
   'uses **Fedora Workstation**, the one with pure GNOME'],
  // 202
  ['more future-proof** — and every week he invents a new adjective.',
   'more future-proof**, and every week he invents a new adjective.'],
  // 237
  ['And, every now and then, it really does — after all',
   'And, every now and then, it really does, after all'],
])

// ================= PROSA — EN: programming-in-the-public-sector (22) =================
fix('content/en/blog/programming-in-the-public-sector.md', [
  ['the government realized late — but it realized — that without technology',
   'the government realized late, but it realized, that without technology'],
])

// ================= PROSA — PT: operating-systems (202) =================
fix('content/pt/blog/operating-systems.md', [
  ['“mais preparado para o futuro” — e toda semana inventa um adjetivo novo.',
   '“mais preparado para o futuro”, e toda semana inventa um adjetivo novo.'],
])

if (fail.length) {
  console.log('FALHAS:\n' + fail.join('\n'))
  process.exit(1)
}
console.log('✔ 26 travessões substituídos (8 UI + 18 prosa)')
