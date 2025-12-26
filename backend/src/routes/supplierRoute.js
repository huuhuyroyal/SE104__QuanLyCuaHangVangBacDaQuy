import express from "express";
import supplierController from "../controllers/supplierController.js";
import verifyRole from "../middleware/authMiddleware.js";

const router = express.Router();

const initSupplierRoute = (app) => {
  router.get(
    "/api/suppliers",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    supplierController.getSuppliers
  );
  router.get(
    "/api/suppliers/search",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    supplierController.searchSuppliers
  );
  router.get(
    "/api/suppliers/:id",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    supplierController.getSupplierById
  );
  router.post(
    "/api/suppliers",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    supplierController.createSupplier
  );
  router.put(
    "/api/suppliers/:id",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    supplierController.updateSupplier
  );
  router.delete(
    "/api/suppliers/:id",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    supplierController.deleteSupplier
  );
  return app.use("/", router);
};

export default initSupplierRoute;
