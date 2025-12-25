import express from "express";
import employeeController from "../controllers/employeeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const initEmployeeRoute = (app) => {
  // Danh sách nhân viên (admin only)
  router.get("/api/employees", authMiddleware.checkPermission(["admin"]), employeeController.getAllEmployees);

  // Chi tiết nhân viên (thống kê)
  router.get("/api/employees/:MaTaiKhoan", authMiddleware.checkPermission(["admin"]), employeeController.getEmployeeDetail);

  // Tạo tài khoản nhân viên (admin only)
  router.post("/api/employees", authMiddleware.checkPermission(["admin"]), employeeController.createEmployee);

  // Xóa nhân viên (admin only)
  router.delete("/api/employees/:MaTaiKhoan", authMiddleware.checkPermission(["admin"]), employeeController.deleteEmployee);

  return app.use("/", router);
};

export default initEmployeeRoute;