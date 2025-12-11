import { connection } from "../config/connectDB.js";

const ProductModel = {
  // Hàm lấy danh sách cũ của bạn
  getAllProducts: async () => {
    try {
      const query = "SELECT * FROM sanpham";
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  deleteProducts: async (ids) => {
    try {
      // 1. Kiểm tra ids có phải là mảng và có dữ liệu không
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("Danh sách ID không hợp lệ");
      }
      const placeholders = ids.map(() => "?").join(",");
      const query = `UPDATE sanpham SET isDelete = 1 WHERE MaSanPham IN (${placeholders})`;
      const [result] = await connection.query(query, ids);
      return result;
    } catch (error) {
      console.log("Lỗi SQL chi tiết:", error);
      throw error;
    }
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
};

export default ProductModel;
