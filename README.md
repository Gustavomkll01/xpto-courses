# XPTO Courses - Course Management (Node.js + React + PostgreSQL)

Solution for the XPTO technical test: CRUD for users, courses, modules and contents, SQL reports, watch tracking, Swagger and a Postman collection.

## Run with Docker

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:8081 |
| API | http://localhost:3001/api |
| Swagger UI | http://localhost:3001/api-docs |

The API container runs migrations and seeds on start.

## Run locally (without Docker for the apps)

```bash
docker compose up -d db
cd backend && cp .env.example .env && npm install && npm run setup && npm run dev
cd frontend && npm install && npm run dev      # http://localhost:5173 (proxies /api)
```

Other scripts: `npm run migrate`, `npm run migrate:undo`, `npm run seed` (backend).

## Stack
Node.js, Express, Sequelize + sequelize-cli (migrations/seeders), PostgreSQL, React (Vite), Docker, Swagger UI (OpenAPI 3).

## Data model
See [docs/DER.md](docs/DER.md). Extra table `content_views` records who watched which content (many-to-many with `watched_at`, unique per user/content).
`courses` and `modules` have `user_id` (author). Everything in the code and database is in English.

## Seed data
5 users and 5 courses: course 1 = 5 modules x 3 contents, course 2 = 3 x 5, course 3 = 2 x 4, courses 4 and 5 = 1 x 2 (to reach 5 records per table, as requested). Content ID 2 was watched by 3 users.
Note: courses 1 and 2 tie at 15 contents, so SQL 02 returns both.

## Reports (SQL)
All queries are in [docs/reports.sql](docs/reports.sql) and exposed by the API/UI:

| Query | Endpoint |
|---|---|
| 01 Users with most courses | `GET /api/reports/users-most-courses` |
| 02 Course with most contents | `GET /api/reports/course-most-contents` |
| 03 Courses with module/content totals | `GET /api/reports/courses-totals` |
| 04 Contents with course name | `GET /api/reports/contents-with-course` |
| 05 Users who watched content ID=2 | `GET /api/reports/contents/2/watched-by` |

## API
REST routes: `/api/users`, `/api/courses`, `/api/modules`, `/api/contents` (GET, POST, GET/PUT/DELETE `/:id`; filter by FK, e.g. `/api/modules?courseId=1`), `/api/contents/:id/views` (GET, POST).
Docs: Swagger at `/api-docs`, spec in [docs/openapi.json](docs/openapi.json), Postman collection in [docs/postman_collection.json](docs/postman_collection.json) (variable `baseUrl`). Regenerate with `npm run docs:generate` in `backend`.

## Deploy on Heroku
The `Procfile` runs migrations on release. Single-app option (API only):

```bash
heroku create <app-name>
heroku addons:create heroku-postgresql:essential-0
heroku config:set DB_SSL=true
git subtree push --prefix backend heroku main
heroku run "npx sequelize-cli db:seed:all"
```
The frontend can be deployed as a second app (build with `VITE_API_URL=https://<api-app>.herokuapp.com/api`, serve `dist`) or any static host.
