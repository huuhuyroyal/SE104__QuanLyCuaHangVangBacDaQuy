import express from "express";
import ReportController from "../controllers/reportController.js";

const router = express.Router();

const initReportRoute = (app) => {
  router.get("/api/report", ReportController.getReport);

  return app.use("/", router);
};
export default initReportRoute;
