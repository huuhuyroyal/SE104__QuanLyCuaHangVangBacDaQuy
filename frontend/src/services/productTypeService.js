import axios from "./axios";

export const getAllProductTypesService = () => {
  return axios.get("/api/product-types");
};

export const createProductTypeService = (data) => {
  return axios.post("/api/product-types/create", data);
};

export const updateProductTypeService = (data) => {
  return axios.post("/api/product-types/update", data);
};

export const deleteProductTypeService = (id) => {
  return axios.post("/api/product-types/delete", { id });
};