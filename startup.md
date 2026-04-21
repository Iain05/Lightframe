# Startup Guide

## Development

Three layers need to run: MySQL (Docker), Spring backend, and the React frontend dev server.

### 1. Start the database

```bash
cd /home/iain/Documents/Lightframe
docker compose up mysql -d
```

Starts MySQL on port 3306. The `docker-compose.yml` reads credentials from `backend/.env`.

### 2. Start the backend

```bash
cd backend
./gradlew bootRun
```

Starts the Spring backend on `localhost:8080`. It reads `backend/.env` for DB credentials, R2 keys, and auth secrets via `spring.config.import`. Liquibase runs migrations automatically on startup — no need to apply `init.sql` manually.

### 3. Start the frontend

```bash
cd lightframe
npm run dev
```

Starts Vite on port 3000. All `/api` requests are proxied to `localhost:8080`.

---

### Environment files

| File | Purpose |
|------|---------|
| `backend/.env` | DB credentials, R2 credentials, JWT secret, admin password |
| `lightframe/.env` | `VITE_API_URL`, `VITE_BUCKET_BASE`, `VITE_GA_ID` |

---

## Production Deployment

Production runs all three services (MySQL, backend, frontend/nginx) via Docker Compose.

### 1. Build and start everything

```bash
cd /home/iain/Documents/Lightframe
docker compose up -d --build
```

This builds and starts:
- `mysql` — MySQL 9.6 on the internal network (not exposed externally)
- `backend` — Spring JAR built from `backend/Dockerfile`, exposed internally on port 8080
- `frontend` — React app built by Vite, served by nginx on port 81

The backend waits for MySQL to pass its healthcheck before starting.

### 2. Nginx routing (frontend container)

`lightframe/default.conf` is copied into the nginx container. It:
- Serves the React SPA from `/usr/share/nginx/html`
- Proxies `/api/` to `http://backend:8080/api/` on the internal Docker network
- Allows up to 30MB request bodies (for photo uploads)

### 3. Stopping

```bash
docker compose down
```

Data persists in the `mysql-data` named volume. To wipe the database:

```bash
docker compose down -v
```

---

### Build notes

- **Backend Dockerfile** — two-stage build: Gradle 8 + JDK 17 to compile, then `eclipse-temurin:17-jdk` to run. `backend/.env` is copied into the image.
- **Frontend Dockerfile** — two-stage build: Node 20 to run `npm run build`, then nginx:alpine to serve the `dist/`. `lightframe/.env` is baked in at build time via Vite.
- Schema migrations are handled by Liquibase on backend startup (`db/changelog/db.changelog-master.yaml`).
