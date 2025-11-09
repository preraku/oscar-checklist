# Repository Guidelines

# Project Deployment
- This project is deployed on Github Pages. The workflow is contained at `.github/workflows/github-pages.yml`

## Project Structure & Module Organization
- `src/` is the heart of the SPA: `main.tsx` boots the Vite/React app, `App.tsx` contains the checklist UI, and `types/`, `data.ts`, and `assets/` host shared typings, seed data, and static assets.  
- `public/` mirrors Vite’s static directory, so place icons or manifest files here.  
- `scraping/` collects the backend helpers used to gather nominee data—treat it as a standalone utility space that complements the frontend dataset.  
- Global styles live in `src/index.css` and `src/App.css`; keep component-specific styles co-located with their React modules when practical (e.g., `src/components/` if you add one later).

## Build, Test, and Development Commands
- `bun install` (or `npm install`) pulls dependencies before working on the project.  
- `bun run dev` starts Vite’s dev server on port 5173 with HMR.  
- `bun run expose` is the Vite dev server bound to all interfaces for LAN testing.  
- `bun run build` produces the static output in `dist/` for deployment.  
- `bun run preview` serves the production build locally so you can smoke-test the output.  
- `bun run lint` runs `eslint . --ext js,jsx` with zero warning tolerance—fix any reported issues before merging.

## Coding Style & Naming Conventions
- TypeScript + React is the default stack; favor `.tsx` for component files and `.ts` for helpers.  
- Use PascalCase for React components, camelCase for hooks/utilities, and UPPER_SNAKE_CASE only for compile-time constants (e.g., `API_URL`).  
- Keep indentation consistent (two spaces is the Vite default) and rely on Prettier/ESLint to format on save or pre-commit.  
- If you add new lint rules, mirror the existing ESLint configuration and document them in this guide.

## Testing Guidelines
- There are no automated tests yet; rely on manual QA of the checklist flow.  
- Use `bun run lint` to validate syntax and catch unused vars before pushing.  
- When you add tests, name them to mirror the module they cover (e.g., `App.test.tsx`) and document how to run them here.

## Commit & Pull Request Guidelines
- Follow the existing pattern: short, imperative commit messages that describe what changed (for example, “Update Vite to 6” or “Add TypeScript types”).  
- PRs should include a concise description, list of manual steps (if any), and mention which commands were run locally. Link related issues when applicable and attach screenshots only if UI changes are visible.  
- Include the status of `bun run lint` (pass/fail) so reviewers know whether automated checks have already run.

## Configuration & Environment Notes
- The frontend hits a configurable `API_URL` in `src/App.tsx`; switch it to `http://localhost:8787` if pairing with the local backend.  
- The repository ships with `bun.lock`, but npm users can rely on `package-lock.json`; be consistent with whichever package manager you chose for the session.
