# Ready-to-Launch Banking — documentation site

A developer documentation site for **Unit's Ready-to-Launch (RtL) Banking** product — the full integration journey from concept to production, with an interactive API reference.

**Live:** https://bdweix.github.io/unit-rtl-banking-docs/

## Highlights

- **Task-oriented IA:** *Start here → Build → Operate & observe → API reference → Go to production → Outreach → Reference*.
- **Clear Custom vs. Ready-to-Launch separation**, so it's always obvious which product (and API surface) a page is about.
- **Interactive API reference** generated from a hand-written OpenAPI 3.1 spec.
- **Full-text search, light/dark, responsive nav**, and a branded theme.

## Stack

- **[Astro](https://astro.build) + [Starlight](https://starlight.astro.build)** — content-first docs framework (MDX, full-text search via Pagefind, light/dark, responsive nav).
- **[Scalar](https://www.scalar.com)** — interactive API reference, rendered from `public/openapi.yaml`.
- Custom brand theme in `src/styles/theme.css`; logos/illustration in `src/assets/`.

## Project structure

```
public/
  favicon.svg
  openapi.yaml            # OpenAPI 3.1 spec for the RtL Banking API
  api-reference/index.html# Scalar interactive reference (served at /api-reference/)
src/
  assets/                 # logo + hero illustration (SVG)
  styles/theme.css        # brand theme on top of Starlight tokens
  content/docs/
    index.mdx             # landing page
    start-here/           # introduction, custom-vs-rtl, how-it-works, quickstart
    build/                # embed, auth, theming, prefill, multi-user, form, unified, events
    operate/              # webhooks, application states, error handling, dashboard, operational accounts
    launch/               # environments, security, production checklist
    api/                  # API overview & conventions (+ link to Scalar reference)
    outreach/             # banners, emails, landing page
    reference/            # faq, glossary
astro.config.mjs          # site config + sidebar IA
```

## Commands

| Command           | Action                                        |
| :---------------- | :-------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Dev server at `localhost:4321`                |
| `npm run build`   | Build the static site to `./dist/`            |
| `npm run preview` | Preview the production build locally          |

> The interactive API reference loads the Scalar bundle from a CDN at runtime, so viewing `/api-reference/` requires network access. Everything else is fully static.

## Editing content

Pages are Markdown/MDX in `src/content/docs/`. The left-hand navigation is defined explicitly in `astro.config.mjs` (`sidebar`). To change the API reference, edit `public/openapi.yaml` — the Scalar page picks it up automatically.

## Deployment

The site auto-deploys to **GitHub Pages** on every push to `main` via `.github/workflows/deploy.yml` (build with Node 22 → upload artifact → deploy). It's served from a sub-path, so `astro.config.mjs` sets `base: '/unit-rtl-banking-docs'`.

A `rehype-base-links.mjs` plugin prefixes that base to root-relative links authored in Markdown content. Links inside MDX components (e.g. `<LinkCard href>`) and hero actions can't go through that plugin, so they include the base explicitly — if you change `base`, update those too (search the repo for `/unit-rtl-banking-docs/`).

To host at a domain root instead, set `BASE = ''` in `astro.config.mjs`, update `site`, and drop the explicit base from the MDX/hero links.

- Optionally pin a Scalar version in `public/api-reference/index.html` instead of `@latest`.

## Sources

Content was derived from Unit's public Ready-to-Launch Banking documentation (the Overview, Getting Started, Implementation, Advanced Implementation + API Reference, Customer Outreach, and FAQ pages) and re-organized. Technical specifics (endpoints, JWT claims, theme object, webhook events, CSP, etc.) reflect those docs as of June 2026; verify against Unit before relying on any single value in production.
