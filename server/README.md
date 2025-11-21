# WCJG Leaderboard Server (Spring Boot)

Simple REST API for shared leaderboard.

## Endpoints
- `POST /api/scores`  body: `{ "name": "Joon", "score": 328 }`
- `GET  /api/scores?limit=20`

Sort: score DESC, then createdAt DESC. Empty name becomes `Anonymous`.

## Run locally
```bash
cd server
mvn spring-boot:run
# or
mvn -DskipTests package
java -jar target/wcjg-leaderboard-0.0.1.jar
```

DB: H2 file at `server/data/wcjg*` (auto-created).

## Deploy (Render.com example)
- Root Directory: `server`
- Build Command: `mvn -DskipTests package`
- Start Command: `java -jar target/wcjg-leaderboard-0.0.1.jar`
- Then set your front-end API_BASE to the Render URL.
