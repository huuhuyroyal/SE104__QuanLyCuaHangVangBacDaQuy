import express from "express";
import path from "path";
import productController, { upload } from "../controllers/productController.js";
import verifyRole from "../middleware/authMiddleware.js";

const app = express();
const router = express.Router();
app.use(express.static("public"));

const initProductRoute = (app) => {
  router.get("/api/products", productController.getProducts);
  router.get("/api/categories", productController.getAllCategories);
  router.post(
    "/api/products/delete",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    productController.deleteProducts
  );
  router.post(
    "/api/products/active",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    productController.activeProducts
  );
  router.post(
    "/api/products/create",
    upload.single("HinhAnh"),
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    productController.createNewProducts
  );
  router.post(
    "/api/products/update",
    upload.single("HinhAnh"),
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "warehouse"]),
    productController.updateProducts
  );
  return app.use("/", router);
};

export default initProductRoute;
