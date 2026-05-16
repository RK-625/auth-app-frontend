# Stitch Identity (Frontend)

Stitch Identity is a high-performance, minimalist authentication platform designed for developers, SREs, and DevOps engineers. It prioritizes clarity, precision, and technical depth, providing a robust interface for managing authentication flows.

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- npm

### Core Commands
- **Development**: `npm run dev` - Starts the Vite development server.
- **Build**: `npm run build` - Compiles the project (tsc + vite build).
- **Test**: `npm run test` - Executes Vitest unit tests.
- **Typecheck**: `npm run typecheck` - Performs static type checking.
- **Lint**: `npm run lint` - Runs ESLint checks.
- **Format**: `npm run format` - Formats code using Prettier.
- **Preview**: `npm run preview` - Previews the production build locally.

## 🛠 Tech Stack

- **Framework**: React 19, TypeScript, Vite 7
- **Styling**: Tailwind CSS v4, Framer Motion (Animations)
- **UI Components**: Shadcn UI, Radix UI, Lucide React
- **Routing**: React Router v7
- **Network**: Axios (with custom interceptors)
- **State Management**: React Context (`AuthProvider`)
- **Testing**: Vitest

## 🏗 Architecture & Conventions

### Authentication & Session Strategy
- **Access Token**: Stored strictly in-memory (`src/lib/api.ts`).
- **Refresh Token**: Stateful HttpOnly cookies (browser-handled).
- **Interceptors**: Axios interceptors (`src/lib/api.ts`) handle token injection, silent refresh (dispatching `AUTH_TOKEN_REFRESHED_EVENT`), and global error deduplication/toasts via `toastApiError`.
- **Session Hint**: Uses a `logged_in=true` cookie hint for bootstrap refresh logic.
- **Redirects**: Sanitize redirect paths to internal single-slash paths before calling `navigate`.

### Routing & Protection
- Defined in `src/App.tsx`.
- **Lazy Loading**: Use `React.lazy` and `Suspense` for all route-level screens.
- **Guards**: Never return `null` during session resolution; render `AuthLoadingScreen`.
- **Admin**: `/admin/users` via `AdminUsersPage`, protected by `RoleProtectedRoute` (`ROLE_ADMIN`).

### Component Organization
- **`src/components/ui`**: Base UI components.
    - `OtpInput.tsx`: Standardized OTP entry.
    - `button.tsx`: Owns pill shapes and brand-magenta focus/glow.
    - `card.tsx`: Uses `variant="glass"` for surfaces.
    - `field.tsx`: Use `FieldErrorSlot` for form validation to preserve card height.
- **`src/components/pages`**: View components.
    - Password Change/Session Management/Account Deletion are mounted in dashboard security.
- **`src/lib`**: Core utilities, API client (`api.ts`), and schemas.

### Coding Style
- **Indentation**: Preserve current formatting; let Prettier handle spacing.
- **Naming**: `PascalCase` for components, `camelCase` for hooks/helpers. kebab-case for route files under `pages/` (e.g., `login-form.tsx`).
- **Path Aliases**: Prefer `@/components/...` and `@/lib/...` over relative imports.

## 🎨 Design Principles (Synthetic Indigo)
Adhere to `DESIGN.md`:
- **Palette**: Midnight Deep Indigo backgrounds with Neon Magenta highlights.
- **Tone**: Authoritative, minimalist, and "quiet."
- **Feedback**: Use color only for semantic feedback (success/error).

## 🛡 Security & Development Mandates
- **API Client**: ALWAYS use the exported `api` instance from `src/lib/api.ts`.
- **Environment**: Use `VITE_` prefix for frontend variables.
- **Testing**: Place tests (`*.test.ts/x`) next to features or in `src/__tests__/`.
- **Session Management**: `SessionManagementSection` is currently a placeholder; do not poll/revoke until backend persistence is ready.
- **Maintenance**: Update `GEMINI.md` and `AGENTS.md` (and check `llms.txt`) after architectural changes.

Refer to `PRODUCT.md` for goals, `DESIGN.md` for styling, and `AGENTS.md` for detailed guidelines.
