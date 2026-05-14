# Repository Guidelines

## Project Structure & Module Organization
This repository is a Vite + React + TypeScript frontend. Application entry points live in `src/main.tsx` and `src/App.tsx`. Route-facing screens are under `src/components/pages/`, shared UI primitives are in `src/components/ui/`, and app-level providers and route guards live in `src/components/`. API and validation utilities are kept in `src/lib/`. OTP entry for signup/reset is standardized through the reusable `src/components/ui/OtpInput.tsx` component. API error toast behavior is centralized in `src/lib/toast-api-error.ts` and reused by interceptor/catch paths. OAuth2 callback completion is handled by `src/components/pages/oauth2-redirect-page.tsx` at route `/oauth2/redirect/`. Authenticated password change UI is in `src/components/pages/password-change-section.tsx`; session-management UI is in `src/components/pages/session-management-section.tsx`; self-service account deletion danger-zone UI is in `src/components/pages/account-deletion-section.tsx`; all are mounted in dashboard security. Admin user management is implemented at route `/admin/users` via `src/components/pages/admin-users-page.tsx`, protected with `src/components/role-protected-route.tsx` (`ROLE_ADMIN`). Access-denied UX is handled by `src/components/pages/forbidden-page.tsx` at `/403`. Static images and branding assets are stored in `src/assets/`; public files belong in `public/`.

## Build, Test, and Development Commands
- `npm run dev` - start the local Vite dev server.
- `npm run test` - run unit tests with Vitest.
- `npm run build` - run TypeScript project build checks and produce a production bundle in `dist/`.
- `npm run preview` - serve the production build locally.
- `npm run lint` - run ESLint across the repository.
- `npm run typecheck` - run `tsc --noEmit` for strict type validation.
- `npm run format` - format `*.ts` and `*.tsx` files with Prettier.

## Coding Style & Naming Conventions
Use TypeScript with React function components. Follow the existing style in the repo: 2-space indentation is not used here; preserve the current file formatting and let Prettier handle spacing. Use `PascalCase` for components (`AuthProvider.tsx`), `camelCase` for helpers and hooks, and kebab-free route file names under `pages/` only where the current repo already uses them (for example `login-form.tsx`). Prefer path aliases such as `@/components/...` and `@/lib/...` over long relative imports.

## Testing Guidelines
Unit tests use Vitest. Place tests next to the feature file or in a clearly named `src/__tests__/` directory, and use `*.test.ts` or `*.test.tsx`. Minimum verification baseline for meaningful changes is `npm run test`, `npm run lint`, `npm run typecheck`, and `npm run build`.

## Commit & Pull Request Guidelines
Recent history uses short, imperative commit messages with optional prefixes such as `feat:`, `security:`, and `chore:`. Follow that pattern when the change type is clear; otherwise keep the subject concise and specific. For pull requests, include: a short summary, affected screens or flows, verification commands run, and screenshots for visible UI changes.

## Security & Configuration Tips
Do not hardcode secrets in source files. Frontend environment values belong in `.env` using the `VITE_` prefix. Backend API traffic is expected through the Vite proxy configured in `vite.config.ts`, so keep local backend assumptions aligned with that file before changing auth or API behavior.

API base URL resolution for Axios is env-first via `VITE_API_URL` and normalized to include `/api/v1` when needed; fallback remains local `/api/v1`. Keep refresh/login/session flows consistent with `src/lib/api.ts` and `src/components/auth-provider.tsx`.

## AI Agent Integration Note
The repository root now includes `llms.txt`, a concise AI-consumable backend integration guide (auth flow, signup/reset steps, token/cookie strategy, session/admin endpoints, setup expectations, and error shape). Keep this file aligned with real backend contracts whenever endpoint names or payloads change.

## Guide Maintenance Rule
Treat `AGENTS.md` as living documentation. After any meaningful change to architecture, routing, auth/session flow, build tooling, environment setup, or contributor workflow, update this file in the same commit/PR. Keep updates concise, factual, and scoped to what changed so the guide stays reliable for future work.
