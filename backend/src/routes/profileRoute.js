import express from "express";
import profileController from "../controllers/profileController.js";

let router = express.Router();

let initProfileRoutes = (app) => {
  router.get("/api/get-all-profiles", profileController.handleGetAllProfiles);
  router.post("/api/change-password", profileController.handleChangePassword);

  return app.use("/", router);
};

export default initProfileRoutes;
