# InternTrack — Internship Application Tracker

A beginner full-stack portfolio project for tracking internship applications.
Built with Next.js, Express, TypeScript, and PostgreSQL.

---

## What It Does

InternTrack lets you manage all your internship applications in one place:

- **Add** applications with company, role, location, date, status, and notes
- **Edit** or **delete** any application
- **Search** by company or role, **filter** by status, **sort** by date
- **Dashboard** shows live stats: total, applied, interviews, offers, rejected, withdrawn

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 (App Router) | File-based routing, React server components |
| UI | React 18 + TypeScript | Component model, type safety |
| Styling | CSS Modules | Scoped styles, no naming conflicts |
| Backend | Express.js + Node.js | Minimal REST API framework |
| ORM | Prisma | Type-safe database queries |
| Database | PostgreSQL | Reliable relational database |
| Validation | express-validator | Server-side input validation |

---

## How Data Flows

```
Browser
  └─► Next.js page (React component)
        └─► lib/api.ts  (fetch call)
              └─► Express route  (port 5000)
                    └─► Controller  (reads request, sends response)
                          └─► Service  (business logic)
                                └─► Prisma ORM
                                      └─► PostgreSQL database
```

Every create, update, and delete goes through the REST API.
The frontend never touches the database directly.

---

## Project Structure

fullstack 1st project/
├── backend/
│   ├── prisma/schema.prisma      # Database schema (Application model)
│   └── src/
│       ├── index.ts              # Express app entry point
│       ├── db.ts                 # Prisma client singleton
│       ├── types.ts              # TypeScript interfaces / DTOs
│       ├── validation.ts         # express-validator rules
│       ├── routes/               # URL → controller mapping
│       ├── controllers/          # HTTP request/response handlers
│       └── services/             # Business logic + Prisma queries
│
├── frontend/
│   └── src/
│       ├── app/                  # Next.js App Router pages
│       │   ├── page.tsx                    # Dashboard  /
│       │   ├── layout.tsx                  # Root layout (sidebar)
│       │   └── applications/
│       │       ├── page.tsx                # List        /applications
│       │       ├── new/page.tsx            # Add form    /applications/new
│       │       └── [id]/
│       │           ├── page.tsx            # Detail      /applications/:id
│       │           └── edit/page.tsx       # Edit form   /applications/:id/edit
│       ├── components/           # Reusable UI components
│       │   ├── Sidebar/
│       │   ├── StatCard/
│       │   ├── StatusBadge/
│       │   ├── ApplicationTable/
│       │   ├── ApplicationForm/
│       │   └── SearchFilters/
│       └── lib/
│           ├── api.ts            # All fetch calls to the backend
│           └── utils.ts          # Date formatting, status constants
│
├── .gitignore
├── README.md
└── PROJECT_STRUCTURE.md
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Server health check |
| GET | `/api/stats` | Dashboard statistics |
| GET | `/api/applications` | List all (see query params below) |
| GET | `/api/applications/:id` | Get single application |
| POST | `/api/applications` | Create application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |

**Query parameters for GET /api/applications**

| Param | Example | Description |
|-------|---------|-------------|
| `search` | `?search=Google` | Search company name or role |
| `status` | `?status=INTERVIEW` | Filter by status |
| `sortBy` | `?sortBy=applicationDate` | Sort field |
| `order` | `?order=desc` | `asc` or `desc` |

**Status values:** `APPLIED` · `INTERVIEW` · `OFFER` · `REJECTED` · `WITHDRAWN`

---

## Database Schema

```prisma
model Application {
  id              String            @id @default(cuid())
  companyName     String
  jobRole         String
  jobDescription  String?
  applicationDate DateTime
  status          ApplicationStatus @default(APPLIED)
  jobPostingUrl   String?
  location        String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}
```

---

## Setup — Windows PowerShell

### Prerequisites

- [Node.js v18+](https://nodejs.org)
- [PostgreSQL v14+](https://www.postgresql.org/download/)
- [Git](https://git-scm.com)

---

### Step 1 — Create the database

Open **pgAdmin** or the **psql** shell and run:

```sql
CREATE DATABASE internship_tracker;
```

---

### Step 2 — Backend setup

Open a terminal in the project root:

```powershell
cd backend
Copy-Item .env.example .env
```

Open `backend\.env` and fill in your credentials:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/internship_tracker"
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

> Replace `yourpassword` with your actual PostgreSQL password. Never commit this file.

---

### Step 3 — Install backend dependencies

```powershell
npm install
```

---

### Step 4 — Generate Prisma client and run migration

```powershell
npm run db:generate
npm run db:migrate
```

When prompted for a migration name, type `initial_setup` and press Enter.
This creates the `applications` table in PostgreSQL.

---

### Step 5 — Start the backend server

```powershell
npm run dev
```

You should see:
```
✅ Backend server running at http://localhost:5000
```

Verify it works: open http://localhost:5000/health in your browser.

---

### Step 6 — Frontend setup (open a NEW terminal window)

Navigate to the frontend folder from the project root:

```powershell
cd frontend
Copy-Item .env.example .env.local
```

The default `.env.local` already has the correct value:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

### Step 7 — Install frontend dependencies

```powershell
npm install
```

---

### Step 8 — Start the frontend

```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Useful Scripts

### Backend (run inside `backend/`)

```powershell
npm run dev              # Start dev server with hot reload
npm run build            # Compile TypeScript to JavaScript
npm run db:generate      # Regenerate Prisma client after schema changes
npm run db:migrate       # Create and apply a new migration
npm run db:migrate:deploy  # Apply migrations in production
npm run db:studio        # Open Prisma Studio (visual database browser)
npm run lint             # Run ESLint
```

### Frontend (run inside `frontend/`)

```powershell
npm run dev    # Start Next.js dev server
npm run build  # Build for production
npm run lint   # Run ESLint
```

---

## Interview Preparation

### What does this project demonstrate?

- Building a **REST API** with Express and Node.js
- Defining a **database schema** and running **migrations** with Prisma
- Creating a **Next.js frontend** with the App Router
- **Connecting frontend to backend** using the fetch API
- **TypeScript** across the full stack for type safety
- **Input validation** on the server to protect the database
- Organizing code using the **Controller → Service** pattern

### Key design decisions

| Decision | Reason |
|----------|--------|
| Service layer | Keeps controllers thin; business logic is reusable and testable |
| Centralized `lib/api.ts` | One place for all fetch calls — easy to update if URL changes |
| Prisma singleton (`db.ts`) | Prevents connection leaks on hot reloads in development |
| Server-side validation | Never trust client input; catch bad data before it reaches the DB |
| CSS Modules | Scoped styles per component without a CSS-in-JS library |
| `NEXT_PUBLIC_` prefix | Required for Next.js to expose env vars to the browser bundle |
