# ConstructoCalc AI

ConstructoCalc AI is a production-style full-stack web application for India-focused house construction cost estimation. It combines a React + Tailwind dashboard, an Express + MongoDB backend, JWT authentication, AI-powered Groq analysis, saved projects, an admin rate panel, scenario comparison, and PDF reporting.

## Stack

- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT
- AI: Groq chat completions API
- PDF export: PDFKit on the backend

## Project Structure

```text
client/
server/
README.md
```

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Required Environment Variables

### Server

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `CLIENT_URL`
- `ADMIN_EMAIL`

Recommended Groq model:
- `llama-3.3-70b-versatile`

### Client

- `VITE_API_URL`

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/calculate`
- `GET /api/rates`
- `POST /api/project`
- `GET /api/projects`
- `GET /api/projects/:id/report`
- `POST /api/ai/analyze`
- `GET /api/ai/chat`
- `POST /api/ai/chat`
- `POST /api/admin/rates`

## Calculation Logic

- `built_up_area = plot_size × floors × 1.2`
- `cement = built_up_area × 0.4`
- `steel = built_up_area × 4`
- `sand = built_up_area × 0.02`
- `bricks = built_up_area × 8`
- `labor_cost = material_cost × labor_percentage`
- `total_cost = (material_cost + labor_cost) × city_multiplier`

Quality, material preference, and inflation multipliers are layered on top to make the estimate more usable in real scenarios.

## Deployment

### Frontend on Vercel

- Set root directory to `client`
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL`

### Backend on Render or Railway

- Set root directory to `server`
- Start command: `npm start`
- Add all server environment variables
- Use MongoDB Atlas for the database

## Notes

- Default Indian city multipliers and material rates are auto-seeded on server startup.
- If `ADMIN_EMAIL` is set, an admin user is seeded with password `Admin@123`. Change it immediately in production.
- The AI chat stores message history per authenticated user.
