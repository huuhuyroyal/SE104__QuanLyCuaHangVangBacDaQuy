import { connection } from "../config/connectDB.js";

const ProductModel = {
  // Hàm lấy danh sách sản phẩm
  getAllProducts: async () => {
    try {
      const query = `
        SELECT 
          s.MaSanPham,
          s.TenSanPham,
          s.HinhAnh,
          s.MaLoaiSanPham,
          s.isDelete,
          s.DonGiaMuaVao, 
          (
            COALESCE((SELECT SUM(SoLuongMua) FROM chitietmuahang WHERE MaSanPham = s.MaSanPham), 0) - 
            COALESCE((SELECT SUM(SoLuongBan) FROM chitietbanhang WHERE MaSanPham = s.MaSanPham), 0)
          ) AS SoLuongTon,
          CASE 
            WHEN s.DonGiaMuaVao > 0 THEN 
               ROUND(s.DonGiaMuaVao * (1 + (COALESCE(l.PhanTramLoiNhuan, 0) / 100)))
            ELSE s.DonGiaBanRa 
          END AS DonGiaBanRa,
          l.TenLoaiSanPham,
          l.PhanTramLoiNhuan

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

  // Chuyển trạng thái
  statusChange: async (ids) => {
    if (!ids || ids.length === 0) return;
    const placeholders = ids.map(() => "?").join(",");
    const query = `UPDATE sanpham SET isDelete = 1 WHERE MaSanPham IN (${placeholders})`;
    const [result] = await connection.query(query, ids);
    return result;
  },

  // Xóa vĩnh viễn
  deleteProduct: async (ids) => {
    if (!ids || ids.length === 0) return;
    const placeholders = ids.map(() => "?").join(",");
    const query = `DELETE FROM sanpham WHERE MaSanPham IN (${placeholders})`;
    const [result] = await connection.query(query, ids);
    return result;
  },
  activeProduct: async (id) => {
    try {
      // 1. Kiểm tra ids có phải là mảng và có dữ liệu không
      const query = "UPDATE sanpham SET isDelete = 0 WHERE MaSanPham = ?";
      const [result] = await connection.query(query, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  // THÊM SẢN PHẨM
  createProduct: async (data) => {
    try {
      // Chỉ nhận: TenSanPham, MaLoaiSanPham, HinhAnh
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
