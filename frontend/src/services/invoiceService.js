import axios from "./axios";

export const getInvoicesService = (q) => {
  const url = q ? `/api/invoices?q=${encodeURIComponent(q)}` : "/api/invoices";
  return axios.get(url);
};

export const getInvoiceByIdService = (id) => {
  return axios.get(`/api/invoices/${id}`);
};

export const createInvoiceService = (data) => {
  return axios.post("/api/invoices/create", data);
};

export const deleteInvoicesService = (ids) => {
  return axios.post("/api/invoices/delete", { ids });
};

export default getInvoicesService;
