# Smart Object PR — Project Documentation

This repository contains a small full-stack application (frontend + backend) for a social-like app with OTP-based registration, login, JWT authentication, and basic post creation. The README documents the features, how to use the major files, environment variables, API endpoints, and how to run the project locally.

## Table of contents
- Project overview
- Quick start
- Backend: features, structure, API endpoints
- Frontend: features, structure, pages and how to use them
- Environment variables
- Notes, troubleshooting & changelog

## Project overview

- **Backend:** Node + Express + Mongoose. Handles user OTP-based registration, password hashing, JWT generation, cookie setting, post CRUD and media uploads via Cloudinary.
- **Frontend:** React + Vite + Tailwind. Implements register/login flows, a feed, create-post UI and a simple `AuthContext` for local auth state.

## Quick start (dev)

1. Start backend

```powershell
cd e:\Ahmed\code\roughly\smart-object-pr\project\backend
npm install
node server.js
```

2. Start frontend

```powershell
cd e:\Ahmed\code\roughly\smart-object-pr\project\frontend
npm install
npm run dev
```

Open the URL printed by Vite (commonly http://localhost:5173).

## Backend — detailed

Folder: `backend/`

Primary responsibilities:
- User authentication (OTP flow + password login)
- JWT creation and verification
- Post creation, listing, update and delete
- Optional media upload using Cloudinary

Key files
- `server.js` — starts the server
- `app.js` — Express app, CORS, body parsing and route mounting
- `config/db_connection.js` — mongoose connection helper
- `controllers/user.controller.js` — main user flows: `sendOtp`, `verifyOtpp`, `login`, `updateProfile`, `checkAuthenticated`, `logout`.
- `routes/user.route.js` — mounts the routes on `/api/auth` (see endpoints below)
- `models/user.model.js` — schema + methods: `generateJwtToken`, `comparePassword`, static `hashPassword`.
- `controllers/post.controller.js` & `routes/post.route.js` — post endpoints mounted on `/api/posts`.
- `services/emailService.js` — uses SendGrid to send OTP email

### Important notes about backend auth
- Registration: two steps. First `POST /api/auth/send-otp` with `{ email }`. Then `POST /api/auth/verify-otp` with `{ userName, email, otp, password }` to finalize account creation.
- On verify and on login the server sets a cookie `auth_token` and returns a response containing a `token` property. The frontend saves this token in `localStorage` as well.

### Backend API (summary)

Auth (`/api/auth`):
- POST `/send-otp` — { email }
- POST `/verify-otp` — { userName, email, otp, password }
- POST `/user-login` — { email, password }
- GET `/logout` — clears cookie
- PUT `/update-profile` — (protected) update username
- GET `/check-auth` — (protected) verify JWT and return user

Posts (`/api/posts`):
- POST `/` — create post (auth + optional media)
- GET `/` — get feed
- GET `/user` — (auth) get current user's posts
- PUT `/:id` — (auth) update
- DELETE `/:id` — (auth) delete

Example (PowerShell/cURL) — login:

```powershell
curl -X POST http://localhost:8020/api/auth/user-login -H "Content-Type: application/json" -d '{"email":"you@example.com","password":"yourpass"}'
```

## Frontend — detailed

Folder: `frontend/src/`

Responsibilities and main pieces:
- `src/services/authService.js` — axios helpers for auth flows. Functions: `sendOtp`, `verifyOtp`, `loginUser`, `logoutUser`, `checkAuth`.
- `src/context/useAuthStore.jsx` — `AuthContext` that stores `user` and `token` and exposes `login` / `logout`.
- `src/pages/Register.jsx` — two-step OTP registration UI (send OTP → verify OTP + password). On success it attempts to log the user in.
- `src/pages/Login.jsx` — login UI that calls `loginUser` and navigates to `/me` (dashboard/profile).
- `src/pages/CreatePost.jsx`, `Home.jsx`, `Dashboard.jsx` — feed and post features.

How the auth flow works in the UI (user perspective):
1. Register: enter email → click "Send OTP" → you receive an email with an OTP.
2. Verify: enter your name, OTP and password → the frontend calls `verifyOtp`, saves token and redirects to your profile.
3. Login: enter email & password → the frontend calls `loginUser`, saves token and redirects.

The `authService` hooks already set the token to `localStorage` when a `token` is present in the response:

- `localStorage.setItem('token', token)`

If you rely on cookie-based auth instead, ensure your axios requests include credentials and your frontend origin matches `FRONTEND_URL` allowed by the backend CORS config.

## Environment variables (examples)

Backend (`backend/.env`):
- `PORT` — e.g. `8020`
- `mongoDBConnection` — e.g. `mongodb://localhost:27017/SmartObjectPrj`
- `jwt_secret_key` — your JWT secret (KEEP SECRET)
- `FRONTEND_URL` — e.g. `http://localhost:5173`
- `SENDGRID_API_KEY`, `SENDER_EMAIL`
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Frontend (Vite) (`frontend/.env` or `VITE_` env):
- `VITE_APP_BACKEND_URL` — e.g. `http://localhost:8020/api`

> Security: never commit real secrets. Replace values with placeholders in version control.

## Troubleshooting

- "user not found" on verify: make sure `email` matches the one you used for `send-otp`.
- "Invalid or expired Otp": OTPs expire (server sets a short expiry). Request a new OTP and retry.
- DB connection issues: confirm MongoDB is running and `mongoDBConnection` is correct.
- Token or cookie issues: backend sets a cookie (`auth_token`) and returns a token in response. The frontend stores a token in `localStorage` for Authorization header usage — make sure both sides use the same scheme.

## Changelog / Local edits

- Fixed: `backend/controllers/user.controller.js` — call static `User.hashPassword(password)` instead of `user.hashPassword(password)` (fixes `TypeError: user.hashPassword is not a function`).
- Added: `frontend/src/pages/Register.jsx` — a complete two-step registration page that calls `sendOtp` and `verifyOtp`.

---


