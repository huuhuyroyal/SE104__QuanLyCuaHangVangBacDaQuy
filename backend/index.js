import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/connectDB.js";
import initProductRoute from "./src/routes/productRoute.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Khởi tạo các Route
initProductRoute(app);
// Kiểm tra kết nối DB
connectDB();
// Chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy ở port http://localhost:${PORT}`);
});
