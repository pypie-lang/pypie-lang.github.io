# pypie-website

**ML Programming 101 Pages**
The learn pages now use:
- `learn/chapter-template.html` as the shared HTML template for all chapter pages.
- `learn/generate-chapter-indexes.js` to generate each `learn/*/index.html`.
- `learn/learn-shared.ts` for shared navigation and rendering logic.
- One `learn/<chapter>/main.ts` file per chapter for dialog content.

**Modify Existing Pages**
1. Edit chapter content in `learn/<chapter>/main.ts`.
2. Edit shared layout/styles in `learn/chapter-template.html`.
3. Run `make build` to regenerate chapter HTML and compile TypeScript.

**Add New Pages**
1. Create a new chapter folder in `learn/` (for example `learn/new-topic/`).
2. Add `learn/new-topic/main.ts` that calls `window.PYPIE_LEARN_RENDER({ ... })`.
3. Add the chapter slug to `LEARN_SERIES.pages` in `learn/learn-shared.ts`.
4. Run `make build` (or `make generate-learn-html`) to generate `learn/new-topic/index.html`.
