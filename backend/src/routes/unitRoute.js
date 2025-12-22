<<<<<<< HEAD
// backend/src/routes/unitRoute.js
import express from "express";
import { getAllUnitsService } from "../service/unitService.js";

const router = express.Router();

const initUnitRoute = (app) => {
  router.get("/api/units", async (req, res) => {
    const result = await getAllUnitsService();
    return res.status(200).json(result);
  });
=======
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
>>>>>>> ad18d8c40aa5d7681666ad87b3174ae70b390e1c

  return app.use("/", router);
};

export default initUnitRoute;
