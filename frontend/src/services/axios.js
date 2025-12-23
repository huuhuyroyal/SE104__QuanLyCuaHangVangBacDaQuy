import axios from "axios";
import { getAccessToken } from "../utils/auth";

// Create axios instance with default config
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// Attach access token to every request if available
instance.interceptors.request.use(
  function (config) {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default instance;
