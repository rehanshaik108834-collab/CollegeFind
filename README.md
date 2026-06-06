# CampusFind — College Discovery Platform

A production-grade college discovery and comparison platform that lets students search, filter, save, and compare Indian colleges with real placement data.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | [https://college-find-bay.vercel.app](https://college-find-bay.vercel.app) |
| Backend API | [https://rehan3106-collegefind-backend.hf.space/api](https://rehan3106-collegefind-backend.hf.space/api) |
| Swagger Docs | [https://rehan3106-collegefind-backend.hf.space/api/docs](https://rehan3106-collegefind-backend.hf.space/api/docs) |

**Demo credentials:** `demo@college.in` / `demo1234`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | TailwindCSS v3 |
| State | Zustand (auth + compare basket) |
| Data fetching | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Backend | NestJS + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Auth | JWT (passport-jwt) |
| Deployment | Vercel (Frontend) + Hugging Face Spaces (Backend) |

---

## Features

### 1. College Listing & Search
- Full-text search across name, city, state, location
- Filter by type, state, min rating, fees range
- Sort by rating, fees, name (asc/desc)
- Paginated results (12/page)
- URL-synced filters — shareable search links
- Debounced search input (350ms)
- Skeleton loaders, error boundaries

### 2. College Detail Page
- Tabbed UI: Overview · Courses · Placements · Reviews
- Full placement stats with top recruiters
- Course listing with fees, duration, seats
- Student reviews with star ratings
- Save + Compare CTAs
- Breadcrumb navigation

### 3. Compare Colleges
- Add up to 3 colleges from any card
- Floating compare bar with college names
- Side-by-side comparison table
- 🏆 Green highlight + "Best" badge on winning metrics
- Metrics: Fees, Rating, Avg/Highest Package, Placement Rate, Facilities, Recruiters

### 4. Auth + Saved Colleges
- JWT-based register/login
- Password validation with Zod
- Protected `/saved` route
- Heart-toggle save/unsave from any card or detail page
- Real-time optimistic UI via React Query cache invalidation

### 5. College Admission Predictor
- Input academic scores and entrance exam percentiles
- Get data-driven probability of admission to target colleges
- Dynamic prediction algorithms based on historical cutoffs

### 6. Student Discussions Forum
- Ask questions and create threads about colleges, courses, or exams
- Upvote and downvote questions and answers
- Mark helpful answers as accepted
- Rich community engagement with real-time feedback

---

## Project Structure

```text
college-discovery/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── auth/               # JWT auth (register, login, strategy, guard)
│   │   ├── colleges/           # Listing, search, detail, filters
│   │   ├── compare/            # 2-3 college comparison
│   │   ├── saved/              # User-scoped saved colleges
│   │   ├── predictor/          # Admission prediction algorithms
│   │   ├── discussions/        # Community forums and Q&A
│   │   ├── prisma/             # PrismaService (global)
│   │   └── main.ts             # Bootstrap + Swagger
│   └── prisma/
│       ├── schema.prisma       # DB schema
│       └── seed.ts             # Seeded colleges and data
│
└── frontend/                   # React + Vite
    └── src/
        ├── api/                # Axios instance + API functions
        ├── components/
        │   ├── college/        # CollegeCard, FilterPanel
        │   ├── layout/         # Navbar, Footer, CompareBar, ProtectedRoute
        │   └── ui/             # StarRating, Skeleton, Pagination
        ├── pages/              # Home, Colleges, Detail, Compare, Saved, Predictor, Discussions
        ├── stores/             # Zustand: authStore, compareStore
        ├── hooks/              # useDebounce
        └── types/              # Shared TypeScript interfaces
```

---

## Local Setup

### Prerequisites
- Node.js 20+
- PostgreSQL (or free Neon account)

### Backend

```bash
cd backend

# Install dependencies
npm install

# Copy env and fill in your DATABASE_URL
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Push schema to DB
npx prisma db push

# Seed with 20 colleges
npm run seed

# Start dev server
npm run start:dev
# → Running on http://localhost:3000
# → Swagger at http://localhost:3000/api/docs
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy env
cp .env.example .env
# VITE_API_URL=http://localhost:3000/api

# Start dev server
npm run dev
# → Running on http://localhost:5173
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Colleges
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/colleges` | List with search, filter, pagination |
| GET | `/api/colleges/featured` | Top-rated colleges |
| GET | `/api/colleges/filters` | Available states, types, fees range |
| GET | `/api/colleges/:slug` | Full college detail |

### Compare
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/compare?ids=id1,id2,id3` | Compare 2–3 colleges |

### Predictor
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/predict` | Predict admission probability |

### Discussions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/discussions` | List all discussion threads |
| POST | `/api/discussions` | Create a new discussion thread |
| GET | `/api/discussions/:id` | Get thread details and its answers |
| POST | `/api/discussions/:id/answers` | Post an answer to a thread |
| POST | `/api/discussions/:id/vote` | Upvote/Downvote a thread |
| POST | `/api/discussions/answers/:id/vote` | Upvote/Downvote an answer |
| PATCH | `/api/discussions/answers/:id/accept` | Mark answer as accepted |

### Saved (JWT required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/saved` | Get user's saved colleges |
| GET | `/api/saved/ids` | Get saved college IDs |
| POST | `/api/saved/:collegeId` | Save a college |
| DELETE | `/api/saved/:collegeId` | Unsave a college |

---

## Deployment

### Backend → Hugging Face Spaces (Docker)

1. Create a Blank Docker space on Hugging Face.
2. Under **Settings** -> **Variables and secrets**, add:
   - `DATABASE_URL`: Your PostgreSQL connection string (Secret)
   - `JWT_SECRET`: Random secure string (Secret)
   - `FRONTEND_URL`: Your Vercel frontend URL (Variable)
3. Push your repository to Hugging Face. The `Dockerfile` at the root handles building and deploying the NestJS API.

### Frontend → Vercel

1. Create a new Vercel project and point it to the `frontend` folder of your GitHub repository.
2. Set the Environment Variable:
   - `VITE_API_URL=https://rehan3106-collegefind-backend.hf.space/api`
3. Deploy!

### Database → Neon

1. Create a free account at [neon.tech](https://neon.tech).
2. Copy the connection string and use it as your `DATABASE_URL`.
3. Run `npx prisma db push` and `npm run seed` locally or using an action to populate data.

---

## Architecture Decisions

**Why NestJS?** Modular architecture with decorators makes it easy to extend. Built-in Swagger, guards, pipes, and interceptors reduce boilerplate and demonstrate production patterns.

**Why Zustand?** Lightweight (no providers), simple API, and handles both auth (persisted) and compare basket (in-memory) cleanly without Redux overhead.

**Why React Query?** Automatic caching, background refetching, and `invalidateQueries` make save/unsave feel instant with no manual state sync. `placeholderData` prevents flash during pagination.

**Why Docker on Hugging Face?** Provides a free, scalable, easily configurable environment for running Node.js backends that perfectly mimics standard production containerization.

---

## Edge Cases Handled

- Image load error → fallback Unsplash image
- Unauthenticated save → redirect to login with `from` state
- Compare with < 2 colleges → UI guidance
- Duplicate save attempt → backend 409, frontend shows existing state
- Invalid college slug → 404 with navigation back
- Empty search results → illustrated empty state with reset CTA
- Pagination on filter change → resets to page 1
- Mobile: filter panel as bottom drawer
