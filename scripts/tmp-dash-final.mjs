import { readFileSync, writeFileSync } from 'node:fs'

const base = '/home/james/Work/portfolio/'
let fail = []
const edit = (f, pairs) => {
  const fp = base + f
  let s = readFileSync(fp, 'utf8')
  for (const [old, neu] of pairs) {
    if (!s.includes(old)) { fail.push(`✗ ${f} :: ${old.slice(0, 52)}`); continue }
    s = s.split(old).join(neu)
  }
  writeFileSync(fp, s)
}

// ================= UI — PT (subtitle + about body) =================
// subtitle da home (vitoria já tinha sido editado; aqui reescrevo o body do about sem travessões)
edit('i18n/locales/pt.yml', [
  ['subtitle: Desenvolvedor full stack. Construo aplicações web duráveis — APIs seguras e interfaces claras, do Vue ao Ruby on Rails.',
   'subtitle: Desenvolvedor full stack. Construo aplicações web duráveis, com APIs seguras e interfaces claras, do Vue ao Ruby on Rails.'],
  ['title: Curso técnico em TI — IMD/UFRN', 'title: Curso técnico em TI, IMD/UFRN'],
  ['title: Bacharelado Interdisciplinar — ECT/UFRN', 'title: Bacharelado Interdisciplinar, ECT/UFRN'],
  ['title: Programador Jr — Next Mindmid Hub', 'title: Programador Jr, Next Mindmid Hub'],
  ['title: Técnico em Redes — IMD', 'title: Técnico em Redes, IMD'],
  ['pesquisa e desenvolvimento — quero construir software que dure e que faça diferença na vida de quem usa.',
   'pesquisa e desenvolvimento. Quero construir software que dure e que faça diferença na vida de quem usa.'],
  ['nasce segura, ou nasce com problemas. — James Peter', 'nasce segura, ou nasce com problemas, James Peter.'],
])
edit('i18n/locales/en.yml', [
  ['subtitle: Full stack developer. I build durable web applications — secure APIs and clear interfaces, from Vue to Ruby on Rails.',
   'subtitle: Full stack developer. I build durable web applications, with secure APIs and clear interfaces, from Vue to Ruby on Rails.'],
  ['title: IT technician course — IMD/UFRN', 'title: IT technician course, IMD/UFRN'],
  ['title: Interdisciplinary Bachelor — ECT/UFRN', 'title: Interdisciplinary Bachelor, ECT/UFRN'],
  ['title: Junior Programmer — Next Mindmid Hub', 'title: Junior Programmer, Next Mindmid Hub'],
  ['title: Networks Technician — IMD', 'title: Networks Technician, IMD'],
  ['research and development — I want to build software that lasts,', 'research and development. I want to build software that lasts,'],
  ['It is born secure, or it is born with problems. — James Peter', 'It is born secure, or it is born with problems, James Peter.'],
])
// segurança: en body line 94 (trajetória) — reescrever os 2 travessões do parágrafo
edit('i18n/locales/en.yml', [
  ['where I took the technical IT course — and that\'s when'],
   'where I took the technical IT course, and that\'s when'],
  ['real problem for real people — without friction, without noise.',
   'real problem for real people, without friction and without noise.'],
])
edit('i18n/locales/pt.yml', [
  ['onde fiz o curso técnico em TI — e foi lá que'],
   'onde fiz o curso técnico em TI, e foi lá que'],
  ['resolver um problema real de gente de verdade — sem fricção, sem ruído.',
   'resolver um problema real de gente de verdade, sem fricção e sem ruído.'],
])

// ================= PROSA — EN: api-security (linhas 19 e 77) =================
edit('content/en/blog/api-security-best-practices.md', [
  ['If there\'s one thing that always amazes me, it\'s how — in 2025 — I still have to repeat',
   'If there\'s one thing that always amazes me, it\'s how, in 2025, I still have to repeat'],
  ['But the problem isn\'t generating the token — it\'s **how** you treat it afterwards.',
   'But the problem isn\'t generating the token. It\'s **how** you treat it afterwards.'],
})

// ================= PROSA — EN: databricks-spark (22, 32, 152) =================
edit('content/en/blog/databricks-spark.md', [
  ['I was scrolling through Twitter — that natural habitat where developers mix venting with epiphanies',
   'I was scrolling through Twitter, that natural habitat where developers mix venting with epiphanies'],
  ['one of those tools that triggers a curious phenomenon: **it\'s half hype, half serious technical foundation** — and precisely for that reason',
   'one of those tools that triggers a curious phenomenon: **it\'s half hype, half serious technical foundation**, and precisely for that reason'],
  ['impossible to maintain — all to solve something that a handful of routes in .NET or Rails would deliver with ease',
   'impossible to maintain, all to solve something that a handful of routes in .NET or Rails would deliver with ease'],
])

// ================= PROSA — EN: market-and-technology (113) =================
edit('content/en/blog/market-and-technology.md', [
  ['They programmed in BASIC, Pascal, Assembly — not as a career, but out of curiosity.',
   'They programmed in BASIC, Pascal and Assembly, not as a career but out of curiosity.'],
])

// ================= PROSA — EN: operating-systems (43, 63, 113, 200, 202, 237) =================
edit('content/en/blog/operating-systems.md', [
  ['Every computer — modern or not, Windows, Linux, Mac, server or cheap laptop — starts its life',
   'Every computer, modern or not, whether Windows, Linux, Mac, server or cheap laptop, starts its life'],
  ['That jump — the famous `jmp` in Assembly — is the moment',
   'That jump, the famous `jmp` in Assembly, is the moment'],
  ['Only after it activates Protected Mode does the real kernel begin: paging, memory management, interrupts, drivers, multitasking — all the stuff you learn *afterwards*.',
   'Only after it activates Protected Mode does the real kernel begin: paging, memory management, interrupts, drivers and multitasking, all the stuff you learn *afterwards*.'],
  ['uses **Fedora Workstation** — the one with pure GNOME, polished, aligned and full of minimalist charm.',
   'uses **Fedora Workstation**, the one with pure GNOME, polished, aligned and full of minimalist charm.'],
  [', "more future-proof" — and every week he invents a new adjective.',
   ', "more future-proof", and every week he invents a new adjective.'],
  ['And, every now and then, it really does — after all, it\'s the most compatible system on the planet.',
   'And, every now and then, it really does. After all, it\'s the most compatible system on the planet.'],
])

// ================= PROSA — EN: programming-in-the-public-sector (22) =================
edit('content/en/blog/programming-in-the-public-sector.md', [
  ['the government realized late — but it realized — that without technology, there\'s no functioning country.',
   'the government realized late, but it did realize, that without technology there\'s no functioning country.'],
])

// ================= PROSA — PT: operating-systems (202) =================
edit('content/pt/blog/operating-systems.md', [
  ['e toda semana inventa um adjetivo novo — Ele jura que é porque o Fedora é',
   'e toda semana inventa um adjetivo novo. Ele jura que é porque o Fedora é'],
])

// ================= RESULTADO =================
if (fail.length) { console.log('FALHAS:\n' + fail.join('\n')); process.exit(1) }
console.log('✔ todas as 26 substituições foram aplicadas com exatidão')
