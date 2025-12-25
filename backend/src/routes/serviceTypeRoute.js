import express from "express";
import serviceTypeController from "../controllers/serviceTypeController.js";
import verifyRole from "../middleware/authMiddleware.js";

const router = express.Router();

const initServiceTypeRoute = (app) => {
  router.get(
    "/api/service-types",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "seller"]),
    serviceTypeController.getAll
  );
  router.post(
    "/api/service-types/create",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin"]),
    serviceTypeController.create
  );
  router.post(
    "/api/service-types/update",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin"]),
    serviceTypeController.update
  );
  router.post(
    "/api/service-types/delete",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin"]),
    serviceTypeController.delete
  );
  return app.use("/", router);
};

export default initServiceTypeRoute;
