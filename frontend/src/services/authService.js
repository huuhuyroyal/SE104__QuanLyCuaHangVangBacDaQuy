import axios from "./axios";

const handleLoginApi = (TenTaiKhoan, MatKhau) => {
  return axios.post("/api/login", { TenTaiKhoan, MatKhau });
};

export { handleLoginApi };
