import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/connectDB.js";
import initProductRoute from "./src/routes/productRoute.js";
import initUserRoute from "./src/routes/userRoute.js";
import initDashboardRoute from "./src/routes/dashboardRoute.js";
import initUnitRoute from "./src/routes/unitRoute.js";
import initInvoiceRoute from "./src/routes/invoiceRoute.js";
import initCustomerRoute from "./src/routes/customerRoute.js";
import initPurchaseRoute from "./src/routes/purchaseRoute.js";
import initSupplierRoute from "./src/routes/supplierRoute.js";
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
initUnitRoute(app);
initInvoiceRoute(app);
initCustomerRoute(app);
initPurchaseRoute(app);
initSupplierRoute(app);
// Kiểm tra kết nối DB
connectDB();
// Chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy ở port http://localhost:${PORT}`);
});
