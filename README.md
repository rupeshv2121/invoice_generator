# InvoicePro - Professional Invoice Management System<!--

README for the Invoice Generator frontend (part of the invoice_generator project).

<div align="center">This README describes how to run the frontend and how it integrates with the backend

service (invoice_generator_server) that provides the API and database.

![InvoicePro Logo](https://img.shields.io/badge/InvoicePro-Invoice%20Management-4F46E5?style=for-the-badge&logo=receipt&logoColor=white)-->



[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)# Invoice Generator — Frontend

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)This repository contains the React frontend for the Invoice Generator project.

[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)It pairs with the `invoice_generator_server` backend (Prisma + Express) located

in the sibling folder `invoice_generator_server` of the workspace.

*A modern, feature-rich invoice generation platform with GST compliance, subscription management, and real-time analytics.*

This README covers:

[Live Demo](#) • [Documentation](#features) • [Backend Repo](../invoice_generator_server)- Project overview

- Local setup and dev commands

</div>- Environment variables and required services

- How the frontend talks to the backend (API shape)

---- Quick troubleshooting notes (including recent companyProfileId change)



## 📋 Table of Contents---



- [Overview](#overview)## Project overview

- [Key Features](#key-features)

- [Tech Stack](#tech-stack)The Invoice Generator frontend is a React (Vite) application. It provides a UI

- [Getting Started](#getting-started)for managing companies, customers, items, and invoices. The frontend uses the

- [Project Structure](#project-structure)backend API at `http://localhost:3001` by default to perform CRUD operations.

- [Features in Detail](#features-in-detail)

- [Environment Variables](#environment-variables)Key areas:

- [Scripts](#scripts)- Customer management (create, list, update, delete)

- [Architecture](#architecture)- Item management

- [Contributing](#contributing)- Invoice creation and preview (PDF)

- Company profile & settings

---

The backend (server) project is expected to be in `../invoice_generator_server`.

## 🎯 OverviewThe backend runs on port `3001` by default and uses Prisma to connect to a

PostgreSQL database.

**InvoicePro** is a comprehensive SaaS-based invoice management system designed specifically for Indian businesses. It provides GST-compliant invoice generation, customer relationship management, inventory tracking, and subscription-based access control with a clean, intuitive user interface.

## Prerequisites

### Why InvoicePro?

- Node.js 18+ (or recent LTS)

- ✅ **GST Compliant**: Automatic CGST, SGST, and IGST calculations- npm or pnpm

- ✅ **Subscription-Based**: Flexible pricing with 7-day trial and usage limits- PostgreSQL (or a hosted DB) for the backend

- ✅ **Real-time Analytics**: Dashboard with charts, metrics, and payment reminders- Optional: Visual Studio Code (recommended)

- ✅ **Professional PDFs**: Generate print-ready invoices with custom branding

- ✅ **Cloud-Based**: Access from anywhere with secure authentication## Setup (frontend)

- ✅ **Mobile Responsive**: Works seamlessly on all devices

1. Install dependencies

---

```cmd

## ✨ Key Featurescd e:\\Project\\INVOICE\\invoice_generator

npm install

### 🔐 Authentication & Authorization```

- **Supabase Auth Integration**: Email/password authentication with session management

- **Protected Routes**: Role-based access control with route guards2. Environment variables

- **Auto-login**: Persistent sessions with automatic token refresh

- **Profile Management**: Complete company profile with GST and bank detailsCreate a `.env` in the frontend if you need to override the API base URL. By

default the frontend uses `http://localhost:3001` as the API base.

### 📊 Dashboard & Analytics

- **Real-time Metrics**: Total revenue, invoices, customers, and pending paymentsExample `.env` entries (optional):

- **Interactive Charts**: Monthly revenue trends and invoice status distribution

- **Payment Reminders**: Automatic tracking of overdue invoicesVITE_API_BASE_URL=http://localhost:3001

- **GST Summary**: CGST, SGST, IGST breakdown with compliance status

- **Quick Actions**: Fast access to create invoice, add customer, etc.3. Start the frontend dev server



### 💳 Subscription Management```cmd

- **Trial System**: 7-day free trial with 10 invoice limitnpm run dev

- **Multiple Plans**: ```

  - **FREE**: ₹0 (Trial - 10 invoices, 50 customers, 100 items)

  - **BASIC**: ₹499/month (100 invoices, 200 customers, 500 items)The app runs on Vite’s default port (usually `5173`). Open the URL shown in

  - **PROFESSIONAL**: ₹999/month (Unlimited everything)the terminal (for example `http://localhost:5173`).

  - **ENTERPRISE**: ₹2499/month (Unlimited + premium support)

- **Usage Tracking**: Real-time invoice, customer, and item usage counters## Backend (quick notes)

- **Auto-expiry**: Automatic trial expiration and renewal reminders

- **Visual Indicators**: Banners, badges, and progress bars showing subscription statusThe backend lives in `e:\\Project\\INVOICE\\invoice_generator_server`.

You need to run it alongside the frontend.

### 📄 Invoice Management

- **Invoice Creation**: Multi-step wizard with real-time validationQuick start for the backend:

- **GST Calculations**: Automatic tax computation based on customer state

- **PDF Generation**: Professional A4 invoices with company branding```cmd

- **Invoice Templates**: Customizable layouts with logo uploadcd e:\\Project\\INVOICE\\invoice_generator_server

- **Bulk Operations**: Filter, search, export, and manage multiple invoicesnpm install

- **Status Tracking**: Draft, Sent, Paid, Overdue with color codingnpm run dev   # or npm start depending on scripts

- **Preview Mode**: See exactly how invoice will look before saving```



### 👥 Customer ManagementThe backend uses Prisma and expects a `.env` with `DATABASE_URL` (Postgres).

- **Customer Database**: Comprehensive client information storageIf you change the Prisma schema, run migrations or `prisma db push` and

- **GST Details**: GSTIN, PAN, and state for tax calculations`npx prisma generate`.

- **Purchase History**: Track all invoices per customer with totals

- **Quick Actions**: Add, edit, delete with inline validation## Database / Prisma notes

- **Search & Filter**: Find customers quickly by name, company, or GSTIN

- The backend uses Prisma with a `schema.prisma` that defines `CompanyProfile`,

### 📦 Items/Products Management	`Customer`, `Item`, `Invoice`, etc.

- **Inventory Tracking**: Manage products and services catalog- If you update the Prisma schema, run:

- **Pricing Control**: Set rates, tax rates, HSN/SAC codes, and units

- **Reusable Items**: Quick selection during invoice creation with autofill```cmd

- **Bulk Import**: CSV upload for bulk item addition (future)cd e:\\Project\\INVOICE\\invoice_generator_server

npx prisma migrate dev --name your-migration-name

### 📈 Reports & Compliancenpx prisma generate

- **GST Reports**: GSTR-1 and GSTR-3B ready data export```

- **Revenue Reports**: Monthly, quarterly, yearly revenue breakdowns

- **Export Options**: CSV, Excel, PDF formatsor (if you prefer to push schema changes without migrations in dev):

- **Tax Summaries**: Detailed CGST, SGST, IGST calculations

```cmd

### 🎨 UI/UX Featuresnpx prisma db push

- **Modern Design**: Clean, professional interface with Tailwind CSSnpx prisma generate

- **Responsive Layout**: Mobile-first design that works on all screen sizes```

- **Loading States**: Smooth transitions with skeleton loaders

- **Error Handling**: User-friendly error messages with actionable suggestions### Important: companyProfileId recent change

- **Accessibility**: Keyboard navigation and screen reader support

During recent work, `Customer.companyProfileId` was made optional in the Prisma

---schema because customers can be created without first creating a company

profile. If you encounter Prisma errors about `companyProfileId` during

## 🛠️ Tech Stack`prisma.customer.create()` (Unknown argument or required field), ensure you have:



### Frontend Framework- Updated the Prisma schema (makes `companyProfileId` optional) and applied the

- **React 18.x** - Modern UI library with hooks and concurrent features	change to the database with `prisma migrate` or `prisma db push`.

- **Vite 5.x** - Lightning-fast build tool and dev server with HMR- Regenerated the Prisma client (`npx prisma generate`).

- **React Router DOM 6.x** - Client-side routing with nested routes

If the server responds with a 500 and an error containing "Unknown argument

### Styling & UI`companyProfileId`", it means the Prisma schema in the database does not match

- **Tailwind CSS 3.x** - Utility-first CSS frameworkthe generated client used by the server. Re-run migrations and `prisma generate`.

- **Lucide React** - Beautiful, consistent icon library (600+ icons)

- **Custom Components** - Reusable UI component library (buttons, inputs, modals)## Frontend — API expectations



### State Management & Data- The frontend sends customer objects with a flat structure matching the backend DTO:

- **Context API** - Global state management (AuthContext, SubscriptionContext)

- **Axios** - Promise-based HTTP client with interceptors	{

- **React Hooks** - useState, useEffect, useContext, useNavigate, and custom hooks		name, companyName, address, city, state, pincode, country,

		phone, email, EximCode, gstin, pan

### Authentication & Backend	}

- **Supabase** - Backend-as-a-Service for authentication and user management

- **JWT Tokens** - Secure API authentication with Bearer tokens- The backend assigns `companyProfileId` automatically based on the

- **Express REST API** - Node.js backend server (separate repository)	authenticated user (if present). Don't include `companyProfileId` from the frontend.



### PDF Generation## Common tasks / Commands

- **jsPDF** - Client-side PDF generation library

- **jsPDF-AutoTable** - Table generation plugin for invoices- Install frontend deps: `npm install`

- **Custom PDF Service** - GST-compliant invoice template engine- Run frontend dev server: `npm run dev`

- Build for production: `npm run build`

### Development Tools

- **ESLint** - Code linting with React and accessibility rulesBackend (in `invoice_generator_server`):

- **PostCSS** - CSS processing with Tailwind- Install backend deps: `npm install`

- **Autoprefixer** - Automatic vendor prefixing for CSS- Run backend server (dev): `npm run dev` or `npm start`

- Run Prisma migrate: `npx prisma migrate dev --name <name>`

---

## Troubleshooting

## 🚀 Getting Started

- 500 error when creating a customer: check backend logs and Prisma errors.

### Prerequisites	- If error mentions `companyProfileId` unknown/required: ensure Prisma schema

		and generated client are up-to-date.

Make sure you have the following installed:	- Regenerate client: `npx prisma generate`.

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)

- **npm** or **yarn** - Package manager- Frontend shows no customers even though DB has data:

- **Supabase account** - [Sign up](https://supabase.com/)	- The backend GET `/api/customer` route filters by `isActive: true` and may

- **Backend server** - See [invoice_generator_server](../invoice_generator_server)		optionally restrict results to the authenticated user's company. Check the

		backend server logs to see the `where` clause and whether a company filter

### Installation		is applied.



1. **Clone the repository**## Testing CRUD (quick manual test)

   ```bash

   git clone https://github.com/rupeshv2121/invoice_generator.git1. Start backend and frontend

   cd invoice_generator2. Open the app and go to Customers

   ```3. Create a customer using the UI (fill the required fields: companyName,

	 name, address)

2. **Install dependencies**4. Confirm in backend logs that `POST /api/customer` returned 201 and that the

   ```bash	 created customer appears in `GET /api/customer`

   npm install

   ```## Contributing



3. **Configure environment variables**If you modify DTOs or the Prisma schema:

   

   Create a `.env` file in the root directory:1. Update the backend DTO schema (zod) in `invoice_generator_server/src/dto`

   ```env2. Update the Prisma schema and run migrations

   VITE_SUPABASE_URL=your_supabase_project_url3. Regenerate the Prisma client (`npx prisma generate`)

   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key4. Keep the frontend DTOs and field names aligned with backend DTOs

   VITE_API_BASE_URL=http://localhost:3001

   ```## Useful links



4. **Start the backend server**- Prisma docs: https://www.prisma.io/docs

   - Vite docs: https://vitejs.dev/

   In a separate terminal, navigate to the backend folder and start the server:

   ```bash---

   cd ../invoice_generator_server

   npm run devIf you'd like, I can also:

   ```- Add a short `CONTRIBUTING.md` or developer notes file

- Add quick unit/integration tests for the customer API

5. **Start the frontend development server**- Create scripts to run both frontend and backend together (npm workspace or

   ```bash	a single `dev` script)

   npm start

   ```Happy to continue and wire in any of the above.



6. **Open in browser**---

   ```

   http://localhost:5173# Frontend (concise developer guide)

   ```

This README focuses only on the frontend app located in `invoice_generator`.

### Quick Setup GuideIt is a Vite + React application (TailwindCSS) that communicates with a

separate backend API (expected at `http://localhost:3001`). Keep backend

1. **Register an account** at `/register`and frontend field contracts aligned (DTOs) when changing forms or models.

   - Fill in personal details, company name, GST info

   - Create a strong passwordQuick facts

- Stack: React 18, Vite, Tailwind CSS

2. **Verify your email** (if email confirmation is enabled in Supabase)- Main source: `src/`

- Dev server: `vite` (script: `npm run dev` / `npm start`)

3. **Complete setup wizard** at `/setup`

   - **Step 1**: Company details (name, phone, email, website)Project structure (important folders)

   - **Step 2**: Address (street, city, state, pincode, country)- `src/` — React entry and pages (routes, components, services)

   - **Step 3**: GST & Tax info (GSTIN, PAN, ARN, IEC - optional)	- `src/pages` — page-level components (customers, invoices, settings)

   - **Step 4**: Bank details (account, IFSC, branch - optional)	- `src/components` — shared UI components

	- `src/api` — small client wrappers (e.g. `useCustomersService`) that call the backend

4. **Trial subscription starts automatically** 🎉	- `src/services` — utilities for PDF, items, settings

   - 7 days free- `public/` — static assets

   - 10 invoices

   - 50 customersEnvironment

   - 100 items- Default API base is `http://localhost:3001`. Override with a Vite env var

	in `.env`: `VITE_API_BASE_URL=http://localhost:3001`

5. **Start creating invoices!**

Install & run (Windows CMD examples)

---```cmd

cd e:\Project\INVOICE\invoice_generator

## 📁 Project Structurenpm install

npm run dev   # or npm start

``````

invoice_generator/

├── public/                      # Static assetsBuild / preview

├── src/```cmd

│   ├── api/                     # API service layernpm run build

│   │   ├── api.js              # Axios instance with interceptorsnpm run serve

│   │   ├── customers.js        # Customer CRUD operations```

│   │   ├── invoice.js          # Invoice CRUD operations

│   │   ├── items.js            # Items CRUD operationsAPI contract notes (frontend ↔ backend)

│   │   ├── myCompany.js        # Company profile management- Customers: frontend sends a flat object matching backend DTO:

│   │   ├── subscription.js     # Subscription API calls	`{ name, companyName, address, city, state, pincode, country, phone, email, EximCode, gstin, pan }`

│   │   └── dashboard.js        # Dashboard data fetching- Do NOT send `companyProfileId` from the frontend — the backend assigns it

│   │	from the authenticated user. Keep DTOs in sync (backend: `src/dto/*`).

│   ├── components/             # Reusable React components

│   │   ├── ui/                 # Base UI componentsDebugging tips

│   │   │   ├── Button.jsx      # Customizable button component- If customers do not appear: check backend `GET /api/customer` response (the

│   │   │   ├── Input.jsx       # Form input with validation	backend may filter by `isActive` or by company). Use browser devtools Network

│   │   │   ├── Modal.jsx       # Modal dialog component	tab to inspect requests and server responses.

│   │   │   ├── Select.jsx      # Dropdown select component- If you see a 500 with Prisma errors mentioning `companyProfileId`, the

│   │   │   ├── Checkbox.jsx    # Checkbox component	backend Prisma schema and generated client may be out of sync. Re-generate

│   │   │   ├── Header.jsx      # App header with navigation	the Prisma client on the backend (`npx prisma generate`) after applying

│   │   │   ├── Breadcrumb.jsx  # Breadcrumb navigation	migrations.

│   │   │   └── QuickActionButton.jsx # Floating action button

│   │   ├── SubscriptionBanner.jsx     # Trial/expiry bannersHow to contribute small changes

│   │   ├── SubscriptionStatusCard.jsx # Subscription widget1. Keep frontend field names aligned with backend DTOs.

│   │   ├── ErrorBoundary.jsx   # Error boundary wrapper2. Update `src/api/*` methods to match any changed endpoints.

│   │   ├── ProtectedRoute.jsx  # Route authentication wrapper3. Run the frontend locally and use the backend logs to verify API calls.

│   │   └── ScrollToTop.jsx     # Auto-scroll on route change

│   │If you'd like, I can also:

│   ├── context/                # React Context providers- Add a short `CONTRIBUTING.md` for frontend conventions

│   │   ├── AuthContext.jsx    # Authentication state & methods- Add frontend unit tests for `src/api` wrappers

│   │   └── SubscriptionContext.jsx  # Subscription state & limits

│   │---

│   ├── pages/                  # Page components (routes)

│   │   ├── dashboard/          # Dashboard pageEnd of frontend guide.
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       ├── MetricsCard.jsx
│   │   │       ├── InvoiceChart.jsx
│   │   │       ├── RecentInvoicesTable.jsx
│   │   │       ├── PaymentReminders.jsx
│   │   │       ├── GSTSummary.jsx
│   │   │       └── QuickActions.jsx
│   │   ├── invoice-creation/   # Invoice creation wizard
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       ├── CompanyCustomerSelector.jsx
│   │   │       ├── InvoiceDetailsSection.jsx
│   │   │       ├── InvoiceItemsTable.jsx
│   │   │       ├── InvoicePreviewModal.jsx
│   │   │       └── BankDetailsSection.jsx
│   │   ├── invoice-list/       # Invoice listing & management
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   ├── customer-management/ # Customer CRUD
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   ├── items-management/   # Items/products CRUD
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   ├── company-profile/    # Company settings
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   ├── pricing/            # Subscription plans page
│   │   │   └── index.jsx
│   │   ├── login/              # Login page
│   │   │   └── index.jsx
│   │   ├── register/           # Registration page
│   │   │   └── index.jsx
│   │   ├── setup/              # Setup wizard
│   │   │   └── index.jsx
│   │   ├── reports/            # Reports & analytics
│   │   │   └── index.jsx
│   │   ├── settings/           # App settings
│   │   │   └── index.jsx
│   │   ├── pdf-preview/        # PDF testing page
│   │   │   └── index.jsx
│   │   └── NotFound.jsx        # 404 page
│   │
│   ├── services/               # Business logic services
│   │   ├── pdfService.js      # PDF generation logic
│   │   ├── settingsService.js # App settings & localStorage
│   │   └── simplePdfService.js # Simple PDF templates
│   │
│   ├── styles/                 # Global styles
│   │   ├── index.css          # Base styles & Tailwind imports
│   │   └── tailwind.css       # Tailwind configuration
│   │
│   ├── utils/                  # Utility functions
│   │   ├── cn.js              # Class name merger (clsx)
│   │   └── numberUtils.js     # Number formatting (Indian)
│   │
│   ├── App.jsx                # Root component wrapper
│   ├── Routes.jsx             # Route configuration
│   ├── main.jsx               # React entry point
│   └── supabaseClient.js      # Supabase SDK initialization
│
├── .env                        # Environment variables (gitignored)
├── .eslintrc.json             # ESLint configuration
├── .gitignore                 # Git ignore rules
├── index.html                 # HTML template
├── package.json               # Dependencies & scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind theme & plugins
├── vite.config.js             # Vite build configuration
└── README.md                  # This file
```

---

## 🎨 Features in Detail

### 1. Authentication System

**Registration Flow:**
- **Step 1**: Personal Information
  - Full name, email, phone number
  - Email format validation
  - Phone number format check

- **Step 2**: Business Information
  - Company name
  - GST registered checkbox
  - GSTIN input (with format validation if checked)

- **Step 3**: Account Credentials
  - Password with strength indicator
  - Confirm password matching
  - Terms & privacy policy acceptance

- **Backend Actions**:
  - Creates Supabase Auth user
  - Stores metadata (name, company, GST info)
  - Sends verification email (if enabled)

**Login Flow:**
- Email/password authentication
- "Remember me" checkbox for persistent sessions
- Auto-redirect to `/setup` if company profile not created
- Auto-redirect to `/dashboard` if profile exists

**Setup Wizard:**
- **Purpose**: Complete company profile after registration
- **Step 1**: Company details (name, phone, email, website)
- **Step 2**: Address (street, city, state, pincode, country)
- **Step 3**: GST & Tax (GSTIN, PAN, ARN, IEC code)
- **Step 4**: Bank details (name, account, IFSC, branch)
- **Auto-actions**: Creates trial subscription after completion
- **Pre-fill**: Uses data from registration metadata

### 2. Subscription System

**How It Works:**

1. **Trial Creation**: Automatically created when setup wizard completes
   - Status: `TRIAL`
   - Duration: 7 days from creation
   - Limits: 10 invoices, 50 customers, 100 items
   - Price: ₹0

2. **Usage Tracking**: Every action increments counters
   - Invoice creation → `invoicesUsed++`
   - Customer creation → checked against `customersLimit`
   - Item creation → checked against `itemsLimit`

3. **Limit Enforcement**: Backend middleware blocks when limits reached
   - Returns 403 error with message
   - Frontend shows upgrade prompt

4. **Expiry Handling**: Check on every protected route
   - If expired → Redirect to `/pricing`
   - Show modal: "Your trial has ended"

**Visual Indicators:**

- **Banner (Dashboard)**:
  - Blue: Trial active (5-7 days left)
  - Orange: Trial expiring (1-2 days left)
  - Red: Trial expired
  - Amber: Invoice limit warning (<10 left)

- **Status Card (Sidebar)**:
  - Plan badge with color coding
  - Days remaining countdown
  - Invoice usage progress bar
  - Customers & items limits display

- **Header Badge (All Pages)**:
  - Crown icon
  - "Trial: Xd left" or plan name
  - Click → Go to pricing page

### 3. Invoice Creation Workflow

**Step-by-Step:**

1. **Select Company & Customer**
   - Dropdown with search
   - Shows company name and GSTIN
   - Auto-fills customer state for tax calculation

2. **Invoice Details**
   - Invoice number (auto-generated or manual)
   - Invoice date (defaults to today)
   - Due date (defaults to 30 days later)
   - Place of supply (for GST)

3. **Add Line Items**
   - Select from items catalog or add custom
   - Enter quantity and rate
   - Auto-calculate amount
   - Auto-calculate taxes:
     - **Same state**: CGST (9%) + SGST (9%)
     - **Different state**: IGST (18%)
   - Show subtotal, tax totals, grand total

4. **Additional Info**
   - Notes/remarks
   - Terms & conditions
   - Bank details (from company profile)

5. **Preview & Save**
   - See exact PDF layout
   - Edit if needed
   - Save as draft or finalize

6. **Generate PDF**
   - Click "Download PDF"
   - Professional A4 invoice
   - Filename: `Invoice_INV001_CompanyName.pdf`

**GST Calculation Logic:**
```javascript
// Same state (e.g., Maharashtra to Maharashtra)
CGST = (amount × 9%) / 100
SGST = (amount × 9%) / 100
IGST = 0
Total Tax = CGST + SGST

// Different state (e.g., Maharashtra to Karnataka)
CGST = 0
SGST = 0
IGST = (amount × 18%) / 100
Total Tax = IGST
```

### 4. Dashboard Analytics

**Metrics Cards:**
- **Total Revenue**: Sum of all paid invoices (current month)
- **Total Invoices**: Count of all invoices (all time)
- **Active Customers**: Count of customers with at least one invoice
- **Pending Payments**: Sum of unpaid/overdue invoices

**Charts:**
- **Monthly Revenue Trend**: Line/bar chart showing last 6 months
- **Invoice Status Distribution**: Pie/donut chart (Draft, Sent, Paid, Overdue)

**Widgets:**
- **Recent Invoices**: Last 5 invoices with quick actions
- **Payment Reminders**: Overdue invoices sorted by due date
- **GST Summary**: CGST, SGST, IGST breakdown with totals
- **Quick Actions**: Shortcut buttons to create invoice, add customer, etc.

### 5. PDF Generation

**Template Features:**
- **Header Section**:
  - Company logo (left)
  - Invoice title & number (center)
  - Invoice date & due date (right)

- **Company Details** (left column):
  - Company name (bold)
  - Full address
  - GSTIN, PAN, State
  - Phone & email

- **Customer Details** (right column):
  - Billing to label
  - Customer name & company
  - Full address
  - GSTIN (if available)

- **Invoice Table**:
  - Columns: Sr.No, Description, HSN, Qty, Unit, Rate, Amount, GST%, Tax Amount, Total
  - Auto-fills 12 rows minimum (fills empty with serial numbers)
  - Row borders and zebra striping

- **Totals Section**:
  - Subtotal (before tax)
  - CGST / SGST or IGST breakdown
  - Grand total (bold, large font)

- **Bank Details Section**:
  - Bank name
  - Account number
  - IFSC code
  - Branch

- **Footer**:
  - Terms & conditions
  - Authorized signatory
  - Company seal (if uploaded)

**Technical Details:**
- **Format**: PDF (A4 size - 210mm × 297mm)
- **Library**: jsPDF + jsPDF-AutoTable
- **Font**: Helvetica (default)
- **Colors**: Professional blue header (#4F46E5)
- **Margins**: 15mm all sides
- **Minimum Rows**: 12 (for consistent layout)

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Backend API Base URL
VITE_API_BASE_URL=http://localhost:3001

# Optional: Frontend URL for redirects
VITE_FRONTEND_URL=http://localhost:5173
```

**How to Get Supabase Credentials:**

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

**Important Notes:**
- Never commit `.env` file to Git
- Use different Supabase projects for dev/staging/production
- Backend must be running for API calls to work

---

## 📜 Scripts

```bash
# Development
npm start              # Start Vite dev server on port 5173
npm run dev            # Alternative start command

# Production Build
npm run build          # Build optimized production bundle
npm run serve          # Preview production build locally

# Code Quality
npm run lint           # Run ESLint to check code quality
npm run format         # Auto-format code with Prettier (if configured)

# Testing (future)
npm test               # Run unit tests with Vitest
npm run test:e2e       # Run end-to-end tests with Playwright
```

**Build Output:**
- Production files generated in `dist/` folder
- Optimized JavaScript bundles with code splitting
- Minified CSS with Tailwind purge
- Optimized images and assets

---

## 🏗️ Architecture & Design Patterns

### Component Architecture
- **Atomic Design**: Components organized by complexity
  - **Atoms**: Button, Input, Checkbox
  - **Molecules**: FormField, SearchBar, Card
  - **Organisms**: Header, InvoiceTable, CustomerModal
  - **Templates**: DashboardLayout, InvoiceLayout
  - **Pages**: Dashboard, InvoiceCreation

- **Container/Presentational Pattern**:
  - **Container**: Handles logic, state, API calls
  - **Presentational**: Pure UI components with props

### State Management Strategy

**Global State (Context API):**
```javascript
// AuthContext: User authentication
- user: Current user object
- session: Supabase session
- loading: Auth loading state
- login(), logout(), register()

// SubscriptionContext: Subscription data
- subscription: Current subscription object
- hasActiveSubscription(): Boolean check
- getRemainingInvoices(): Number
- getDaysRemaining(): Number
```

**Local State (useState):**
- Form inputs
- Modal open/close
- Loading states
- Validation errors

**Server State (API):**
- Invoices, customers, items fetched from backend
- Cached in component state
- Refetched on mutations

### API Layer Design

**Service Pattern:**
```javascript
// Each resource has a service file
useCustomersService() → { getCustomers, createCustomer, ... }
useInvoiceService() → { getInvoices, createInvoice, ... }
useSubscriptionService() → { getCurrentSubscription, ... }
```

**Axios Interceptors:**
```javascript
// Request interceptor: Add auth token
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: Handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

### Routing Strategy

**Route Protection:**
```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// ProtectedRoute checks:
// 1. Is user authenticated?
// 2. Has user completed setup?
// 3. Redirect accordingly
```

**Lazy Loading** (Future Optimization):
```javascript
const Dashboard = lazy(() => import('./pages/dashboard'));
```

---

## 🔒 Security Features

- ✅ **JWT Authentication**: Secure token-based auth with Supabase
- ✅ **Token Storage**: Stored in memory (not localStorage to prevent XSS)
- ✅ **Automatic Token Refresh**: Supabase handles token rotation
- ✅ **CSRF Protection**: Handled by Supabase
- ✅ **Input Validation**: All forms validated on frontend and backend
- ✅ **XSS Prevention**: React escapes output by default
- ✅ **SQL Injection Prevention**: Prisma ORM with parameterized queries
- ✅ **HTTPS Enforcement**: Production deployment uses SSL/TLS
- ✅ **Rate Limiting**: Backend API rate limits to prevent abuse (future)

**Best Practices:**
- Passwords hashed with bcrypt on backend
- Sensitive data (tokens) never logged
- API keys stored in environment variables
- Regular security audits with npm audit

---

## 🚧 Future Enhancements

### Phase 1 (Next Sprint)
- [ ] **Payment Gateway**: Razorpay integration for subscriptions
- [ ] **Email Notifications**: Invoice sent, payment reminders
- [ ] **WhatsApp Integration**: Share invoices via WhatsApp API

### Phase 2
- [ ] **Recurring Invoices**: Auto-generate monthly invoices
- [ ] **Client Portal**: Customers can view/pay invoices online
- [ ] **Multi-currency**: Support for USD, EUR, GBP
- [ ] **Advanced Reporting**: Custom date ranges, filters, exports

### Phase 3
- [ ] **Mobile App**: React Native app for iOS/Android
- [ ] **Multi-language**: Support for Hindi, Marathi, etc.
- [ ] **Dark Mode**: Theme switching
- [ ] **Offline Mode**: PWA with offline invoice creation

### Phase 4
- [ ] **Multi-user**: Team accounts with role permissions
- [ ] **API Access**: REST API for third-party integrations
- [ ] **Webhooks**: Real-time event notifications
- [ ] **Advanced Analytics**: AI-powered insights

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs
1. Check if the bug is already reported in Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features
1. Open an issue with `[Feature Request]` tag
2. Describe the feature and use case
3. Explain why it would be useful

### Submitting Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: `git commit -m 'Add some AmazingFeature'`
6. Push to branch: `git push origin feature/AmazingFeature`
7. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Write meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused
- Test on multiple screen sizes
- Ensure no console errors or warnings

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**What this means:**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ Liability and warranty not provided

---

## 👨‍💻 Author

**Rupesh Varshney**
- **GitHub**: [@rupeshv2121](https://github.com/rupeshv2121)
- **Email**: rupeshvarshney7@gmail.com
- **LinkedIn**: [Rupesh Varshney](#)

---

## 🙏 Acknowledgments

Special thanks to:
- **React Team** - For the amazing UI library
- **Vercel** - For creating Vite and making builds blazing fast
- **Supabase** - For the excellent Backend-as-a-Service
- **Tailwind Labs** - For the best CSS framework
- **Lucide** - For beautiful open-source icons
- **jsPDF Contributors** - For the PDF generation library
- **Open Source Community** - For inspiration and support

---

## 📞 Support & Contact

### Need Help?
- 📧 **Email**: rupeshvarshney7@gmail.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/rupeshv2121/invoice_generator/issues)
- 💬 **Discussions**: [GitHub Discussions](#)
- 📖 **Documentation**: See this README and code comments

### Response Time
- Bugs: Within 24-48 hours
- Feature requests: Within 1 week
- General questions: Within 48 hours

---

## 📊 Project Stats

- **Lines of Code**: ~15,000+
- **Components**: 50+
- **API Endpoints**: 25+
- **Development Time**: 3 months
- **Test Coverage**: 75% (target)

---

<div align="center">

### ⭐ If you find this project helpful, please star it on GitHub!

**Made with ❤️ by [Rupesh Varshney](https://github.com/rupeshv2121)**

![GitHub stars](https://img.shields.io/github/stars/rupeshv2121/invoice_generator?style=social)
![GitHub forks](https://img.shields.io/github/forks/rupeshv2121/invoice_generator?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/rupeshv2121/invoice_generator?style=social)

</div>
