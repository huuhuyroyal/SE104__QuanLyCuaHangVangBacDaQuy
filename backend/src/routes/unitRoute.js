import express from "express";
import unitController from "../controllers/unitController.js";
import verifyRole from "../middleware/authMiddleware.js";

const app = express();
const router = express.Router();

const initUnitRoute = (app) => {
  // Lấy tất cả đơn vị tính
  router.get("/api/units", verifyRole.verifyToken, unitController.getAllUnits);

  // Tìm kiếm đơn vị tính
  router.get(
    "/api/units/search",
    verifyRole.verifyToken,
    unitController.searchUnits
  );

  // Lấy mã đơn vị tính mới
  router.get(
    "/api/units/next-code",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    unitController.getNextUnitCode
  );

  // Lấy đơn vị tính theo ID
  router.get(
    "/api/units/:id",
    verifyRole.verifyToken,
    unitController.getUnitById
  );
  // Tạo đơn vị tính mới
  router.post(
    "/api/units",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    unitController.createUnit
  );

  // Cập nhật đơn vị tính
  router.put(
    "/api/units/:id",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    unitController.updateUnit
  );

  // Xóa đơn vị tính
  router.delete(
    "/api/units/:id",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin"]),
    unitController.deleteUnit
  );

  return app.use("/", router);
};

export default initUnitRoute;
