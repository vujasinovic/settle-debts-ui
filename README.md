# Settle Debts – Frontend

A clean, minimal React + TypeScript app to browse groups, add shared expenses, and view settlements.

## Tech
- React + Vite + TypeScript
- TailwindCSS (token-based, light mode)
- React Router
- React Query (TanStack Query)
- shadcn/ui components

## Quick start

1) Install dependencies
```sh
pnpm i
```

2) Configure environment
```sh
cp .env.example .env
# Optionally edit VITE_API_BASE_URL
```

3) Run the app
```sh
pnpm dev
```
App runs locally; by default it expects the backend at `http://localhost:8080`.

## Environment
- `VITE_API_BASE_URL` (default `http://localhost:8080`)

## Backend API contract
The app consumes an existing backend with the following endpoints:
- `GET /api/groups` → Group[]
- `POST /api/groups` → 201 { "status":"Resource saved" }
- `GET /api/groups/{gid}/expenses` → Expense[]
- `POST /api/groups/{gid}/expenses` → 201 { "status":"Resource saved" }
- `GET /api/groups/{gid}/settlements` → Settlement[]

Errors:
- 400/404 → { "error": "message" }

## Pages
- `/` Groups list: create/open groups
- `/groups/:gid` Group detail with tabs:
  - Expenses: table + “Add expense” modal
  - Settlements: list or empty state
- `*` Not found

## Development notes
- Data fetching via React Query; base fetch helper handles JSON and error messages
- Query keys: ["groups"], ["expenses", gid], ["settlements", gid]
- Forms validate required fields and positive amounts, show toasts on success/error

## NPM users
```sh
npm i
npm run dev
```

---

This project was bootstrapped with Lovable. For more info about using Lovable, see https://docs.lovable.dev/
