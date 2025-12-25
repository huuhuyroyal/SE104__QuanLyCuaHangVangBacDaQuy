import customerController from "../controllers/customerController.js";

export default function initCustomerRoute(app) {
  app.get("/api/customers", customerController.getAllCustomers);
  app.get("/api/customers/:id", customerController.getCustomerById);
  app.post("/api/customers", customerController.createCustomer);
  app.put("/api/customers/:id", customerController.updateCustomer);
  app.delete("/api/customers/:id", customerController.deleteCustomer);
}
