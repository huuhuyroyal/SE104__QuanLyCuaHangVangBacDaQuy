import { connection } from "../config/connectDB.js";

const SupplierModel = {
  getAllSuppliers: async () => {
    const [rows] = await connection.query(
      `SELECT MaNCC, TenNCC, DiaChi, SoDienThoai FROM NHACUNGCAP ORDER BY TenNCC`
    );
    return rows;
  },

  getSupplierById: async (maNCC) => {
    const [rows] = await connection.query(
      `SELECT MaNCC, TenNCC, DiaChi, SoDienThoai FROM NHACUNGCAP WHERE MaNCC = ?`,
      [maNCC]
    );
    return rows[0] || null;
  },

  searchSuppliers: async (keyword) => {
    const likeKeyword = `%${keyword}%`;
    const [rows] = await connection.query(
      `SELECT MaNCC, TenNCC, DiaChi, SoDienThoai FROM NHACUNGCAP 
       WHERE MaNCC LIKE ? OR TenNCC LIKE ? OR DiaChi LIKE ? OR SoDienThoai LIKE ?
       ORDER BY TenNCC`,
      [likeKeyword, likeKeyword, likeKeyword, likeKeyword]
    );
    return rows;
  },

  createSupplier: async ({ maNCC, tenNCC, diaChi, soDienThoai }) => {
    const [result] = await connection.query(
      `INSERT INTO NHACUNGCAP (MaNCC, TenNCC, DiaChi, SoDienThoai) VALUES (?, ?, ?, ?)`,
      [maNCC, tenNCC, diaChi, soDienThoai]
    );
    return { affectedRows: result.affectedRows };
  },

  updateSupplier: async ({ maNCC, tenNCC, diaChi, soDienThoai }) => {
    const [result] = await connection.query(
      `UPDATE NHACUNGCAP SET TenNCC = ?, DiaChi = ?, SoDienThoai = ? WHERE MaNCC = ?`,
      [tenNCC, diaChi, soDienThoai, maNCC]
    );
    return { affectedRows: result.affectedRows };
  },

  deleteSupplier: async (maNCC) => {
    const [result] = await connection.query(
      `DELETE FROM NHACUNGCAP WHERE MaNCC = ?`,
      [maNCC]
    );
    return { affectedRows: result.affectedRows };
  },
};

export default SupplierModel;
