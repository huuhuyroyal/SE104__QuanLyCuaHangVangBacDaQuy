import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/connectDB.js";
import initProductRoute from "./src/routes/productRoute.js";
import initUserRoute from "./src/routes/userRoute.js";
import initDashboardRoute from "./src/routes/dashboardRoute.js";
// --- IMPORT NEW ROUTE ---
import initProductTypeRoute from "./src/routes/productTypeRoute.js"; 
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Khởi tạo các Route
initProductRoute(app);
initUserRoute(app);
initDashboardRoute(app);
initProductTypeRoute(app);

// Kiểm tra kết nối DB
connectDB();

app.listen(PORT, () => {
  console.log(`Server đang chạy ở port http://localhost:${PORT}`);
});