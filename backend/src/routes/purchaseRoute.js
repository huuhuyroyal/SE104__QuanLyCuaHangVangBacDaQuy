import express from "express";
import purchaseController from "../controllers/purchaseController.js";
import verifyRole from "../middleware/authMiddleware.js";

const router = express.Router();

const initPurchaseRoute = (app) => {
  router.get(
    "/api/purchases",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    purchaseController.getPurchases
  );
  router.get(
    "/api/purchases/:id",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    purchaseController.getPurchaseById
  );
  router.post(
    "/api/purchases/create",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    purchaseController.createPurchase
  );
  router.post(
    "/api/purchases/update",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    purchaseController.updatePurchase
  );
  router.post(
    "/api/purchases/delete",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin"]),
    purchaseController.deletePurchases
  );
  return app.use("/", router);
};

export default initPurchaseRoute;
