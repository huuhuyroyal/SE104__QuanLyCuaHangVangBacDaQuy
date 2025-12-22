import express from "express";
import unitController from "../controllers/unitController.js";

const app = express();
const router = express.Router();

const initUnitRoute = (app) => {
  // Lấy tất cả đơn vị tính
  router.get("/api/units", unitController.getAllUnits);

  // Tìm kiếm đơn vị tính
  router.get("/api/units/search", unitController.searchUnits);

  // Lấy đơn vị tính theo ID
  router.get("/api/units/:id", unitController.getUnitById);

  // Tạo đơn vị tính mới
  router.post("/api/units", unitController.createUnit);

  // Cập nhật đơn vị tính
  router.put("/api/units/:id", unitController.updateUnit);

  // Xóa đơn vị tính
  router.delete("/api/units/:id", unitController.deleteUnit);

  return app.use("/", router);
};

export default initUnitRoute;
