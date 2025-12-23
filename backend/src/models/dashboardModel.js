import { connection } from "../config/connectDB.js";

const DashboardModel = {
  // 1. Get 4-card statistics
  getStats: async () => {
    try {
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM sanpham WHERE isDelete = 0) as products,
          (SELECT COUNT(*) FROM loaisanpham) as categories,
          (SELECT COUNT(*) FROM khachhang) as customers,
          (SELECT COUNT(*) FROM phieubanhang) as orders;
      `;
      const [rows] = await connection.query(query);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // 2. Get monthly revenue
  getRevenueAnalytics: async () => {
    try {
      const query = `
        SELECT 
          MONTH(NgayLap) as thang,
          SUM(CASE WHEN YEAR(NgayLap) = YEAR(CURDATE()) THEN TongTien ELSE 0 END) as now,
          SUM(CASE WHEN YEAR(NgayLap) = YEAR(CURDATE()) - 1 THEN TongTien ELSE 0 END) as last
        FROM phieubanhang
        WHERE YEAR(NgayLap) IN (YEAR(CURDATE()), YEAR(CURDATE()) - 1)
        GROUP BY MONTH(NgayLap)
        ORDER BY thang;
      `;
      const [rows] = await connection.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // 3. Get revenue by category
  getCategoryAnalytics: async () => {
    try {
      const query = `
        SELECT 
          l.TenLoaiSanPham as name, 
          SUM(ct.ThanhTien) as value
        FROM chitietbanhang ct
        JOIN sanpham s ON ct.MaSanPham = s.MaSanPham
        JOIN loaisanpham l ON s.MaLoaiSanPham = l.MaLoaiSanPham
        JOIN phieubanhang p ON ct.SoPhieuBH = p.SoPhieuBH
        WHERE YEAR(p.NgayLap) = YEAR(CURDATE())
        GROUP BY l.TenLoaiSanPham;
      `;
      const [rows] = await connection.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // 4. Get order count by month
  getOrderAnalytics: async () => {
    try {
      const query = `
        SELECT 
          MONTH(NgayLap) as name,
          COUNT(CASE WHEN YEAR(NgayLap) = YEAR(CURDATE()) THEN 1 END) as now,
          COUNT(CASE WHEN YEAR(NgayLap) = YEAR(CURDATE()) - 1 THEN 1 END) as last
        FROM phieubanhang
        WHERE YEAR(NgayLap) IN (YEAR(CURDATE()), YEAR(CURDATE()) - 1)
        GROUP BY MONTH(NgayLap)
        ORDER BY name;
      `;
      const [rows] = await connection.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
};

export default DashboardModel;
