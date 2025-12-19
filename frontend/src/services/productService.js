import axios from "./axios";

const getAllProductsService = () => {
  return axios.get("/api/products");
};
export const getAllCategoriesService = () => {
  return axios.get("/api/categories");
};
export const deleteProductsService = (ids) => {
  return axios.post("/api/products/delete", { ids: ids });
};
export const activateProductService = (id) => {
  return axios.post("/api/products/active", { id: id });
};
export const createNewProductService = (data) => {
  return axios.post("/api/products/create", data);
};
export const updateProductService = (data) => {
  return axios.post("/api/products/update", data);
};
export default getAllProductsService;
