import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

const initUserRoute = (app) => {
  router.post("/api/login", authController.handleLogin);

  return app.use("/", router);
};

export default initUserRoute;
