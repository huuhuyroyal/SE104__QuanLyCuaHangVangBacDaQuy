// ...existing code...
import express from "express";
import verifyRole from "../middleware/authMiddleware.js";

// customerController is authored with CommonJS (module.exports). Use dynamic import
// so the runtime provides the CommonJS export on the `default` property.
const customerControllerModule = await import("../controllers/customerController.js");
const customerController = customerControllerModule.default || customerControllerModule;

const router = express.Router();

const initCustomerRoute = (app) => {
  // Lấy danh sách toàn bộ khách hàng
  router.get("/api/customers", verifyRole.verifyToken, customerController.getAllCustomers);

  // Lấy chi tiết một khách hàng theo MaKH
  router.get("/api/customers/:id", verifyRole.verifyToken, customerController.getCustomerById);

  // Thêm khách hàng mới
  router.post("/api/customers", verifyRole.verifyToken, verifyRole.checkPermission(["admin", "seller"]), customerController.createCustomer);

  // Cập nhật thông tin khách hàng theo MaKH
  router.put("/api/customers/:id", verifyRole.verifyToken, verifyRole.checkPermission(["admin", "seller"]), customerController.updateCustomer);

  // Xóa khách hàng
  router.delete("/api/customers/:id", verifyRole.verifyToken, verifyRole.checkPermission(["admin"]), customerController.deleteCustomer);

  return app.use("/", router);
};

export default initCustomerRoute;
// ...existing code...