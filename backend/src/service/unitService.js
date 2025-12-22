<<<<<<< HEAD
// backend/src/service/unitService.js
import UnitModel from "../models/unitModel.js";

export const getAllUnitsService = async () => {
  try {
    const data = await UnitModel.getAll();
    return { errCode: 0, data };
  } catch (error) {
    return { errCode: 1, data: [] };
  }
};
=======
import unitModel from "../models/unitModel.js";

const unitService = {
  // Lấy tất cả đơn vị tính
  getAllUnits: async () => {
    try {
      const units = await unitModel.getAll();
      return {
        errCode: 0,
        message: "Lấy danh sách đơn vị tính thành công",
        data: units,
      };
    } catch (error) {
      console.error("Error in getAllUnits:", error);
      return {
        errCode: 1,
        message: "Lỗi lấy danh sách đơn vị tính",
        error: error.message,
      };
    }
  },

  // Lấy đơn vị tính theo ID
  getUnitById: async (maDVT) => {
    try {
      const unit = await unitModel.getById(maDVT);
      if (!unit) {
        return {
          errCode: 1,
          message: "Không tìm thấy đơn vị tính",
        };
      }
      return {
        errCode: 0,
        message: "Lấy thông tin đơn vị tính thành công",
        data: unit,
      };
    } catch (error) {
      console.error("Error in getUnitById:", error);
      return {
        errCode: 1,
        message: "Lỗi lấy thông tin đơn vị tính",
        error: error.message,
      };
    }
  },

  // Tìm kiếm đơn vị tính
  searchUnits: async (searchText) => {
    try {
      if (!searchText || searchText.trim() === "") {
        return await unitService.getAllUnits();
      }
      const units = await unitModel.search(searchText);
      return {
        errCode: 0,
        message: "Tìm kiếm thành công",
        data: units,
      };
    } catch (error) {
      console.error("Error in searchUnits:", error);
      return {
        errCode: 1,
        message: "Lỗi tìm kiếm đơn vị tính",
        error: error.message,
      };
    }
  },

  // Tạo đơn vị tính mới
  createUnit: async (maDVT, tenDVT) => {
    try {
      // Kiểm tra input
      if (!maDVT || !tenDVT) {
        return {
          errCode: 1,
          message: "Mã và tên đơn vị tính không được để trống",
        };
      }

      try {
        const newUnit = await unitModel.create(maDVT, tenDVT);
        return {
          errCode: 0,
          message: "Tạo đơn vị tính thành công",
          data: newUnit,
        };
      } catch (createError) {
        // Kiểm tra nếu là lỗi duplicate key
        if (
          createError.code === "ER_DUP_ENTRY" ||
          createError.message.includes("Duplicate entry")
        ) {
          return {
            errCode: 1,
            message: "Mã đơn vị tính đã tồn tại",
          };
        }
        throw createError;
      }
    } catch (error) {
      console.error("Error in createUnit:", error);
      return {
        errCode: 1,
        message: "Lỗi tạo đơn vị tính",
        error: error.message,
      };
    }
  },

  // Cập nhật đơn vị tính
  updateUnit: async (maDVT, tenDVT) => {
    try {
      // Kiểm tra input
      if (!maDVT || !tenDVT) {
        return {
          errCode: 1,
          message: "Mã và tên đơn vị tính không được để trống",
        };
      }

      // Kiểm tra xem DVT có tồn tại không
      const existingUnit = await unitModel.getById(maDVT);
      if (!existingUnit) {
        return {
          errCode: 1,
          message: "Không tìm thấy đơn vị tính",
        };
      }

      const result = await unitModel.update(maDVT, tenDVT);
      if (result.affectedRows === 0) {
        return {
          errCode: 1,
          message: "Cập nhật đơn vị tính không thành công",
        };
      }

      return {
        errCode: 0,
        message: "Cập nhật đơn vị tính thành công",
        data: { MaDVT: maDVT, TenDVT: tenDVT },
      };
    } catch (error) {
      console.error("Error in updateUnit:", error);
      return {
        errCode: 1,
        message: "Lỗi cập nhật đơn vị tính",
        error: error.message,
      };
    }
  },

  // Xóa đơn vị tính
  deleteUnit: async (maDVT) => {
    try {
      // Kiểm tra xem DVT có tồn tại không
      const existingUnit = await unitModel.getById(maDVT);
      if (!existingUnit) {
        return {
          errCode: 1,
          message: "Không tìm thấy đơn vị tính",
        };
      }

      const result = await unitModel.delete(maDVT);
      if (result.affectedRows === 0) {
        return {
          errCode: 1,
          message: "Xóa đơn vị tính không thành công",
        };
      }

      return {
        errCode: 0,
        message: "Xóa đơn vị tính thành công",
      };
    } catch (error) {
      console.error("Error in deleteUnit:", error);
      return {
        errCode: 1,
        message: "Lỗi xóa đơn vị tính",
        error: error.message,
      };
    }
  },
};

export default unitService;
>>>>>>> ad18d8c40aa5d7681666ad87b3174ae70b390e1c
