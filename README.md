# Portfólio (Nuxt 4 + Cloudflare Pages)

Nuxt 4, Nuxt Content (blog em Markdown), i18n PT/EN sem prefixo na URL, Tailwind,
API em `server/api` (Pages Functions), D1 + Drizzle (comentários e reações),
Turnstile (anti-spam), Resend (e-mail) e Cloudflare Access (admin).

## Rodando localmente

```bash
npm install
cp .env.example .env            # já vem com chaves de teste do Turnstile
npm run db:migrate:local        # cria as tabelas no D1 local
npm run dev
```

- `/admin` fica liberado em desenvolvimento.
- Sem `NUXT_RESEND_API_KEY`, o e-mail do formulário de contato só aparece no console.
- Para trocar o idioma, use o botão PT/EN no cabeçalho (guarda no cookie `locale`).

## Conteúdo

Posts e projetos ficam em `content/{pt,en}/{blog,projects}/`. Use o mesmo nome de
arquivo e o mesmo `postId` nas duas línguas: comentários e reações são
compartilhados entre as traduções.

## Banco de dados

Edite `server/database/schema.ts`, depois:

```bash
npm run db:generate             # gera a migration em ./drizzle
npm run db:migrate:local        # aplica local
npm run db:migrate:remote       # aplica em produção
```

## Deploy no Cloudflare Pages

1. Crie os dois bancos e copie os IDs para o `wrangler.toml`:
   ```bash
   npx wrangler d1 create portfolio-db
   npx wrangler d1 create portfolio-content
   ```
2. Rode `npm run db:migrate:remote`.
3. No Pages, conecte o repositório do GitHub:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Variável `NODE_VERSION` = `22`
4. Em **Settings → Bindings**, confira os bindings `DB` e `CONTENT_DB` (D1),
   caso não venham do `wrangler.toml`.
5. Em **Settings → Variables and Secrets**, defina:

   | Variável | Descrição |
   |---|---|
   | `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | site key do Turnstile |
   | `NUXT_TURNSTILE_SECRET` | secret do Turnstile |
   | `NUXT_RESEND_API_KEY` | API key do Resend |
   | `NUXT_CONTACT_TO` / `NUXT_CONTACT_FROM` | destino e remetente do contato |
   | `NUXT_ACCESS_TEAM_DOMAIN` | ex.: `meutime.cloudflareaccess.com` |
   | `NUXT_ACCESS_AUD` | AUD tag da aplicação no Access |
   | `NUXT_VISITOR_SALT` | string aleatória (hash de visitante das reações) |
   | `NUXT_PUBLIC_SITE_URL` | URL final do site |

6. No **Zero Trust → Access → Applications**, crie uma aplicação *self-hosted*
   protegendo `seudominio.com/admin*` e `seudominio.com/api/admin*`, com uma
   policy que libere só o seu e-mail. Copie a AUD tag para `NUXT_ACCESS_AUD`.

## Preview local do build de produção

```bash
npm run build
npm run preview                 # wrangler pages dev dist
```

## Próximos passos sugeridos

- Personalizar o conteúdo de exemplo.
- Rate limit com KV nos endpoints de comentário/contato.
- RSS, sitemap e imagens Open Graph.
- Testes com Vitest e Playwright.
