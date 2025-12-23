import express from "express";
import serviceTypeController from "../controllers/serviceTypeController.js";

const router = express.Router();

const initServiceTypeRoute = (app) => {
  router.get("/api/service-types", serviceTypeController.getAll);
  router.post("/api/service-types/create", serviceTypeController.create);
  router.post("/api/service-types/update", serviceTypeController.update);
  router.post("/api/service-types/delete", serviceTypeController.delete);

  return app.use("/", router);
};

export default initServiceTypeRoute;