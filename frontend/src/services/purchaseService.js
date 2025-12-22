import axios from "./axios";

export const getPurchasesService = (q) => {
  if (q) return axios.get(`/api/purchases?q=${encodeURIComponent(q)}`);
  return axios.get("/api/purchases");
};

export const getPurchaseByIdService = (id) => {
  return axios.get(`/api/purchases/${id}`);
};

export const createPurchaseService = (data) => {
  return axios.post("/api/purchases/create", data);
};

export const updatePurchaseService = (data) => {
  return axios.post("/api/purchases/update", data);
};

export const deletePurchasesService = (ids) => {
  return axios.post("/api/purchases/delete", { ids });
};

export default getPurchasesService;
