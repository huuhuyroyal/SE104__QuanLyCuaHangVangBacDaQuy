import axios from "./axios";

export const getAllCustomersService = () => {
  return axios.get("/api/customers");
};

export const getCustomerByIdService = (id) => {
  return axios.get(`/api/customers/${id}`);
};

export default getAllCustomersService;
