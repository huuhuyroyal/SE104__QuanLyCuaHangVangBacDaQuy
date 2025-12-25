import { connection } from "../config/connectDB.js";

const ReportModel = {
  getReportModel: async (month, year) => {
    try {
      const pad = (n) => n.toString().padStart(2, "0");

      const m = parseInt(month || new Date().getMonth() + 1);
      const y = parseInt(year || new Date().getFullYear());

      const startDate = `${y}-${pad(m)}-01`;

      let nextM = m + 1;
      let nextY = y;
      if (nextM > 12) {
        nextM = 1;
        nextY = y + 1;
      }
      const endDate = `${nextY}-${pad(nextM)}-01`;

      const query = `
        SELECT 
            s.MaSanPham, 
            s.TenSanPham, 
            s.HinhAnh,
            d.TenDVT,
            (s.SoLuongTon + IFNULL(NhapTruoc.Sl, 0) - IFNULL(BanTruoc.Sl, 0)) AS TonDau,
            IFNULL(NhapTrong.Sl, 0) AS SoLuongMuaVao,
            IFNULL(BanTrong.Sl, 0) AS SoLuongBanRa,
            ((s.SoLuongTon + IFNULL(NhapTruoc.Sl, 0) - IFNULL(BanTruoc.Sl, 0)) + IFNULL(NhapTrong.Sl, 0) - IFNULL(BanTrong.Sl, 0)) AS TonCuoi
        FROM SANPHAM s
        LEFT JOIN LOAISANPHAM l ON s.MaLoaiSanPham = l.MaLoaiSanPham
        LEFT JOIN DONVITINH d ON l.MaDVT = d.MaDVT
        LEFT JOIN (
            SELECT ctm.MaSanPham, SUM(ctm.SoLuongMua) AS Sl
            FROM CHITIETMUAHANG ctm
            JOIN PHIEUMUAHANG pm ON ctm.SoPhieuMH = pm.SoPhieuMH
            WHERE pm.NgayLap < ? 
            GROUP BY ctm.MaSanPham
        ) AS NhapTruoc ON s.MaSanPham = NhapTruoc.MaSanPham
        LEFT JOIN (
            SELECT ctb.MaSanPham, SUM(ctb.SoLuongBan) AS Sl
            FROM CHITIETBANHANG ctb
            JOIN PHIEUBANHANG pb ON ctb.SoPhieuBH = pb.SoPhieuBH
            WHERE pb.NgayLap < ?
            GROUP BY ctb.MaSanPham
        ) AS BanTruoc ON s.MaSanPham = BanTruoc.MaSanPham
        LEFT JOIN (
            SELECT ctm.MaSanPham, SUM(ctm.SoLuongMua) AS Sl
            FROM CHITIETMUAHANG ctm
            JOIN PHIEUMUAHANG pm ON ctm.SoPhieuMH = pm.SoPhieuMH
            WHERE pm.NgayLap >= ? AND pm.NgayLap < ?
            GROUP BY ctm.MaSanPham
        ) AS NhapTrong ON s.MaSanPham = NhapTrong.MaSanPham
        LEFT JOIN (
            SELECT ctb.MaSanPham, SUM(ctb.SoLuongBan) AS Sl
            FROM CHITIETBANHANG ctb
            JOIN PHIEUBANHANG pb ON ctb.SoPhieuBH = pb.SoPhieuBH
            WHERE pb.NgayLap >= ? AND pb.NgayLap < ?
            GROUP BY ctb.MaSanPham
        ) AS BanTrong ON s.MaSanPham = BanTrong.MaSanPham
        
        ORDER BY s.MaSanPham ASC
      `;

      const params = [
        startDate,
        startDate,
        startDate,
        endDate,
        startDate,
        endDate,
      ];

      const [rows] = await connection.execute(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  },
};

export default ReportModel;
