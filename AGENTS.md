# Repository Guidelines

# Project Deployment

- This project is deployed on Cloudflare Pages. Deployment is managed from the Cloudflare Dashboard.

## Project Structure & Module Organization

- `src/` is the heart of the SPA: `main.tsx` boots the Vite/React app, `App.tsx` is the top-level orchestrator (state, routing, auth), and `types/`, `data.ts`, and `assets/` host shared typings, seed data, and static assets.
- `src/components/` holds extracted UI components (`Category`, `MovieCard`, `MovieGroup`, `Stats`, `TableOfContents`).
- `src/constants.ts`, `src/utils.ts`, and `src/api.ts` hold shared constants, helper functions, and API calls respectively.
- `public/` mirrors Vite’s static directory, so place icons or manifest files here.
- `scraping/` collects the backend helpers used to gather nominee data—treat it as a standalone utility space that complements the frontend dataset.
- Global styles live in `src/index.css`; keep component-specific styles co-located with their React modules when practical.

## Build, Test, and Development Commands

- `npm install` pulls dependencies before working on the project.
- `npm run dev` starts Vite’s dev server on port 5173 with HMR.
- `npm run expose` is the Vite dev server bound to all interfaces for LAN testing.
- `npm run build` produces the static output in `dist/` for deployment.
- `npm run preview` serves the production build locally so you can smoke-test the output.
- `npm run lint` runs `eslint . --ext js,jsx` with zero warning tolerance—fix any reported issues before merging.

## Coding Style & Naming Conventions

- TypeScript + React is the default stack; favor `.tsx` for component files and `.ts` for helpers.
- Use PascalCase for React components, camelCase for hooks/utilities, and UPPER_SNAKE_CASE only for compile-time constants (e.g., `API_URL`).
- Keep indentation consistent (two spaces is the Vite default) and rely on Prettier/ESLint to format on save or pre-commit.
- If you add new lint rules, mirror the existing ESLint configuration and document them in this guide.

## Testing Guidelines

- End-to-end tests live in `tests/e2e` and run via Playwright.
- Install browser binaries once with `npx playwright install`.
- Run the suite with `npm run test:e2e` (spins up `npm run dev` for the web server).
- Use `npm run lint` to validate syntax and catch unused vars before pushing.

## Commit & Pull Request Guidelines

- Follow the existing pattern: short, imperative commit messages that describe what changed (for example, “Update Vite to 6” or “Add TypeScript types”).
- PRs should include a concise description, list of manual steps (if any), and mention which commands were run locally. Link related issues when applicable and attach screenshots only if UI changes are visible.
- Include the status of `npm run lint` (pass/fail) so reviewers know whether automated checks have already run.

## Configuration & Environment Notes

- The frontend hits a configurable `API_URL` in `src/constants.ts`; switch it to `http://localhost:8787` if pairing with the local backend.
