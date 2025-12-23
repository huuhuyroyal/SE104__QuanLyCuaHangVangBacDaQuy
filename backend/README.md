# Backend — Setup & Run

Copy `.env.example` to `.env` and fill values (MySQL credentials, Cloudinary, JWT secret).

1. Install dependencies
   npm install

2. Install dependencies
   npm install

3. Start the server (development)
   npm start

Or use Docker Compose to run a MySQL server:

4. docker-compose up -d   # (from backend/)
5. After DB is healthy run:
   npm run db:init
   npm start

Notes:
- The server will exit if it cannot connect to the database. Ensure your MySQL server is running and the configured DB exists (or run `npm run db:init` after docker-compose).
- Adminer (DB UI) will be available at http://localhost:8081 with root/rootpassword when using docker-compose.
- Set Cloudinary environment variables to enable image upload.
- JWT secret is `JWT_SECRET`.
