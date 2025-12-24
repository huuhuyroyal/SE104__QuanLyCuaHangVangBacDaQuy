import express from "express";
import invoiceController from "../controllers/invoiceController.js";
import verifyRole from "../middleware/authMiddleware.js";

const app = express();
const router = express.Router();
app.use(express.static("public"));

const initInvoiceRoute = (app) => {
  router.get(
    "/api/invoices",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "seller", "warehouse"]),
    invoiceController.getInvoices
  );
  router.get(
    "/api/invoices/:id",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin", "seller", "warehouse"]),
    invoiceController.getInvoiceById
  );
  router.post(
    "/api/invoices/create",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["seller"]),
    invoiceController.createInvoice
  );
  router.post(
    "/api/invoices/update",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["seller"]),
    invoiceController.updateInvoice
  );
  router.post(
    "/api/invoices/delete",
    verifyRole.verifyToken,
    verifyRole.checkPermission(["admin"]),
    invoiceController.deleteInvoices
  );
  return app.use("/", router);
};

export default initInvoiceRoute;
