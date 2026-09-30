# Project Structure — InternTrack

This document explains the purpose of every major folder and important file.

---

## Root Level

```
fullstack-1st-project/
├── backend/           The Express + TypeScript REST API
├── frontend/          The Next.js React frontend
├── .gitignore         Files Git should not track (node_modules, .env, dist)
├── README.md          Setup instructions, API docs, interview prep guide
└── PROJECT_STRUCTURE.md  This file
```

---

## Backend (`/backend`)

The backend is a Node.js server that handles all data storage and business logic.

```
backend/
├── prisma/
│   └── schema.prisma          Database schema definition
│       - Defines the Application model (table)
│       - Defines the ApplicationStatus enum
│       - Prisma reads this to generate the DB client and migrations
│
├── src/
│   ├── index.ts               Entry point — starts the Express server
│   │   - Loads environment variables
│   │   - Sets up CORS, JSON middleware
│   │   - Mounts API routes
│   │   - Adds 404 and error handlers
│   │
│   ├── db.ts                  Prisma client singleton
│   │   - Creates ONE PrismaClient instance and reuses it
│   │   - Prevents database connection leaks on hot reloads
│   │
│   ├── types.ts               TypeScript type definitions
│   │   - CreateApplicationDto (data shape for create)
│   │   - UpdateApplicationDto (data shape for update)
│   │   - ApplicationQueryParams (filter/sort params)
│   │   - ApiResponse (standard response wrapper)
│   │
│   ├── validation.ts          Input validation rules
│   │   - Uses express-validator library
│   │   - createApplicationValidator — rules for POST requests
│   │   - updateApplicationValidator — rules for PUT requests
│   │   - Validates required fields, lengths, URL format, date format
│   │
│   ├── routes/
│   │   └── applicationRoutes.ts   Maps URLs to controller functions
│   │       - GET /                → getApplications
│   │       - GET /stats           → getStats
│   │       - GET /:id             → getApplication
│   │       - POST /               → createApplication
│   │       - PUT /:id             → updateApplication
│   │       - DELETE /:id          → deleteApplication
│   │
│   ├── controllers/
│   │   └── applicationController.ts   HTTP request/response handlers
│   │       - Reads request params, query, body
│   │       - Calls service functions
│   │       - Returns JSON responses with correct HTTP status codes
│   │       - Does NOT contain database queries or business logic
│   │
│   └── services/
│       └── applicationService.ts   Business logic + database queries
│           - getAllApplications()  — query with filters
│           - getApplicationById()  — find by ID
│           - createApplication()   — insert new record
│           - updateApplication()   — update existing record
│           - deleteApplication()   — remove record
│           - getStats()            — aggregate counts by status
│
├── .env.example       Template showing required environment variables
├── .eslintrc.json     ESLint rules for TypeScript
├── package.json       Project metadata and npm scripts
└── tsconfig.json      TypeScript compiler configuration
```

### Why Three Layers? (Routes → Controllers → Services)

This is the **separation of concerns** principle:

| Layer | Responsibility | What it does NOT do |
|-------|---------------|---------------------|
| Route | Define URL patterns | Business logic |
| Controller | Handle HTTP | Database queries |
| Service | Business logic + DB | HTTP concerns |

This makes the code:
- **Testable** — you can test services without HTTP
- **Readable** — each file has one clear job
- **Maintainable** — change one layer without touching others

---

## Frontend (`/frontend`)

The frontend is a Next.js application using the App Router.

