import axios from './axios';

const axiosInstance = axios; // shared axios instance with auth interceptor

// --- STUB / TO DO: Complete implementation ---
export const customerService = {
  // Get list of customers
  getAllCustomer: async () => {
    try {
      const response = await axiosInstance.get('/khach-hang'); // Verify this endpoint matches your backend
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add new customer
  createCustomer: async (customerData) => {
    try {
      const response = await axiosInstance.post('/khach-hang', customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      const response = await axiosInstance.delete(`/khach-hang/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const ListCustomer = {
  getAllCustomer: async () => {
    const response = await axiosInstance.get('/khach-hang');
    return response.data;
  },
  createCustomer: async (data) => {
    const response = await axiosInstance.post('/khach-hang', data);
    return response.data;
  },
  deleteCustomer: async (id) => {
    const response = await axiosInstance.delete(`/khach-hang/${id}`);
    return response.data;
  }
};