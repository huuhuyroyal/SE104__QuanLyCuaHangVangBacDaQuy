import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/connectDB.js";
import authMiddleware from "./src/middleware/authMiddleware.js";
import initProductRoute from "./src/routes/productRoute.js";
import initUserRoute from "./src/routes/userRoute.js";
import initDashboardRoute from "./src/routes/dashboardRoute.js";
import initProductTypeRoute from "./src/routes/productTypeRoute.js";
import initServiceTypeRoute from "./src/routes/serviceTypeRoute.js";
import initUnitRoute from "./src/routes/unitRoute.js";
import initInvoiceRoute from "./src/routes/invoiceRoute.js";
import initCustomerRoute from "./src/routes/customerRoute.js";
import initPurchaseRoute from "./src/routes/purchaseRoute.js";
import initSupplierRoute from "./src/routes/supplierRoute.js";
import initReportRoute from "./src/routes/reportRoute.js";
import initServiceTicketRoute from "./src/routes/serviceTicketRoute.js";
import initProfileRoutes from "./src/routes/profileRoute.js";
import initEmployeeRoute from "./src/routes/employeeRoute.js";

import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

initUserRoute(app);
app.use(authMiddleware.verifyToken);

// Khởi tạo các Route
initProductRoute(app);
initDashboardRoute(app);
initProductTypeRoute(app);
initServiceTicketRoute(app);
initUnitRoute(app);
initServiceTypeRoute(app);
initUnitRoute(app);
initInvoiceRoute(app);
initCustomerRoute(app);
initPurchaseRoute(app);
initSupplierRoute(app);
initReportRoute(app);
initProfileRoutes(app);
initEmployeeRoute(app);
// Kiểm tra kết nối DB
connectDB();

app.listen(PORT, () => {
  console.log(`Server đang chạy ở port http://localhost:${PORT}`);
});
