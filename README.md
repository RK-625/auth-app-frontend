# Auth App Frontend

Production-ready React + TypeScript frontend for AuthKit (Spring Boot auth backend), with Clerk-inspired auth UX and secure session handling.

![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green.svg)

## Login Screenshot

![Login Page](src/assets/login_img_light.jpeg)

## Features

| Capability | Status | Notes |
|---|---|---|
| Login + silent refresh | Complete | Access token in memory, refresh via HttpOnly cookie |
| 3-step signup (email → OTP → password) | Complete | Validation + cooldown/resend UX |
| 3-step forgot-password reset | Complete | OTP verify + password reset flow |
| Protected routing | Complete | Guest-only and authenticated route guards |
| API error toasts | Complete | Global Axios interceptor sanitizes user-facing errors |

## Quick Start

```bash
git clone https://github.com/RK-625/auth-app-frontend
cd auth-app-frontend
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL used by local integration | `http://localhost:8083` |
| `VITE_ORG_NAME` | Organization/app label shown across UI screens | `MyApp` |

## Backend Dependency

Frontend API/auth flows depend on the backend repository:

- [AuthKit Spring Boot Backend (`RK-625/auth-app`)](https://github.com/RK-625/auth-app)

Run the backend locally before testing full auth flows.

## Architecture

```mermaid
flowchart LR
  Browser[Browser / React App] --> Routes[Route Pages]
  Routes --> AuthProvider[Auth Provider + Guards]
  AuthProvider --> Axios[Axios Client]
  Axios --> API[/Spring Boot API v1/]
  API -->|login/refresh/signup/reset| AuthProvider
  AuthProvider --> UI[Shadcn UI + Toasts]
```

## Commands

```bash
npm run dev
npm run test
npm run lint
npm run typecheck
npm run build
```
