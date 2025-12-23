import customerController from "../controllers/customerController.js";

export default function initCustomerRoute(app) {
  app.get("/api/customers", customerController.getAllCustomers);
  app.get("/api/customers/:id", customerController.getCustomerById);
}
