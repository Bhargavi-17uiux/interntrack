# InternTrack — Internship Application Tracker

> A full-stack web application to track internship applications, built with Next.js, Express, TypeScript, and PostgreSQL.

---

## Architecture

```
Browser → Next.js (port 3000) → fetch() → Express (port 5000) → Prisma → PostgreSQL
```

Detailed layers:
- **Frontend**: Next.js App Router pages → React components → lib/api.ts (fetch)
- **Backend**: Express Routes → Controllers → Services → Prisma ORM
- **Database**: PostgreSQL with `applications` table

---

## Project Structure

```
fullstack-1st-project/
├── backend/
│   ├── prisma/schema.prisma      # Database schema
│   ├── src/
│   │   ├── controllers/          # HTTP handlers
│   │   ├── routes/               # URL → controller map
│   │   ├── services/             # Business logic + DB queries
│   │   ├── db.ts                 # Prisma singleton
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── validation.ts         # Input validation
│   │   └── index.ts              # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    # Dashboard (/)
│   │   │   ├── layout.tsx                  # Root layout + sidebar
│   │   │   └── applications/
│   │   │       ├── page.tsx                # List (/applications)
│   │   │       ├── new/page.tsx            # Add form
│   │   │       └── [id]/
│   │   │           ├── page.tsx            # Detail view
│   │   │           └── edit/page.tsx       # Edit form
│   │   ├── components/
│   │   │   ├── Sidebar/
│   │   │   ├── StatCard/
│   │   │   ├── StatusBadge/
│   │   │   ├── ApplicationTable/
│   │   │   ├── ApplicationForm/
│   │   │   └── SearchFilters/
│   │   └── lib/
│   │       ├── api.ts            # All backend API calls
│   │       └── utils.ts          # Helpers, constants
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── PROJECT_STRUCTURE.md
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+  https://nodejs.org
- PostgreSQL v14+  https://www.postgresql.org/download/
- Git  https://git-scm.com

### 1. Create the database

Open pgAdmin or psql:

```sql
CREATE DATABASE internship_tracker;
```

### 2. Configure backend

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/internship_tracker"
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Run database migrations

```bash
npm run db:generate
npm run db:migrate
```

Type `initial_setup` when prompted for a migration name.

### 5. Start the backend

```bash
npm run dev
```

Visit http://localhost:5000/health — should return `{"success":true}`.

### 6. Configure frontend

```bash
cd ../frontend
copy .env.example .env.local
```

Default value works: `NEXT_PUBLIC_API_URL=http://localhost:5000`

### 7. Install frontend dependencies

```bash
npm install
```

### 8. Start the frontend

```bash
npm run dev
```

Open http://localhost:3000

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /api/stats | Dashboard stats |
| GET | /api/applications | List all (supports ?search=, ?status=, ?sortBy=, ?order=) |
| GET | /api/applications/:id | Single application |
| POST | /api/applications | Create application |
| PUT | /api/applications/:id | Update application |
| DELETE | /api/applications/:id | Delete application |

### Status Values
APPLIED, INTERVIEW, OFFER, REJECTED, WITHDRAWN

### Example — Create Application

```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d "{\"companyName\":\"Google\",\"jobRole\":\"SWE Intern\",\"applicationDate\":\"2024-03-15\",\"status\":\"APPLIED\"}"
```

---

## Database Schema (Prisma)

```
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

### Migration Commands

```bash
npm run db:migrate         # Dev: create + apply migration
npm run db:migrate:deploy  # Production: apply existing migrations
npm run db:studio          # Open visual DB browser
```

---

## Interview Preparation

### What does this project do?
InternTrack helps students track internship applications — add, edit, delete applications and see statistics on a dashboard.

### Technologies and Why

| Tech | Reason |
|------|--------|
| Next.js 14 | Industry-standard React framework with App Router |
| React 18 | Most popular UI library |
| TypeScript | Static types catch bugs at compile time |
| Express.js | Minimal Node.js framework for REST APIs |
| PostgreSQL | Reliable relational database |
| Prisma ORM | Type-safe DB queries with auto-generated TypeScript types |
| CSS Modules | Scoped styles, no class conflicts |

### How Frontend Talks to Backend
1. User action → React component state update
2. Component calls function in `lib/api.ts`
3. That function calls `fetch(BACKEND_URL/api/...)` with JSON
4. Express receives request → validates → service → Prisma query
5. Prisma returns data → Express sends JSON response
6. React updates state → UI re-renders

### How Data is Stored
- PostgreSQL stores all application records in the `applications` table
- Prisma ORM provides a type-safe API to query/mutate data
- Every create/update/delete goes through the REST API (no direct DB access from frontend)

### Key Design Decisions
1. **Service layer** — keeps controllers thin, business logic reusable
2. **Centralized API client** — all fetch calls in one file, easy to update
3. **Server-side validation** — express-validator ensures bad data never reaches the DB
4. **Prisma singleton** — prevents connection leaks on dev server hot reloads
5. **CSS Modules** — scoped styles without a CSS-in-JS library

---

## Scripts

### Backend
```bash
npm run dev              # Dev server (hot reload)
npm run build            # Compile TypeScript
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations (dev)
npm run db:studio        # Visual DB browser
npm run lint             # ESLint
```

### Frontend
```bash
npm run dev    # Dev server
npm run build  # Production build
npm run lint   # ESLint
```
