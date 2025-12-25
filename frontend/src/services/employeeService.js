import axios from "./axios";

const employeeService = {
  getAllEmployees: async () => {
    try {
      const res = await axios.get("/api/employees");
      return res.data || [];
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
      return [];
    }
  },

  createEmployee: async (data) => {
    try {
      const payload = {
        TenTaiKhoan: data.TenTaiKhoan,
        MatKhau: data.MatKhau,
        Role: data.Role,
      };

      const res = await axios.post("/api/employees", payload);
      return res;
    } catch (error) {
      console.error("Lỗi tạo nhân viên:", error);
      return { errCode: -1, message: "Lỗi kết nối server" };
    }
  },
  deleteEmployee: async (id) => {
    try {
      const res = await axios.delete(`/api/employees/${id}`);
      return res;
    } catch (error) {
      console.error("Lỗi xóa nhân viên:", error);
      return { errCode: -1, message: "Lỗi kết nối server" };
    }
  },
};

export default employeeService;
