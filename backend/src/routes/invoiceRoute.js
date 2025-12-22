import express from "express";
import invoiceController from "../controllers/invoiceController.js";

const app = express();
const router = express.Router();
app.use(express.static("public"));

const initInvoiceRoute = (app) => {
  router.get("/api/invoices", invoiceController.getInvoices);
  router.get("/api/invoices/:id", invoiceController.getInvoiceById);
  router.post("/api/invoices/create", invoiceController.createInvoice);
  router.post("/api/invoices/update", invoiceController.updateInvoice);
  router.post("/api/invoices/delete", invoiceController.deleteInvoices);
  return app.use("/", router);
};

export default initInvoiceRoute;
