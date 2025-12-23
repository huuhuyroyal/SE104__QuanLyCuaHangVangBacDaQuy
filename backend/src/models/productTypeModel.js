import { connection } from "../config/connectDB.js";

const ProductTypeModel = {
  // Read
  getAll: async () => {
    try {
      const query = `
        SELECT l.*, d.TenDVT 
        FROM loaisanpham l
        JOIN donvitinh d ON d.MaDVT = l.MaDVT 
        ORDER BY MaLoaiSanPham ASC`;
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Create
  create: async (data) => {
    try {
      const query = `INSERT INTO loaisanpham (MaLoaiSanPham, TenLoaiSanPham, MaDVT, PhanTramLoiNhuan) 
                     VALUES (?, ?, ?, ?)`;
      const [result] = await connection.query(query, [
        data.MaLoaiSanPham, 
        data.TenLoaiSanPham, 
        data.MaDVT, 
        data.PhanTramLoiNhuan
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Update
  update: async (data) => {
    try {
      const query = `UPDATE loaisanpham 
                     SET TenLoaiSanPham = ?, MaDVT = ?, PhanTramLoiNhuan = ? 
                     WHERE MaLoaiSanPham = ?`;
      const [result] = await connection.query(query, [
        data.TenLoaiSanPham, 
        data.MaDVT, 
        data.PhanTramLoiNhuan,
        data.MaLoaiSanPham
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Delete
  delete: async (id) => {
    try {
      const query = "DELETE FROM loaisanpham WHERE MaLoaiSanPham = ?";
      const [result] = await connection.query(query, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

export default ProductTypeModel;