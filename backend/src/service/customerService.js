import CustomerModel from "../models/customerModel.js";

const customerService = {
  getAllCustomers: async () => {
    try {
      const data = await CustomerModel.getAll();
      return { errCode: 0, message: "Lấy danh sách khách hàng thành công", data };
    } catch (error) {
      console.error("Error in getAllCustomers:", error);
      return { errCode: 1, message: "Lỗi lấy danh sách khách hàng", error: error.message };
    }
  },
  getCustomerById: async (maKH) => {
    try {
      const data = await CustomerModel.getById(maKH);
      if (!data) return { errCode: 1, message: "Không tìm thấy khách hàng" };
      return { errCode: 0, message: "OK", data };
    } catch (error) {
      console.error("Error in getCustomerById:", error);
      return { errCode: 1, message: "Lỗi lấy khách hàng", error: error.message };
    }
  },
};

export default customerService;
