import express from "express";
import cors from "cors";
import { connectDB, connection } from "./src/config/connectDB.js";
import initProductRoute from "./src/routes/productRoute.js";
import initUserRoute from "./src/routes/userRoute.js";
import initDashboardRoute from "./src/routes/dashboardRoute.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Initialize routes
initProductRoute(app);
initUserRoute(app);
initDashboardRoute(app);
// Check DB connection
connectDB();

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const conn = await connection.getConnection();
    conn.release();
    return res.status(200).json({ status: "ok", db: "connected" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
