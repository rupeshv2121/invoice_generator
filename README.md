<!--
README for the Invoice Generator frontend (part of the invoice_generator project).
This README describes how to run the frontend and how it integrates with the backend
service (invoice_generator_server) that provides the API and database.
-->

# Invoice Generator — Frontend

This repository contains the React frontend for the Invoice Generator project.
It pairs with the `invoice_generator_server` backend (Prisma + Express) located
in the sibling folder `invoice_generator_server` of the workspace.

This README covers:
- Project overview
- Local setup and dev commands
- Environment variables and required services
- How the frontend talks to the backend (API shape)
- Quick troubleshooting notes (including recent companyProfileId change)

---

## Project overview

The Invoice Generator frontend is a React (Vite) application. It provides a UI
for managing companies, customers, items, and invoices. The frontend uses the
backend API at `http://localhost:3001` by default to perform CRUD operations.

Key areas:
- Customer management (create, list, update, delete)
- Item management
- Invoice creation and preview (PDF)
- Company profile & settings

The backend (server) project is expected to be in `../invoice_generator_server`.
The backend runs on port `3001` by default and uses Prisma to connect to a
PostgreSQL database.

## Prerequisites

- Node.js 18+ (or recent LTS)
- npm or pnpm
- PostgreSQL (or a hosted DB) for the backend
- Optional: Visual Studio Code (recommended)

## Setup (frontend)

1. Install dependencies

```cmd
cd e:\\Project\\INVOICE\\invoice_generator
npm install
```

2. Environment variables

Create a `.env` in the frontend if you need to override the API base URL. By
default the frontend uses `http://localhost:3001` as the API base.

Example `.env` entries (optional):

VITE_API_BASE_URL=http://localhost:3001

3. Start the frontend dev server

```cmd
npm run dev
```

The app runs on Vite’s default port (usually `5173`). Open the URL shown in
the terminal (for example `http://localhost:5173`).

## Backend (quick notes)

The backend lives in `e:\\Project\\INVOICE\\invoice_generator_server`.
You need to run it alongside the frontend.

Quick start for the backend:

```cmd
cd e:\\Project\\INVOICE\\invoice_generator_server
npm install
npm run dev   # or npm start depending on scripts
```

The backend uses Prisma and expects a `.env` with `DATABASE_URL` (Postgres).
If you change the Prisma schema, run migrations or `prisma db push` and
`npx prisma generate`.

## Database / Prisma notes

- The backend uses Prisma with a `schema.prisma` that defines `CompanyProfile`,
	`Customer`, `Item`, `Invoice`, etc.
- If you update the Prisma schema, run:

```cmd
cd e:\\Project\\INVOICE\\invoice_generator_server
npx prisma migrate dev --name your-migration-name
npx prisma generate
```

or (if you prefer to push schema changes without migrations in dev):

```cmd
npx prisma db push
npx prisma generate
```

### Important: companyProfileId recent change

During recent work, `Customer.companyProfileId` was made optional in the Prisma
schema because customers can be created without first creating a company
profile. If you encounter Prisma errors about `companyProfileId` during
`prisma.customer.create()` (Unknown argument or required field), ensure you have:

- Updated the Prisma schema (makes `companyProfileId` optional) and applied the
	change to the database with `prisma migrate` or `prisma db push`.
- Regenerated the Prisma client (`npx prisma generate`).

If the server responds with a 500 and an error containing "Unknown argument
`companyProfileId`", it means the Prisma schema in the database does not match
the generated client used by the server. Re-run migrations and `prisma generate`.

## Frontend — API expectations

- The frontend sends customer objects with a flat structure matching the backend DTO:

	{
		name, companyName, address, city, state, pincode, country,
		phone, email, EximCode, gstin, pan
	}

- The backend assigns `companyProfileId` automatically based on the
	authenticated user (if present). Don't include `companyProfileId` from the frontend.

## Common tasks / Commands

- Install frontend deps: `npm install`
- Run frontend dev server: `npm run dev`
- Build for production: `npm run build`

