import axios from './axios';

export const getAllCustomersService = () => {
  return axios.get('/api/customers');
};

export const getCustomerById = (id) => {
  return axios.get(`/api/customers/${id}`);
};

export const createCustomer = (data) => {
  return axios.post('/api/customers', data);
};

export const updateCustomer = (id, data) => {
  return axios.put(`/api/customers/${id}`, data);
};

export const deleteCustomer = (id) => {
  return axios.delete(`/api/customers/${id}`);
};

// Compatibility exports: default and `customerService` named object
export const customerService = {
  getAllCustomers: getAllCustomersService,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

export default getAllCustomersService;