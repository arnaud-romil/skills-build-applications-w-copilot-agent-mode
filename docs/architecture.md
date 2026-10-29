# OctoFit Tracker architecture

OctoFit Tracker is a three-tier application for a school fitness program. The starter code includes API contracts and intentionally incomplete implementation points so you can use GitHub Copilot agent mode in a test-driven loop.

![Three-tier OctoFit architecture](../.github/images/octofit-architecture.svg)

## Tier boundaries

- **Presentation tier**: React 19, Vite, React Router, Bootstrap, and a shared API client in `octofit-tracker/frontend/src`.
- **Logic tier**: Express and TypeScript routes/services in `octofit-tracker/backend/src` expose `/api/*` behavior on port `8000`.
- **Data tier**: Mongoose models and seed data in `octofit-tracker/backend/src/models` and `src/scripts/seed.ts` persist to MongoDB on port `27017`.

## Ports and environment rules

- MongoDB: `27017`
- Express API: `8000`
- Vite frontend: `5173`
- The browser calls relative `/api` paths. Vite proxies them to `http://localhost:8000`, so the unauthenticated API port stays private in Codespaces. `VITE_API_BASE_URL` can override the base URL.

## API contract

| Capability | Method and path | Expected behavior |
| --- | --- | --- |
| Activity tracking | `GET /api/activities`, `POST /api/activities` | List and create valid activity records. POST accepts `userId`, `teamId`, `type`, and `minutes`; `userId` and `teamId` must be well-formed IDs for an existing user and team; otherwise respond with a deliberate 4xx (never a 500 from a cast error). A created activity stores the submitted `user`, `team`, `type`, and `minutes` plus computed `points` and `occurredAt`. |
| Teams | `GET /api/teams`, `POST /api/teams` | List and create teams with members. Created and listed teams keep the submitted `name` and `mascot`. Reject a team without a name with `400`. |
| Leaderboard | `GET /api/leaderboard` | Return teams ordered by the sum of their activity points, highest first. Each entry has `teamName`, `totalPoints`, and a 1-based `rank`. |
| Workout suggestions | `GET /api/workouts/suggestions/:userEmail` | Recommend workouts from recent activity patterns for the matching seeded user's email address. The first suggestion's `focus` matches that user's goal or recent activity, with a `reason` explaining why. An email with no matching user returns a deliberate 4xx (for example, `404`). |

## Implementation decisions

- Presentation tier decision: Build the React pages as thin consumers of the API contract. Each route should fetch from the shared API client, render loading/empty/error states, and surface accessible alerts instead of placeholder text.
- Logic tier decision: Keep validation and status handling in Express service functions, while routes stay focused on request/response plumbing. Reject malformed IDs and missing seeded records with deliberate 4xx responses instead of allowing cast or lookup errors to escape as 500s.
- Data tier decision: Keep schema validation and Mongo relationships in Mongoose models, then seed stable demo users, teams, activities, and workouts with upserts so repeated runs remain idempotent.
- Activity tracking approach: Store the submitted user/team IDs, computed points, and occurredAt timestamp; validate user and team existence before persisting, and ensure a bad `userId` or `teamId` fails fast with a 4xx.
- Team management approach: Require a team name and mascot, default `members` to an empty array, and preserve the submitted member references when listing or creating teams.
- Leaderboard approach: Aggregate team totals from activity points, sort descending by total, and assign a 1-based rank sequence to each team result.
- Workout suggestions approach: Match the requested email to a seeded user, derive the recommendation from that user's dominant goal or recent activity pattern, and include a human-readable `reason` for the top suggestion.

## Test plan

- Data-tier command: `npm run test:data --prefix octofit-tracker/backend`
  - Failing here means the schema layer is not enforcing required fields or not preserving the seed contract. The current red tests indicate a missing User/Team/Activity/Workout validation layer before any API behavior can work.
- API command: `npm run test:api --prefix octofit-tracker/backend`
  - Failing here means the Express service logic is incomplete. The current failures include 501s for invalid input, empty leaderboard totals, and incorrect workout matches, which points to missing request validation and business logic in the backend.
- Frontend command: `npm test --prefix octofit-tracker/frontend`
  - Failing here means the UI is still rendering placeholders instead of consuming the real API contract. The test suite specifically expects loading, empty, and error states and a real `/api/workouts/suggestions/...` fetch when rendering the workouts page.
- Backend build command: `npm run build --prefix octofit-tracker/backend`
  - Use this after the schema and service layers are implemented to confirm TypeScript compilation and contract compatibility.
- Frontend build command: `npm run build --prefix octofit-tracker/frontend`
  - Use this after the UI fetch logic and accessible states are in place to confirm the presentation tier compiles cleanly against the API shapes.

The safest sequence is to fix the data contracts first, then the API behavior, and only then complete the presentation tier. That order matches the dependency chain in the three-tier architecture and the actual failing contracts.
