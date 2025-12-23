import express from "express";
import supplierController from "../controllers/supplierController.js";

const router = express.Router();

const initSupplierRoute = (app) => {
  router.get("/api/suppliers", supplierController.getSuppliers);
  return app.use("/", router);
};

export default initSupplierRoute;
