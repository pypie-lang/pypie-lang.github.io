# pypie-website

Static website for PyPie, served by GitHub Pages at https://pypie.dev.

## Build

```bash
make build
```

The build compiles the TypeScript content files, renders documentation pages to
static HTML (plus `sitemap.xml` and `robots.txt`), and bundles the playground.

## Architecture

- `index.html` is the landing page: hero, the in-browser playground, and
  feature highlights. The playground stays on the main page.
- `site.config.js` is the single manifest for the site URL, sections, pages,
  and top navigation.
- `scripts/generate-site.js` renders all tutorial, manual, installation, and
  update pages from `templates/doc-page.html`, including the shared header,
  footer, previous/next pager, per-page meta description, canonical URL, and
  Open Graph tags.
- `assets/site.css` is the design system: one token set with light ("paper")
  and dark ("ink") themes, self-hosted fonts (`assets/fonts/`), and all page
  layouts. The favicon lives at `assets/favicon.svg`.
- `top-actions.ts` enhances the header (theme toggle) and renders the header
  on pages that don't bake it in. Theme state is stored in `localStorage` and
  applied through `data-theme` on `<html>`; the OS preference is the default.
- `learn/*/main.ts`, `manual/*/main.ts`, `installation/main.ts`, and
  `updates/*/main.ts` remain the content sources. They call
  `window.PYPIE_LEARN_RENDER(...)` or `window.PYPIE_MANUAL_RENDER(...)`; the
  generator captures those calls at build time and writes real HTML.

## Modify Existing Pages

1. Edit the relevant `main.ts` content file.
2. Edit `site.config.js` if page metadata or navigation changes.
3. Edit shared layout in `templates/doc-page.html` or shared styles in
   `assets/site.css`.
4. Run `make build`.

## Add A Documentation Page

1. Create a folder with `main.ts` under `learn/`, `manual/`, or `updates/`.
2. Add the page to the matching section in `site.config.js`.
3. Run `make build`.
