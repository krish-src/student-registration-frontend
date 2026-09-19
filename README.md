# Student Registration System — Frontend

Next.js + React + TypeScript frontend for the Student Registration System.
Talks to the separate `student-registration-backend` FastAPI service over
REST — it never connects to PostgreSQL directly.

## 1. Overview

Two pages:

- `/student/register` — registration form with client-side validation
- `/students` — table listing all registered students

## 2. Prerequisites

- Node.js 18.18+ (LTS recommended, e.g. Node 20)
- npm (comes with Node.js)
- The backend (`student-registration-backend`) running at `http://localhost:8000`

## 3. Installation

```bash
cd student-registration-frontend
npm install
```

## 4. Configure environment variables

```bash
cp .env.example .env.local
```

`.env.local` contains:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This tells the frontend where the backend API lives. `.env.local` is
git-ignored — never commit real environment files.

## 5. Start the app

Make sure the backend is already running first (see the backend README),
then:

```bash
npm run dev
```

Open: **http://localhost:3000**

## 6. Available pages

| Page | URL | Description |
|---|---|---|
| Home | `/` | Links to the other two pages |
| Register | `/student/register` | Registration form |
| Students | `/students` | Table of all registered students |

## 7. How the frontend talks to the backend

All API calls live in `lib/api.ts`. It reads the backend's base URL from
`NEXT_PUBLIC_API_URL` and calls:

- `POST {NEXT_PUBLIC_API_URL}/api/v1/students` — to register a student
- `GET {NEXT_PUBLIC_API_URL}/api/v1/students` — to list students

`lib/validation.ts` re-implements the same validation rules as the
backend's Pydantic schema, so users get instant feedback before any
network request is made. The backend still re-validates everything
independently — frontend validation is a convenience, not a security
boundary.

## 8. Project structure

```
student-registration-frontend/
├── pages/
│   ├── _app.tsx
│   ├── index.tsx
│   ├── students.tsx
│   └── student/
│       └── register.tsx
├── components/
│   └── Nav.tsx
├── lib/
│   ├── api.ts          # calls the backend REST API
│   └── validation.ts    # client-side validation rules
├── types/
│   └── student.ts        # shared TypeScript types
├── styles/
│   └── globals.css
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
└── README.md
```

## 9. Troubleshooting

| Problem | Possible cause | How to check | How to fix |
|---|---|---|---|
| Blank page / build errors | Dependencies not installed | Check `node_modules` exists | `npm install` |
| "Could not reach the server" message on submit | Backend not running | Open `http://localhost:8000/docs` | Start the backend first |
| CORS error in browser console | Backend `CORS_ORIGINS` doesn't include `http://localhost:3000` | Check backend `.env` | Update backend's `CORS_ORIGINS` and restart it |
| `NEXT_PUBLIC_API_URL` seems ignored | Env file not named correctly, or dev server not restarted | Confirm file is `.env.local` | Rename file, restart `npm run dev` |
| `npm run dev` fails immediately | Wrong Node.js version | `node -v` | Install Node 18.18+ |
| Port 3000 already in use | Another app is using the port | Check terminal output | Stop the other app, or run `npm run dev -- -p 3001` |
