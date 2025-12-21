// backend/src/routes/unitRoute.js
import express from "express";
import { getAllUnitsService } from "../service/unitService.js";

const router = express.Router();

const initUnitRoute = (app) => {
  router.get("/api/units", async (req, res) => {
    const result = await getAllUnitsService();
    return res.status(200).json(result);
  });

  return app.use("/", router);
};

export default initUnitRoute;
