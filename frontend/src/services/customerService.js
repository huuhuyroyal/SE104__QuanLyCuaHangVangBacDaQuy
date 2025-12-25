import axios from "./axios";
export const getAllCustomersService = () => {
  return axios.get("/api/customers");
};

export const getCustomerByIdService = (id) => {
  return axios.get(`/api/customers/${id}`);
};

export const createCustomerService = (data) => {
  return axios.post("/api/customers", data);
};

export const updateCustomerService = (id, data) => {
  return axios.put(`/api/customers/${id}`, data);
};

export const deleteCustomerService = (id) => {
  return axios.delete(`/api/customers/${id}`);
};

const customerService = {
  getAllCustomers: getAllCustomersService,
  getCustomerById: getCustomerByIdService,
  createCustomer: createCustomerService,
  updateCustomer: updateCustomerService,
  deleteCustomer: deleteCustomerService,
};

export default customerService;
