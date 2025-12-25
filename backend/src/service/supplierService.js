import SupplierModel from "../models/supplierModel.js";

const supplierService = {
  getAllSuppliers: async () => {
    try {
      const data = await SupplierModel.getAllSuppliers();
      return {
        errCode: 0,
        message: "Lấy danh sách nhà cung cấp thành công",
        data,
      };
    } catch (error) {
      console.error("Lỗi lấy danh sách nhà cung cấp:", error);
      return { errCode: 1, message: "Lỗi Server", data: [] };
    }
  },

  getSupplierById: async (maNCC) => {
    try {
      const supplier = await SupplierModel.getSupplierById(maNCC);
      if (!supplier) {
        return { errCode: 1, message: "Không tìm thấy nhà cung cấp" };
      }
      return { errCode: 0, message: "OK", data: supplier };
    } catch (error) {
      console.error("Lỗi lấy thông tin nhà cung cấp:", error);
      return { errCode: 1, message: "Lỗi Server", data: [] };
    }
  },

  searchSuppliers: async (keyword) => {
    try {
      if (!keyword || !keyword.trim()) {
        return await supplierService.getAllSuppliers();
      }

      const data = await SupplierModel.searchSuppliers(keyword.trim());
      return { errCode: 0, message: "Tìm kiếm thành công", data };
    } catch (error) {
      console.error("Lỗi tìm kiếm nhà cung cấp:", error);
      return { errCode: 1, message: "Lỗi Server", data: [] };
    }
  },

  createSupplier: async ({ maNCC, tenNCC, diaChi, soDienThoai }) => {
    try {
      if (!maNCC || !tenNCC) {
        return {
          errCode: 1,
          message: "Mã và tên nhà cung cấp không được để trống",
        };
      }

      try {
        await SupplierModel.createSupplier({
          maNCC,
          tenNCC,
          diaChi,
          soDienThoai,
        });
        return { errCode: 0, message: "Thêm nhà cung cấp thành công" };
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY" || err.message.includes("Duplicate")) {
          return { errCode: 1, message: "Mã nhà cung cấp đã tồn tại" };
        }
        throw err;
      }
    } catch (error) {
      console.error("Lỗi tạo nhà cung cấp:", error);
      return { errCode: 1, message: "Lỗi Server" };
    }
  },

  updateSupplier: async ({ maNCC, tenNCC, diaChi, soDienThoai }) => {
    try {
      if (!maNCC || !tenNCC) {
        return {
          errCode: 1,
          message: "Mã và tên nhà cung cấp không được để trống",
        };
      }

      const existing = await SupplierModel.getSupplierById(maNCC);
      if (!existing) {
        return { errCode: 1, message: "Không tìm thấy nhà cung cấp" };
      }

      const result = await SupplierModel.updateSupplier({
        maNCC,
        tenNCC,
        diaChi,
        soDienThoai,
      });
      if (!result.affectedRows) {
        return {
          errCode: 1,
          message: "Cập nhật nhà cung cấp không thành công",
        };
      }
      return { errCode: 0, message: "Cập nhật nhà cung cấp thành công" };
    } catch (error) {
      console.error("Lỗi cập nhật nhà cung cấp:", error);
      return { errCode: 1, message: "Lỗi Server" };
    }
  },

  deleteSupplier: async (maNCC) => {
    try {
      const existing = await SupplierModel.getSupplierById(maNCC);
      if (!existing) {
        return { errCode: 1, message: "Không tìm thấy nhà cung cấp" };
      }

      const result = await SupplierModel.deleteSupplier(maNCC);
      if (!result.affectedRows) {
        return { errCode: 1, message: "Xóa nhà cung cấp không thành công" };
      }

      return { errCode: 0, message: "Xóa nhà cung cấp thành công" };
    } catch (error) {
      console.error("Lỗi xóa nhà cung cấp:", error);
      return { errCode: 1, message: "Lỗi Server" };
    }
  },
};

export default supplierService;
