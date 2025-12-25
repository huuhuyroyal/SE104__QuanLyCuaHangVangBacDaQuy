import express from "express";
import {
  getAllEmployees,
  createEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

const initEmployeeRoute = (app) => {
  // Đảm bảo các hàm controller được import đúng và không undefined
  router.get("/api/employees", getAllEmployees);
  router.post("/api/employees", createEmployee);
  router.delete("/api/employees/:MaTaiKhoan", deleteEmployee);

  return app.use("/", router);
};

export default initEmployeeRoute;
