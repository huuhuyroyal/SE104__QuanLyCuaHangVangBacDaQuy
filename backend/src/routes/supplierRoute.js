import express from "express";
import supplierController from "../controllers/supplierController.js";

const router = express.Router();

const initSupplierRoute = (app) => {
  router.get("/api/suppliers", supplierController.getSuppliers);
  router.get("/api/suppliers/search", supplierController.searchSuppliers);
  router.get("/api/suppliers/:id", supplierController.getSupplierById);
  router.post("/api/suppliers", supplierController.createSupplier);
  router.put("/api/suppliers/:id", supplierController.updateSupplier);
  router.delete("/api/suppliers/:id", supplierController.deleteSupplier);
  return app.use("/", router);
};

export default initSupplierRoute;