Backend (in `invoice_generator_server`):
- Install backend deps: `npm install`
- Run backend server (dev): `npm run dev` or `npm start`
- Run Prisma migrate: `npx prisma migrate dev --name <name>`

## Troubleshooting

- 500 error when creating a customer: check backend logs and Prisma errors.
	- If error mentions `companyProfileId` unknown/required: ensure Prisma schema
		and generated client are up-to-date.
	- Regenerate client: `npx prisma generate`.

- Frontend shows no customers even though DB has data:
	- The backend GET `/api/customer` route filters by `isActive: true` and may
		optionally restrict results to the authenticated user's company. Check the
		backend server logs to see the `where` clause and whether a company filter
		is applied.

## Testing CRUD (quick manual test)

1. Start backend and frontend
2. Open the app and go to Customers
3. Create a customer using the UI (fill the required fields: companyName,
	 name, address)
4. Confirm in backend logs that `POST /api/customer` returned 201 and that the
	 created customer appears in `GET /api/customer`

## Contributing

If you modify DTOs or the Prisma schema:

1. Update the backend DTO schema (zod) in `invoice_generator_server/src/dto`
2. Update the Prisma schema and run migrations
3. Regenerate the Prisma client (`npx prisma generate`)
4. Keep the frontend DTOs and field names aligned with backend DTOs

## Useful links

- Prisma docs: https://www.prisma.io/docs
- Vite docs: https://vitejs.dev/

---

If you'd like, I can also:
- Add a short `CONTRIBUTING.md` or developer notes file
- Add quick unit/integration tests for the customer API
- Create scripts to run both frontend and backend together (npm workspace or
	a single `dev` script)

Happy to continue and wire in any of the above.

---

# Frontend (concise developer guide)

This README focuses only on the frontend app located in `invoice_generator`.
It is a Vite + React application (TailwindCSS) that communicates with a
separate backend API (expected at `http://localhost:3001`). Keep backend
and frontend field contracts aligned (DTOs) when changing forms or models.

Quick facts
- Stack: React 18, Vite, Tailwind CSS
- Main source: `src/`
- Dev server: `vite` (script: `npm run dev` / `npm start`)

Project structure (important folders)
- `src/` — React entry and pages (routes, components, services)
	- `src/pages` — page-level components (customers, invoices, settings)
	- `src/components` — shared UI components
	- `src/api` — small client wrappers (e.g. `useCustomersService`) that call the backend
	- `src/services` — utilities for PDF, items, settings
- `public/` — static assets

Environment
- Default API base is `http://localhost:3001`. Override with a Vite env var
	in `.env`: `VITE_API_BASE_URL=http://localhost:3001`

Install & run (Windows CMD examples)
```cmd
cd e:\Project\INVOICE\invoice_generator
npm install
npm run dev   # or npm start
```

Build / preview
```cmd
npm run build
npm run serve
```

API contract notes (frontend ↔ backend)
- Customers: frontend sends a flat object matching backend DTO:
	`{ name, companyName, address, city, state, pincode, country, phone, email, EximCode, gstin, pan }`
- Do NOT send `companyProfileId` from the frontend — the backend assigns it
	from the authenticated user. Keep DTOs in sync (backend: `src/dto/*`).

Debugging tips
- If customers do not appear: check backend `GET /api/customer` response (the
	backend may filter by `isActive` or by company). Use browser devtools Network
	tab to inspect requests and server responses.
- If you see a 500 with Prisma errors mentioning `companyProfileId`, the
	backend Prisma schema and generated client may be out of sync. Re-generate
	the Prisma client on the backend (`npx prisma generate`) after applying
	migrations.

How to contribute small changes
1. Keep frontend field names aligned with backend DTOs.
2. Update `src/api/*` methods to match any changed endpoints.
3. Run the frontend locally and use the backend logs to verify API calls.

If you'd like, I can also:
- Add a short `CONTRIBUTING.md` for frontend conventions
- Add frontend unit tests for `src/api` wrappers

---

End of frontend guide.