import axios from "./axios";

export const getSuppliersService = () => {
  return axios.get("/api/suppliers");
};

export default getSuppliersService;
