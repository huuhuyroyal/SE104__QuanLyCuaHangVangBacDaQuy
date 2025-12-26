import express from "express";
import * as controller from "../controllers/serviceTicketController.js";
import verifyRole from "../middleware/authMiddleware.js";

const router = express.Router();

const initServiceTicketRoute = (app) => {
  router.get(
    "/api/service-tickets",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "seller"]),
    controller.getAll
  );
  router.get(
    "/api/service-tickets/:id",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "seller"]),
    controller.getById
  );

  router.post(
    "/api/service-tickets/create",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["seller"]),
    controller.create
  );

  router.post(
    "/api/service-tickets/status",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "seller"]),
    controller.updateStatus
  );

  router.post(
    "/api/service-tickets/delete",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin"]),
    controller.deleteTickets
  );
  return app.use("/", router);
};

export default initServiceTicketRoute;
