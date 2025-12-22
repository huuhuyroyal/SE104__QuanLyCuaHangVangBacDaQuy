<<<<<<< HEAD
// backend/src/models/unitModel.js
import { connection } from "../config/connectDB.js";

const UnitModel = {
  getAll: async () => {
    const [rows] = await connection.query(
      "SELECT MaDVT, TenDVT FROM donvitinh"
    );
    return rows;
  },
};

export default UnitModel;
=======
import { connection } from "../config/connectDB.js";

const unitModel = {
  // Lấy tất cả đơn vị tính
  getAll: async () => {
    try {
      const [rows] = await connection.query(
        `SELECT MaDVT, TenDVT, createdAt, updatedAt FROM DONVITINH ORDER BY createdAt DESC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Lấy đơn vị tính theo ID
  getById: async (maDVT) => {
    try {
      const [rows] = await connection.query(
        `SELECT MaDVT, TenDVT, createdAt, updatedAt FROM DONVITINH WHERE MaDVT = ?`,
        [maDVT]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm đơn vị tính
  search: async (searchText) => {
    try {
      const [rows] = await connection.query(
        `SELECT MaDVT, TenDVT, createdAt, updatedAt FROM DONVITINH 
         WHERE MaDVT LIKE ? OR TenDVT LIKE ? 
         ORDER BY createdAt DESC`,
        [`%${searchText}%`, `%${searchText}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Tạo đơn vị tính mới
  create: async (maDVT, tenDVT) => {
    try {
      const [result] = await connection.query(
        `INSERT INTO DONVITINH (MaDVT, TenDVT) VALUES (?, ?)`,
        [maDVT, tenDVT]
      );
      return { MaDVT: maDVT, TenDVT: tenDVT };
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật đơn vị tính
  update: async (maDVT, tenDVT) => {
    try {
      const [result] = await connection.query(
        `UPDATE DONVITINH SET TenDVT = ? WHERE MaDVT = ?`,
        [tenDVT, maDVT]
      );
      return { affectedRows: result.affectedRows };
    } catch (error) {
      throw error;
    }
  },

  // Xóa đơn vị tính
  delete: async (maDVT) => {
    try {
      const [result] = await connection.query(
        `DELETE FROM DONVITINH WHERE MaDVT = ?`,
        [maDVT]
      );
      return { affectedRows: result.affectedRows };
    } catch (error) {
      throw error;
    }
  },
};

export default unitModel;
>>>>>>> ad18d8c40aa5d7681666ad87b3174ae70b390e1c
