import { connection } from "../config/connectDB.js";

const ProductModel = {
  // Get all products
  getAllProducts: async () => {
    try {
      const query = `
        SELECT s.*, l.TenLoaiSanPham 
        FROM sanpham s 
        LEFT JOIN loaisanpham l ON s.MaLoaiSanPham = l.MaLoaiSanPham
        ORDER BY s.MaSanPham DESC
      `;
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  getAllCategories: async () => {
    try {
      const query = "SELECT * FROM loaisanpham";
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  getProductsByIds: async (ids) => {
    if (!ids || ids.length === 0) return [];
    const placeholders = ids.map(() => "?").join(",");
    const query = `SELECT MaSanPham, isDelete, HinhAnh FROM sanpham WHERE MaSanPham IN (${placeholders})`;
    const [rows] = await connection.query(query, ids);
    return rows;
  },

  // Change status (mark as deleted)
  statusChange: async (ids) => {
    if (!ids || ids.length === 0) return;
    const placeholders = ids.map(() => "?").join(",");
    const query = `UPDATE sanpham SET isDelete = 1 WHERE MaSanPham IN (${placeholders})`;
    const [result] = await connection.query(query, ids);
    return result;
  },

  // Permanent delete
  deleteProduct: async (ids) => {
    if (!ids || ids.length === 0) return;
    const placeholders = ids.map(() => "?").join(",");
    const query = `DELETE FROM sanpham WHERE MaSanPham IN (${placeholders})`;
    const [result] = await connection.query(query, ids);
    return result;
  },
  activeProduct: async (id) => {
    try {
      // 1. Check that id is present
      const query = "UPDATE sanpham SET isDelete = 0 WHERE MaSanPham = ?";
      const [result] = await connection.query(query, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  // CREATE PRODUCT
  createProduct: async (data) => {
    try {
      // Only accept: TenSanPham, MaLoaiSanPham, HinhAnh
      const query = `
        INSERT INTO sanpham (MaSanPham, TenSanPham, MaLoaiSanPham, SoLuongTon, DonGiaBanRa, HinhAnh, isDelete)
        VALUES (?, ?, ?, 0, 0, ?, 1) 
      `;

      const values = [
        data.MaSanPham,
        data.TenSanPham,
        data.MaLoaiSanPham,
        data.HinhAnh || "",
      ];

      const [result] = await connection.query(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateProduct: async (data) => {
    try {
      const query = `
      UPDATE sanpham 
      SET TenSanPham = ?, MaLoaiSanPham = ?, HinhAnh = ?
      WHERE MaSanPham = ?
    `;
      const values = [
        data.TenSanPham,
        data.MaLoaiSanPham,
        data.HinhAnh,
        data.MaSanPham,
      ];
      const [result] = await connection.query(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default ProductModel;
