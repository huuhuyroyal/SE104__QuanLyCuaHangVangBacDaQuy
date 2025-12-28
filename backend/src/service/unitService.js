import unitModel from "../models/unitModel.js";
import { connection } from "../config/connectDB.js";

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

  // Sinh mã đơn vị tính tiếp theo với tiền tố DVT
  getNextUnitCode: async () => {
    const prefix = "DVT";
    try {
      // Lấy mã có số thứ tự lớn nhất hiện có
      const [rows] = await connection.query(
        `SELECT MaDVT FROM DONVITINH
         WHERE MaDVT LIKE '${prefix}%'
         ORDER BY CAST(SUBSTRING(MaDVT, ${prefix.length + 1}) AS UNSIGNED) DESC
         LIMIT 1`
      );

      const current = rows?.[0]?.MaDVT || null;
      const numericPart = current
        ? parseInt(current.slice(prefix.length), 10)
        : 0;
      const nextNumber = Number.isNaN(numericPart) ? 1 : numericPart + 1;

      // Giữ tối thiểu 2 chữ số, hoặc chiều dài chữ số lớn nhất đã có
      const padding = Math.max(2, (current || `${prefix}00`).length - prefix.length);
      const code = `${prefix}${String(nextNumber).padStart(padding, "0")}`;

      return { errCode: 0, message: "Lấy mã mới thành công", code };
    } catch (error) {
      console.error("Error in getNextUnitCode:", error);
      return {
        errCode: 1,
        message: "Lỗi sinh mã đơn vị tính",
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
