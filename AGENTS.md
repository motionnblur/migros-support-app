# AGENTS.md - migros-support system guide

## 1) What this project is
`D:\Projects\migros-support` is an Electron + React desktop app for support operators.
It is tightly coupled with:
- `D:\Projects\migros-support-backend` (Node.js/Express + PostgreSQL projection + bridge service)
- `D:\Projects\migros-app` (Spring Boot core backend where real support/domain state lives)

If you change support features, assume all 3 repos may need updates.

## 2) Repository map

### This repo (`migros-support`)
- `src/main/index.js`: Electron main process, IPC handlers, HTTP calls to support backend.
- `src/preload/index.js`: safe bridge API exposed as `window.electronAPI`.
- `src/renderer/src/App.jsx`: auth/session bootstrap.
- `src/renderer/src/components/workspace/*`: inbox and chat UI.
- `src/renderer/src/utils/auth.js`: JWT decode/expiry helpers.

### Coupled repo (`migros-support-backend`)
- `src/routes/supportRoutes.js`: operator-facing API used by Electron app.
- `src/controllers/supportController.js`: DB + Spring forwarding logic.
- `src/routes/internalEventsRoutes.js`: ingest events from Spring backend.
- `src/config/db.js`: schema bootstrap (`support_conversations`, `support_messages`, `support_ingested_events`).

### Coupled repo (`migros-app`, Spring backend)
- `backend/src/main/java/.../service/support/SupportChatService.java`: source of support truth.
- `backend/src/main/java/.../service/support/SupportInternalEventService.java`: publishes events to Node support backend.
- `backend/src/main/java/.../controller/internal/InternalSupportController.java`: internal endpoints consumed by Node support backend.
- `backend/src/main/resources/application.properties`: support integration properties.

## 3) End-to-end data flow

1. Operator logs in from Electron:
- Electron `auth:login` -> `POST /auth/login` on `migros-support-backend`.
- Node backend validates against `users` table and returns JWT.

2. Inbox/message read flow:
- Electron polls `GET /support/conversations` every 5s.
- Electron polls `GET /support/conversations/:id/messages` every 4s for active chat.
- Reading messages resets `unread_count` to 0.

3. Operator write actions (send/edit/delete/ban/unban/clear):
- Electron -> Node support backend route.
- Node writes projection tables, then forwards to Spring internal support endpoint.

4. Customer/admin-side updates from Spring:
- Spring publishes internal events to Node:
  - `/internal/events/customer-message-created`
  - `/internal/events/support-message-edited`
  - `/internal/events/support-message-deleted`
- Node ingests with idempotency (`support_ingested_events`) and updates projection tables.

## 4) Contracts and identifiers

- In current behavior, `conversationId` is effectively `userMail`.
- Support send from Electron can create a new conversation if customer exists in Spring.
- Edit/delete in Node operator API are limited to `sender = AGENT` with `can_edit = true`.
- Spring side has separate admin edit/delete paths that can modify `USER` and `MANAGEMENT` messages and publish sync events.

## 5) Critical endpoint mapping

### Electron -> Node support backend
- `POST /auth/login`
- `GET /support/customers`
- `GET /support/conversations`
- `GET /support/conversations/:conversationId/messages`
- `POST /support/conversations/:conversationId/messages`
- `PATCH /support/conversations/:conversationId/messages/:messageId`
- `DELETE /support/conversations/:conversationId/messages/:messageId`
- `POST /support/conversations/:conversationId/ban`
- `POST /support/conversations/:conversationId/unban`
- `POST /support/conversations/:conversationId/clear`

### Node support backend -> Spring internal support
- `GET /internal/support/customers`
- `GET /internal/support/customer-status`
- `POST /internal/support/agent-message`
- `POST /internal/support/edit-agent-message`
- `POST /internal/support/delete-agent-message`
- `POST /internal/support/ban-user`
- `POST /internal/support/unban-user`
- `POST /internal/support/clear-chat`

### Spring -> Node internal event ingest
- `POST /internal/events/customer-message-created`
- `POST /internal/events/support-message-edited`
- `POST /internal/events/support-message-deleted`

## 6) Environment variable alignment (important)

### `migros-support` (Electron)
- `SUPPORT_API_BASE_URL` (default `http://127.0.0.1:3000`)

### `migros-support-backend` (Node)
- `PORT` (default `3000`)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `SPRING_SUPPORT_BASE_URL` (default `http://localhost:8080`)
- `SPRING_SUPPORT_INTERNAL_KEY` -> sent as `x-internal-key` to Spring internal support endpoints
- `INTERNAL_EVENT_KEY` -> expected `x-internal-key` from Spring event publisher

### `migros-app` (Spring)
- `support.internal.key` (`SUPPORT_INTERNAL_KEY`) -> must match Node `SPRING_SUPPORT_INTERNAL_KEY`
- `support.service.base-url` (`SUPPORT_SERVICE_BASE_URL`) -> points to Node support backend
- `support.service.internal-key` (`SUPPORT_SERVICE_INTERNAL_KEY`) -> must match Node `INTERNAL_EVENT_KEY`

If these keys do not match, sync and internal actions fail with 401/502.

## 7) Local run order (recommended)

1. Start Spring ecosystem (`D:\Projects\migros-app`):
- `docker compose --env-file configs/postgres.env --env-file configs/spring.env up`
- API is exposed via nginx at `http://localhost:8080`

2. Start Node support backend (`D:\Projects\migros-support-backend`):
- `npm run dev`

3. Start Electron app (`D:\Projects\migros-support`):
- `npm run dev`

## 8) Change rules for future agents

When adding or changing support behavior:

1. Update Electron IPC in both files:
- `src/main/index.js`
- `src/preload/index.js`

2. Update renderer usage:
- `SupportWorkspace.jsx` and/or `ChatPanel.jsx`, `ConversationList.jsx`

3. Update Node support backend route/controller and forwarding contract:
- `src/routes/supportRoutes.js`
- `src/controllers/supportController.js`

4. If behavior touches core support domain/state, update Spring internal endpoint/service:
- `InternalSupportController`
- `SupportChatService`
- optionally `SupportInternalEventService` + ingest endpoints

5. Keep event payload compatibility and idempotency.

## 9) Verification checklist after support changes

1. Login works from Electron.
2. Conversation list loads and auto-refreshes.
3. Message send creates/syncs correctly.
4. Edit/delete works and reflects on both sides.
5. Ban/unban/clear chat works and UI state updates.
6. New customer search + first-message conversation creation works.
7. No 401/502 from internal key mismatch.

## 10) Known gotchas

- UI uses polling, not websocket, so expect up to 4-5 second delay.
- `mockSupportData.js` is not runtime source of truth.
- Some Turkish UI labels currently look mojibake (encoding issue). Preserve UTF-8 when editing.
- `application.properties` in `migros-app` currently includes sensitive-looking values; never hardcode or leak secrets in commits/logs.

## 11) If asked to "review" this project

Prioritize:
1. cross-repo contract mismatches
2. auth and internal-key handling
3. data consistency between Spring source-of-truth and Node projection tables
4. regressions in message lifecycle (send/edit/delete/ban/clear)
