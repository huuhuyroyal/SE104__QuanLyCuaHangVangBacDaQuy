# SE104__QuanLyCuaHangVangBacDaQuy

Project contains `backend/` (Express + MySQL) and `frontend/` (Vite + React).

## Backend — Quick start
1. cd backend
2. Copy `.env.example` to `.env` and fill values (MySQL credentials, Cloudinary, JWT_SECRET)
3. npm install
4. npm start

> The backend will exit if it cannot connect to the database — make sure your MySQL server is running and the configured DB exists.

## Frontend — Quick start
1. cd frontend
2. Copy `.env.example` to `.env` and set `VITE_API_URL` (defaults to http://localhost:8080)
3. npm install
4. npm run dev

## Notes
- Cloudinary is used for image uploads, set the credentials in the backend `.env`.
- JWT is used for authentication; the token is issued by backend on login.

If you'd like, I can try starting the backend and testing key endpoints next, or continue fixing remaining checks.
