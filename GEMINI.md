# Stitch Identity (Frontend)

Stitch Identity is a high-performance, minimalist authentication platform designed specifically for developers, SREs, and DevOps engineers. It prioritizes clarity, precision, and technical depth, providing a robust interface for managing authentication flows and security handshakes.

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or pnpm

### Commands
- **Development**: `npm run dev` - Starts the Vite development server.
- **Build**: `npm run build` - Compiles the project using TypeScript and Vite.
- **Typecheck**: `npm run typecheck` - Performs static type checking with `tsc`.
- **Lint**: `npm run lint` - Runs ESLint for code quality checks.
- **Format**: `npm run format` - Formats the codebase using Prettier.
- **Preview**: `npm run preview` - Locally previews the production build.

## 🛠 Tech Stack

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Framer Motion (Animations)
- **UI Components**: shadcn/ui, Radix UI, Lucide React
- **Routing**: React Router v7
- **Network**: Axios (with custom interceptors for session management)
- **Theming**: `next-themes` (Default: Dark Mode)

## 🏗 Architecture & Conventions

### Authentication Strategy
The project uses a **Hybrid Session Strategy**:
- **Access Token**: Stored in-memory (`src/lib/api.ts`) for security.
- **Refresh Token**: Managed via Stateful HttpOnly cookies (handled by the browser).
- **Interceptors**: Axios interceptors automatically handle 401 Unauthorized errors by attempting a silent token refresh.

### Routing & Protection
- Routes are defined in `src/App.tsx`.
- **Public Routes**: Accessible only when unauthenticated (e.g., `/login`, `/signup`).
- **Protected Routes**: Accessible only when authenticated (e.g., `/dashboard`).
- Navigation uses `react-router-dom`.

### Component Structure
- **`src/components/ui`**: Base UI components (managed via shadcn).
- **`src/components/pages`**: Full-page components.
- **`src/components/`**: Feature-specific or layout components (e.g., `AuthProvider`, `ModeToggle`).

### Design Principles
Adhere to the "Synthetic Indigo" aesthetic:
- **Tone**: Authoritative, minimalist, and understated.
- **Palette**: Deep indigo backgrounds with neon magenta primary accents.
- **Typography**: Inter Variable, aligned to a strict grid.
- **Feedback**: Color is used primarily for semantic feedback (success/error).

Refer to `DESIGN.md` and `PRODUCT.md` for detailed brand and aesthetic guidelines.

## 🛡 Security & Privacy
- Treat all external input as malicious.
- Never log sensitive data (passwords, tokens, PII).
- Use the `api` instance from `src/lib/api.ts` for all network requests to ensure proper token handling and error reporting.
