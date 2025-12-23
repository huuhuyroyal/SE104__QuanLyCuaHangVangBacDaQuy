import express from "express";
import purchaseController from "../controllers/purchaseController.js";

const router = express.Router();

const initPurchaseRoute = (app) => {
  router.get("/api/purchases", purchaseController.getPurchases);
  router.get("/api/purchases/:id", purchaseController.getPurchaseById);
  router.post("/api/purchases/create", purchaseController.createPurchase);
  router.post("/api/purchases/update", purchaseController.updatePurchase);
  router.post("/api/purchases/delete", purchaseController.deletePurchases);
  return app.use("/", router);
};

export default initPurchaseRoute;
