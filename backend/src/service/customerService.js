import CustomerModel from "../models/customerModel.js";

const customerService = {
  getAllCustomers: async () => {
    try {
      const data = await CustomerModel.getAll();
      return {
        errCode: 0,
        message: "Lấy danh sách khách hàng thành công",
        data,
      };
    } catch (error) {
      console.error("Error in getAllCustomers:", error);
      return {
        errCode: 1,
        message: "Lỗi lấy danh sách khách hàng",
        error: error.message,
      };
    }
  },
  getCustomerById: async (maKH) => {
    try {
      const customer = await CustomerModel.getById(maKH);
      if (!customer) {
        return { errCode: 1, message: "Không tìm thấy khách hàng" };
      }
      const orders = await CustomerModel.getOrders(maKH);
      const totalSpending = orders.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
      const totalOrders = orders.length;
      const finalData = {
        ...customer,          
        orderHistory: orders, 
        TongChiTieu: totalSpending,
        SoLuongDonHang: totalOrders
      };

      return { errCode: 0, message: "OK", data: finalData };
    } catch (error) {
      console.error("Error in getCustomerById:", error);
      return { errCode: 1, message: "Lỗi lấy chi tiết khách hàng", error: error.message };
    }
  },
  createCustomer: async (data) => {
    try {
      if (!data.MaKH || !data.TenKH || !data.SoDienThoai) {
        return {
          errCode: 1,
          message: "Thiếu thông tin bắt buộc: Mã KH, Tên, hoặc SĐT",
        };
      }
      await CustomerModel.create(data);
      return { errCode: 0, message: "Tạo thành công" };
    } catch (e) {
      if (e.code === "ER_DUP_ENTRY") {
        return { errCode: 1, message: "Mã khách hàng này đã tồn tại!" };
      }
      return { errCode: 1, message: "Lỗi khi tạo: " + e.message };
    }
  },

  updateCustomer: async (id, data) => {
    try {
      await CustomerModel.update(id, data);
      return { errCode: 0, message: "Cập nhật thành công" };
    } catch (e) {
      return { errCode: 1, message: "Lỗi cập nhật" };
    }
  },

  deleteCustomer: async (id) => {
    try {
      await CustomerModel.delete(id);
      return { errCode: 0, message: "Xóa thành công" };
    } catch (e) {
      return { errCode: 1, message: "Lỗi xóa" };
    }
  },
};

export default customerService;
