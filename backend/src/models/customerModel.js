import { connection } from "../config/connectDB.js";

const CustomerModel = {
  getAll: async () => {
    try {
      const [rows] = await connection.execute(`SELECT MaKH, TenKH, SoDienThoai, DiaChi FROM khachhang ORDER BY TenKH`);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  getById: async (maKH) => {
    try {
      const [rows] = await connection.execute(`SELECT MaKH, TenKH, SoDienThoai, DiaChi FROM khachhang WHERE MaKH = ?`, [maKH]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },
};

export default CustomerModel;
