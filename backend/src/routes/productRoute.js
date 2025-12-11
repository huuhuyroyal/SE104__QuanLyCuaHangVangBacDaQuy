import express from "express";
import productController from "../controllers/productController.js";

const router = express.Router();

const initProductRoute = (app) => {
  router.get("/api/products", productController.getProducts);
  router.post("/api/products/delete", productController.deleteProducts);
  router.post("/api/products/active", productController.activeProducts);
  return app.use("/", router);
};

export default initProductRoute;
