<<<<<<< HEAD
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
=======
# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: App Router pages, route groups, layouts, and metadata.
- `src/components`: Layout, navigation, content, and UI components.
- `src/content`: Content loaders, queries, transforms, and schema helpers.
- `src/config`: Site configuration.
- `src/i18n`: Locale config and dictionary loading.
- `src/lib`: Shared utility functions.
- `src/types`: Shared TypeScript types.
- `content`: Markdown content (`posts/`, `daily/`, `pages/about.md`).
- `public`: Static assets (served at `/`).
- `scripts`: Build helpers (`generate-postids.ts`, `generate-content-index.ts`).
- `.cache`: Build-time content index (`content-index.json`, auto-generated).

## Build, Test, and Development Commands
- `npm run dev`: Run local dev server with HMR.
- `npm run build`: Normalize frontmatter, generate content index, then build.
- `npm start`: Serve the production build.
- `npm run lint`: Lint with Next/ESLint presets.
- `npm run typecheck`: Type-check with TypeScript (`--noEmit`).

## Coding Style & Naming Conventions
- **Language**: TypeScript, strict mode enabled.
- **Formatting/Lint**: ESLint (`next/core-web-vitals`, `next/typescript`). Prefer 2-space indent; group/import via `@/*` alias.
- **Files/Components**: PascalCase for React components and filenames (e.g., `PostList.tsx`).
- **Content**: Markdown frontmatter should include `slug` and `date: YYYY-MM-DD` (build scripts normalize dates).

## Testing Guidelines
- No test runner is bundled yet; for new tests, prefer Vitest + React Testing Library.
- Test files: `*.test.ts(x)` colocated or in `src/__tests__/`.
- Manual checks: run `npm run dev` and verify `/[lang]`, `/[lang]/posts`, `/[lang]/daily` routes and MDX rendering.

## Commit & Pull Request Guidelines
- Use concise, imperative commits. Prefer Conventional Commits.
  - Examples: `feat(blog): add reading list`, `fix(posts): handle missing slug`, `chore(ci): add typecheck`.
- PRs include: clear description, linked issues, screenshots for UI changes, verification steps, and notes on MDX/i18n impact.

## Security & Configuration Tips
- Do not commit secrets; use `.env.local`. Set `NEXT_PUBLIC_SITE_URL` for correct canonical/OG URLs.
- Place images under `public/image/` and icons under `public/icons/`.
- i18n: default locale `zh`; language routes live under `src/app/(site)/[lang]/`.
>>>>>>> origin/main
