import express from "express";
import { getProducts } from "../controllers/productController.js";

const router = express.Router();

const initProductRoute = (app) => {
  router.get("/api/products", getProducts);

  return app.use("/", router);
};

export default initProductRoute;
