import { connection } from "../config/connectDB.js";

const CustomerModel = {
  getAll: async () => {
    try {
      const [rows] = await connection.execute(
        `SELECT MaKH, TenKH, SoDienThoai, DiaChi FROM khachhang ORDER BY TenKH`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },
  getById: async (maKH) => {
    try {
      const [rows] = await connection.execute(
        `SELECT MaKH, TenKH, SoDienThoai, DiaChi FROM khachhang WHERE MaKH = ?`,
        [maKH]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },
  create: async (data) => {
    try {
      const query = `
        INSERT INTO khachhang (MaKH, TenKH, SoDienThoai, DiaChi) 
        VALUES (?, ?, ?, ?)
      `;
      // Truyền đúng thứ tự tham số vào dấu ?
      await connection.execute(query, [
        data.MaKH,
        data.TenKH,
        data.SoDienThoai,
        data.DiaChi,
      ]);
      return true;
    } catch (error) {
      console.error("Lỗi Model create:", error);
      throw error;
    }
  },

  // Cập nhật thông tin khách hàng
  update: async (id, data) => {
    try {
      const query = `
        UPDATE khachhang 
        SET TenKH = ?, SoDienThoai = ?, DiaChi = ? 
        WHERE MaKH = ?
      `;
      const [result] = await connection.execute(query, [
        data.TenKH,
        data.SoDienThoai,
        data.DiaChi,
        id,
      ]);
      return result;
    } catch (error) {
      console.error("Lỗi Model update:", error);
      throw error;
    }
  },

  // Xóa khách hàng
  delete: async (id) => {
    try {
      const query = `DELETE FROM khachhang WHERE MaKH = ?`;
      const [result] = await connection.execute(query, [id]);
      return result;
    } catch (error) {
      console.error("Lỗi Model delete:", error);
      throw error;
    }
  },
  getOrders: async (maKH) => {
    try {
      const query = `
       SELECT 
            p.SoPhieuBH as id, 
            p.NgayLap as date, 
            p.TongTien as total,
            GROUP_CONCAT(sp.TenSanPham SEPARATOR ', ') as product_summary
        FROM PHIEUBANHANG p
        LEFT JOIN CHITIETBANHANG ct ON p.SoPhieuBH = ct.SoPhieuBH
        LEFT JOIN SANPHAM sp ON ct.MaSanPham = sp.MaSanPham
        WHERE p.MaKH = ?
        GROUP BY p.SoPhieuBH
        ORDER BY p.NgayLap DESC
      `;
      const [rows] = await connection.execute(query, [maKH]);
      return rows;
    } catch (error) {
      console.error("Lỗi lấy lịch sử đơn hàng:", error);
      return [];
    }
  },
};

export default CustomerModel;
