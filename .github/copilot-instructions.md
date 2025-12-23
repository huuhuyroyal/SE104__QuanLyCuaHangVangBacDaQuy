# Copilot instructions — SE104__QuanLyCuaHangVangBacDaQuy

Short, actionable guidance for an AI coding agent working in this repository.

1) Big picture
- Two-tier app: Backend (Node.js + Express) and Frontend (React + Vite).
- Backend talks to a local MySQL DB named `qlbh` and exposes REST endpoints on port 8080.
- Frontend (Vite) runs on port 5173 and calls the backend via the Axios instance at `http://localhost:8080`.

2) Key entry points / important files
- Backend entry: `index.js` (root of `backend/`).
- DB config: `backend/src/config/connectDB.js` (uses a mysql2 pool; database name `qlbh`).
- Controllers: `backend/src/controllers/productController.js` (multer + Cloudinary usage, error/response patterns).
- Services: `backend/src/service/productService.js` (business logic called by controllers).
- SQL seed: `backend/src/sql/data.sql` (use to create/seed `qlbh`).
- Frontend axios instance: `frontend/src/services/axios.js` (sets `baseURL` and unwraps `response.data`).
- Frontend routes and UI entry: `frontend/src/routes/index.js`, `frontend/src/main.jsx`, `frontend/src/App.jsx`.
- Redux store: `frontend/src/redux/store.js` and `frontend/src/redux/slices/*`.

3) Run / dev workflow (explicit)
- Start MySQL (the README expects XAMPP/phpMyAdmin). Create database named exactly `qlbh` and import `backend/src/sql/data.sql`.
- Backend: `cd backend && npm install` then `npm start` (uses `nodemon --inspect index.js`). Keep this terminal running.
- Frontend: `cd frontend && npm install` then `npm run dev` (Vite serves on 5173).

4) Project-specific conventions & gotchas
- Database name is hard-coded to `qlbh` in `connectDB.js`. Tests and local runs assume this exact name.
- Cloudinary credentials are currently hard-coded in `productController.js` — treat them as required values that should be moved to `.env` for production.
- Image uploads: `productController.js` uses `multer-storage-cloudinary`; uploaded image URL is available as `file.path` and stored in `HinhAnh`.
- API response pattern: controllers return either plain arrays/objects or objects with `errCode` and `message`. The frontend Axios instance returns `response.data` directly.
- Keep the backend terminal alive while developing the frontend — frontend expects a running backend.

5) Common edit patterns an agent will perform
- Adding an API route: add route in `backend/src/routes/*`, implement controller in `backend/src/controllers/*`, add business logic to `backend/src/service/*`.
- Changing DB schema: update `backend/src/sql/data.sql` and seed DB via phpMyAdmin or mysql CLI.
- Changing frontend API calls: update endpoints in `frontend/src/services/productService.js` (this uses the shared axios instance).

6) Debugging tips
- Backend runs with `--inspect` so you can attach a Node debugger to the process for stepping through code.
- SQL errors: inspect queries in `backend/src/service/productService.js` and use `backend/src/sql/data.sql` to reproduce data locally.

7) Safety & next steps for maintainers
- Move Cloudinary keys and DB credentials into a `.env` and load them with `dotenv` before committing.
- If you change backend port, remember to update `frontend/src/services/axios.js` baseURL.

If anything here is unclear or you'd like additional examples (example API endpoint mappings, or a small change like moving credentials to `.env`), tell me which part to expand and I will update this file.
