import express from "express";
import * as controller from "../controllers/serviceTicketController.js";

const router = express.Router();

const initServiceTicketRoute = (app) => {
  router.get("/api/service-tickets", controller.getAll);
  router.get("/api/service-tickets/:id", controller.getById);
  router.post("/api/service-tickets/create", controller.create);
  router.post("/api/service-tickets/status", controller.updateStatus);
  router.post("/api/service-tickets/delete", controller.deleteTickets);

  return app.use("/", router);
};

export default initServiceTicketRoute;