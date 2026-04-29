# 📋 Habit Tracker PWA

A mobile-first Progressive Web App that helps users build and track daily habits. Built with Next.js, React, TypeScript, and Tailwind CSS. All persistence is local and deterministic — no backend or external services required.

---

## 📚 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Run Instructions](#-run-instructions)
- [Test Instructions](#-test-instructions)
- [Local Persistence Structure](#-local-persistence-structure)
- [PWA Support](#-pwa-support)
- [Trade-offs and Limitations](#-trade-offs-and-limitations)
- [Test File Map](#-test-file-map)

---

## 🗂 Project Overview

Habit Tracker lets a user:

- Sign up and log in with email and password
- Create, edit, and delete daily habits
- Mark a habit complete or incomplete for today
- View a live current streak per habit
- Reload the app and retain all saved data
- Install the app to their home screen (PWA)
- Load the cached app shell offline after first visit

The app enforces per-user data isolation — each user sees **only their own habits**. Authentication and persistence are fully local using `localStorage`.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React + TypeScript |
| Styling | Tailwind CSS |
| Persistence | `localStorage` |
| E2E Tests | Playwright |
| Unit / Integration Tests | Vitest + React Testing Library |

---

## ⚙️ Setup Instructions

**Prerequisites:** Node.js 18+ and npm 9+

```bash
# 1. Clone the repository
git clone <repo-url>
cd habit-tracker

# 2. Install dependencies
npm install

# 3. Install Playwright browsers (first time only)
npx playwright install
```

---

## 🚀 Run Instructions

```bash
# Start the development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start the production server
npm run start
```

---

## 🧪 Test Instructions

```bash
# Run all tests (unit + integration + e2e)
npm test

# Unit tests only (with coverage report)
npm run test:unit

# Integration / component tests only
npm run test:integration

# End-to-end tests only
npm run test:e2e
```

**Coverage:** Unit tests enforce a minimum of **80% line coverage** for all files inside `src/lib`. The coverage report is generated automatically when running `npm run test:unit`.

### Coverage Report

<img width="914" height="448" alt="Screenshot 2026-04-29 123918" src="https://github.com/user-attachments/assets/03fa6c7c-f7f8-4b93-8773-0db9206368ff" />


> **Note for E2E tests:** To properly test the Service Worker and offline capabilities, run `npm run build` followed by `npm run start` in a separate terminal before running `npm run test:e2e`.

---

## 💾 Local Persistence Structure

All state is stored in the browser's `localStorage` under three fixed keys.

### `habit-tracker-users`

Stores an array of registered user accounts.

```json
[
  {
    "id": "uuid-v4",
    "email": "user@example.com",
    "password": "plaintext-password",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### `habit-tracker-session`

Stores the currently active session, or `null` when logged out.

```json
{
  "userId": "uuid-v4",
  "email": "user@example.com"
}
```

### `habit-tracker-habits`

Stores an array of habits across all users. Each habit is scoped to its owner via `userId`. The dashboard always filters this array to the `userId` from the active session, so **users only ever see their own habits**.

```json
[
  {
    "id": "uuid-v4",
    "userId": "uuid-v4",
    "name": "Drink Water",
    "description": "8 glasses a day",
    "frequency": "daily",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "completions": ["2024-01-01", "2024-01-02"]
  }
]
```

> **Completion dates** are stored as unique ISO calendar dates in `YYYY-MM-DD` format. Streak calculation is derived from this array on every render — no separate streak field is persisted.

---

## 📱 PWA Support

The app ships as a fully installable Progressive Web App.

### Manifest — `public/manifest.json`

Declares the app name, icons, theme colours, `start_url`, and `display: standalone` so browsers offer an "Add to Home Screen" prompt.

### Service Worker — `public/sw.js`

Registered on the client at app startup. Implements a **network-first with cache fallback** strategy:

1. **Install** — pre-caches the core app shell routes (`/`, `/login`, `/signup`) and static assets.
2. **Activate** — immediately claims all open clients so the new worker takes effect without a reload.
3. **Fetch** — attempts a live network request for every `GET`. On success, the response is cloned into the cache. On failure (offline), the cached version is served instead.

This means the app shell loads correctly on repeat visits even when the device has no network connection, without a hard crash.

### Icons

`public/icons/icon-192.png` and `public/icons/icon-512.png` are required for the PWA install prompt on both Android and iOS.

---

## ⚠️ Trade-offs and Limitations

| Area | Decision | Limitation |
|---|---|---|
| **Auth security** | Passwords stored in plaintext in `localStorage` | Not suitable for production; acceptable for a local-only demo |
| **Data isolation** | All habits share one `localStorage` key; filtered client-side by `userId` | A technically savvy user could edit `localStorage` directly and access other records |
| **Persistence scope** | `localStorage` is per-origin and per-browser | Data does not sync across devices or browsers |
| **Offline support** | App shell only; no background sync | Habit completions made offline will not sync anywhere (there is no server) |
| **Frequency support** | Only `daily` frequency is implemented | Weekly or custom schedules are out of scope for this stage |
| **Password hashing** | None | Intentional — adding bcrypt would require a server or WASM bundle |
| **Token expiry** | Sessions never expire | Logout is the only way to invalidate a session |

---

## 🗺 Test File Map

Each test file targets a specific layer of the application. The table below maps every required file to the behaviours it verifies.

| Test File | Type | Behaviours Verified |
|---|---|---|
| `tests/unit/slug.test.ts` | Unit | `getHabitSlug` produces lowercase, hyphenated, trimmed, alphanumeric-only slugs |
| `tests/unit/validators.test.ts` | Unit | `validateHabitName` rejects empty and over-length names; returns trimmed value on success |
| `tests/unit/streaks.test.ts` | Unit | `calculateCurrentStreak` returns 0 for empty/non-today completions; counts consecutive days backwards; handles duplicates and gaps |
| `tests/unit/habits.test.ts` | Unit | `toggleHabitCompletion` adds/removes dates immutably with no duplicates |
| `tests/integration/auth-flow.test.tsx` | Integration | Signup form creates a session; duplicate email is rejected; login stores session; invalid credentials show an error |
| `tests/integration/habit-form.test.tsx` | Integration | Habit name validation; create/edit/delete flows; completion toggle updates streak display |
| `tests/e2e/app.spec.ts` | E2E (Playwright) | Full user journeys: splash redirect, auth guard, signup, login, habit creation, streak update, persistence across reload, logout, offline app shell |
