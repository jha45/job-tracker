# JobTrackr — Mini Job Application Tracker

A clean full-stack app to track job applications through the hiring pipeline.

Built with **React + TypeScript** on the frontend, **Node.js + Express + TypeScript** on the backend, and **PostgreSQL** as the database.

---

## Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | React 18, TypeScript, Vite        |
| Backend  | Node.js, Express, TypeScript      |
| Database | PostgreSQL (with native triggers) |
| Styling  | Plain CSS with CSS variables      |
| Testing  | Jest + ts-jest                    |
| Docker   | docker-compose for full stack     |

---

## Features

- **Application List** — company, role, type, status, date at a glance
- **Add / Edit** — form with validation for all required fields
- **Delete** — with confirmation dialog
- **Filter by Status** — clickable stat cards + dropdown (Applied / Interviewing / Offer / Rejected)
- **Search** — by company name or job title
- **Pagination** — 10 results per page
- **View Drawer** — detailed slide-over panel per application
- **Loading states** — spinner while fetching, empty state with CTA
- **Responsive** — works on mobile and desktop

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)
- npm

---

## Installation

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd job-tracker
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env — set your DATABASE_URL
npm install
npm run migrate    # creates tables and triggers
npm run dev        # starts on http://localhost:5000
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/job_tracker
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## Running with Docker

```bash
docker-compose up --build
```

- Frontend → http://localhost:5173
- Backend → http://localhost:5000
- Postgres → localhost:5432

---

## Running Tests

```bash
cd backend
npm test
```

Tests cover validation logic for creating applications (required fields, type enums, date formats).

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint            | Description                                                     |
| ------ | ------------------- | --------------------------------------------------------------- |
| GET    | `/applications`     | List all (supports `?status=`, `?search=`, `?page=`, `?limit=`) |
| GET    | `/applications/:id` | Get single application                                          |
| POST   | `/applications`     | Create application                                              |
| PATCH  | `/applications/:id` | Partial update                                                  |
| DELETE | `/applications/:id` | Delete application                                              |
| GET    | `/health`           | Health check                                                    |

### Example: Create Application

```json
POST /api/applications
{
  "company_name": "Google",
  "job_title": "Frontend Engineer Intern",
  "job_type": "Internship",
  "status": "Applied",
  "applied_date": "2024-06-18",
  "notes": "Applied via referral"
}
```

---

## Database Schema

```sql
CREATE TABLE applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  job_title    VARCHAR(255) NOT NULL,
  job_type     ENUM('Internship', 'Full-time', 'Part-time') NOT NULL,
  status       ENUM('Applied', 'Interviewing', 'Offer', 'Rejected') NOT NULL,
  applied_date DATE NOT NULL,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()   -- auto-updated via trigger
);
```

---

## Architecture Notes

The app follows a clean separation of concerns:

- **Frontend** — React with a custom `useApplications` hook managing all data-fetching state (loading, error, filters, pagination). Each UI concern lives in its own component. The API layer is a thin typed wrapper over `fetch`.
- **Backend** — Express router → controller pattern. Validation happens in the controller before touching the database. No ORMs — raw `pg` queries for clarity and control.
- **Database** — Enum types enforced at the DB level. `updated_at` is maintained by a trigger, not application code, so it can't drift.

---

## How I Used AI

I used Claude (Anthropic) to help scaffold boilerplate, structure types across frontend and backend, and review edge cases in the validation logic. All architecture decisions, component design, and code review were done by me.

---

## Screenshots

![Dashboard](./screenshots/26739F8C-286C-42F3-9EC7-FC3D622D15F8.jpeg)
![Add Application](./screenshots/3E221DF7-8ECE-4601-9FB6-A8DD3D84B60B.jpeg)
![Application Detail](./screenshots/DCCA3BD2-5CD7-4487-A7DE-ABF7E4A4527B.jpeg)

---

## Live Demo

_Add deployment link here if deployed._
