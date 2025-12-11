import axios from "axios";

// Tạo instance với config mặc định
const instance = axios.create({
  baseURL: "http://localhost:8080",
});
instance.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default instance;
