import ReportModel from "../models/reportModel.js";

const ReportService = {
  getReport: async (month, year) => {
    try {
      const currentMonth = month || new Date().getMonth() + 1;
      const currentYear = year || new Date().getFullYear();

      // Lấy dữ liệu thô
      const rawData = await ReportModel.getReportModel(
        currentMonth,
        currentYear
      );

      // Biến đổi dữ liệu cho khớp với các cột của bảng
      const reportData = rawData.map((item, index) => {
        const tonCuoi = parseInt(item.TonCuoi);

        // Trả về
        return {
          maSanPham: item.MaSanPham,
          tenSanPham: item.TenSanPham,
          dvt: item.TenDVT,
          tonDau: parseInt(item.TonDau),
          nhap: parseInt(item.SoLuongMuaVao),
          xuat: parseInt(item.SoLuongBanRa),
          tonCuoi: tonCuoi,
        };
      });

      return {
        month: currentMonth,
        year: currentYear,
        items: reportData,
      };
    } catch (error) {
      throw error;
    }
  },
};

export default ReportService;
