import express from "express";
import dashboardController from "../controllers/dashboardController.js";

const router = express.Router();

const initDashboardRoute = (app) => {
  router.get("/api/dashboard/stats", dashboardController.getStats);
  router.get("/api/dashboard/revenue", dashboardController.getRevenueAnalytics);
  router.get(
    "/api/dashboard/category",
    dashboardController.getCategoryAnalytics
  );
  router.get("/api/dashboard/orders", dashboardController.getOrderAnalytics);

  return app.use("/", router);
};

export default initDashboardRoute;
