import axios from "./axios";

export const getAllServiceTypesService = () => {
  return axios.get("/api/service-types");
};

export const createServiceTypeService = (data) => {
  return axios.post("/api/service-types/create", data);
};

export const updateServiceTypeService = (data) => {
  return axios.post("/api/service-types/update", data);
};

export const deleteServiceTypeService = (id) => {
  return axios.post("/api/service-types/delete", { id });
};