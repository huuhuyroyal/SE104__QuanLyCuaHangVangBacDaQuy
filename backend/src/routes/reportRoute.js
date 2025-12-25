import express from "express";
import ReportController from "../controllers/reportController.js";
import verifyRole from "../middleware/authMiddleware.js";

const router = express.Router();

const initReportRoute = (app) => {
  router.get(
    "/api/report",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    ReportController.getReport
  );

  return app.use("/", router);
};
export default initReportRoute;