```
frontend/
├── src/
│   ├── types.ts               TypeScript types matching backend API responses
│   │   - Application (full object from API)
│   │   - ApplicationStatus (enum)
│   │   - CreateApplicationData (form submission shape)
│   │   - Stats (dashboard statistics)
│   │   - ApplicationFilters (search/sort params)
│   │
│   ├── lib/
│   │   ├── api.ts             All backend API communication
│   │   │   - fetchApplications()   — GET /api/applications
│   │   │   - fetchApplication(id)  — GET /api/applications/:id
│   │   │   - createApplication()   — POST /api/applications
│   │   │   - updateApplication()   — PUT /api/applications/:id
│   │   │   - deleteApplication()   — DELETE /api/applications/:id
│   │   │   - fetchStats()          — GET /api/stats
│   │   │
│   │   └── utils.ts           Pure helper functions
│   │       - formatDate()          — "2024-03-15" → "Mar 15, 2024"
│   │       - formatDateForInput()  — ISO → YYYY-MM-DD (for date inputs)
│   │       - getTodayISO()         — Today as YYYY-MM-DD
│   │       - STATUS_LABELS         — { APPLIED: "Applied", ... }
│   │       - STATUS_CLASSES        — { APPLIED: "applied", ... }
│   │       - STATUS_OPTIONS        — Array for dropdown menus
│   │       - truncate()            — Shorten long strings with "..."
│   │
│   ├── app/                   Next.js App Router pages
│   │   │
│   │   ├── layout.tsx         Root layout — wraps ALL pages
│   │   │   - Sets page <title> and meta description (SEO)
│   │   │   - Imports globals.css
│   │   │   - Renders Sidebar + page content
│   │   │
│   │   ├── globals.css        Global design system
│   │   │   - CSS custom properties (design tokens: colors, spacing, fonts)
│   │   │   - Reset styles
│   │   │   - Button classes (.btn-primary, .btn-secondary, .btn-danger)
│   │   │   - Badge classes (.badge, .badge-applied, .badge-interview, ...)
│   │   │   - Spinner animation
│   │   │   - Scrollbar styling
│   │   │
│   │   ├── page.tsx           Dashboard page (route: /)
│   │   │   - Fetches stats + recent applications
│   │   │   - Renders StatCard grid
│   │   │   - Shows recent applications list
│   │   │   - Loading and error states
│   │   │
│   │   └── applications/
│   │       ├── page.tsx       List page (route: /applications)
│   │       │   - Fetches applications with filters
│   │       │   - Renders SearchFilters + ApplicationTable
│   │       │   - Handles delete with confirmation
│   │       │
│   │       ├── new/
│   │       │   └── page.tsx   Add form (route: /applications/new)
│   │       │       - Renders ApplicationForm (no existing data)
│   │       │
│   │       └── [id]/          Dynamic route — [id] = application ID
│   │           ├── page.tsx   Detail view (route: /applications/abc123)
│   │           │   - Fetches single application
│   │           │   - Shows all fields, edit/delete buttons
│   │           │
│   │           └── edit/
│   │               └── page.tsx  Edit form (route: /applications/abc123/edit)
│   │                   - Fetches existing application
│   │                   - Renders ApplicationForm (pre-filled)
│   │
│   └── components/            Reusable UI components
│       │
│       ├── Sidebar/
│       │   ├── Sidebar.tsx    Navigation sidebar
│       │   │   - Active link detection with usePathname()
│       │   │   - Mobile hamburger toggle
│       │   │   - Brand logo + nav links + footer
│       │   └── Sidebar.module.css
│       │
│       ├── StatCard/
│       │   ├── StatCard.tsx   Dashboard statistic card
│       │   │   - Shows a number, label, icon, colored accent
│       │   └── StatCard.module.css
│       │
│       ├── StatusBadge/
│       │   └── StatusBadge.tsx  Colored pill badge for application status
│       │       - Maps APPLIED → blue badge, OFFER → green badge, etc.
│       │
│       ├── ApplicationTable/
│       │   ├── ApplicationTable.tsx   Data table of all applications
│       │   │   - Company avatar (first letter)
│       │   │   - Status badge, formatted date
│       │   │   - View/Edit/Delete action buttons
│       │   │   - Empty state when no results
│       │   └── ApplicationTable.module.css
│       │
│       ├── ApplicationForm/
│       │   ├── ApplicationForm.tsx   Add/Edit form (dual-purpose)
│       │   │   - Props: existingApplication? (undefined = create mode)
│       │   │   - Controlled inputs with useState
│       │   │   - Calls createApplication() or updateApplication() on submit
│       │   │   - Redirects on success
│       │   └── ApplicationForm.module.css
│       │
│       └── SearchFilters/
│           ├── SearchFilters.tsx   Search + filter bar
│           │   - Search input (company/role)
│           │   - Status dropdown
│           │   - Sort by dropdown
│           │   - Sort order toggle button
│           │   - Clear filters button
│           │   - Result count display
│           └── SearchFilters.module.css
│
├── .env.example      NEXT_PUBLIC_API_URL=http://localhost:5000
├── next.config.js    Next.js configuration
├── package.json      Dependencies and scripts
└── tsconfig.json     TypeScript config for Next.js
```

---

## Key Concepts for Beginners

### What is a CSS Module?
A file named `Component.module.css`. Styles inside are scoped to that component only. Use it like:
```tsx
import styles from './Component.module.css';
<div className={styles.myClass}>
```
This prevents global CSS naming conflicts.

### What is 'use client' in Next.js?
Next.js renders components on the server by default (faster, better SEO).
Add `'use client'` at the top when a component needs:
- Browser APIs (window, localStorage)
- React hooks (useState, useEffect, useCallback)
- Event handlers (onClick, onChange)

### What is Prisma ORM?
An ORM (Object-Relational Mapper) lets you write JavaScript/TypeScript code instead of raw SQL.

Instead of:
```sql
SELECT * FROM applications WHERE status = 'APPLIED' ORDER BY applicationDate DESC;
```

You write:
```typescript
prisma.application.findMany({ where: { status: 'APPLIED' }, orderBy: { applicationDate: 'desc' } })
```

### What is a REST API?
REST (Representational State Transfer) is a convention for designing HTTP APIs.
Each URL + HTTP method represents an operation:

| HTTP Method | URL | Meaning |
|-------------|-----|---------|
| GET | /api/applications | Read all |
| GET | /api/applications/123 | Read one |
| POST | /api/applications | Create |
| PUT | /api/applications/123 | Update |
| DELETE | /api/applications/123 | Delete |
