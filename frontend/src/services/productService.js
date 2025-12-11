import axios from "./axios";

const getAllProductsService = () => {
  return axios.get("/api/products");
};
export const deleteProductsService = (ids) => {
  return axios.post("/api/products/delete", { ids: ids });
};
export const activateProductService = (id) => {
  return axios.post("/api/products/active", { id: id });
};
export default getAllProductsService;
