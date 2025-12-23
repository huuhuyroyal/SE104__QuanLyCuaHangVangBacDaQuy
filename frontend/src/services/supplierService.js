import axios from "./axios";

const supplierService = {
  getSuppliers: async () => axios.get("/api/suppliers"),

  searchSuppliers: async (keyword) =>
    axios.get("/api/suppliers/search", { params: { q: keyword } }),

  getSupplierById: async (id) => axios.get(`/api/suppliers/${id}`),

  createSupplier: async (payload) => axios.post("/api/suppliers", payload),

  updateSupplier: async (id, payload) =>
    axios.put(`/api/suppliers/${id}`, payload),

  deleteSupplier: async (id) => axios.delete(`/api/suppliers/${id}`),
};

export default supplierService;
