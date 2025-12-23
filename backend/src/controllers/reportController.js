import ReportService from "../service/ReportService.js";

const ReportController = {
  getReport: async (req, res) => {
    try {
      let { month, year } = req.query;

      // Kiểm tra hợp lệ
      if (month) {
        month = parseInt(month);
        if (isNaN(month) || month < 1 || month > 12) {
          return res.status(400).json({
            success: false,
            message: "Tháng không hợp lệ. Vui lòng chọn từ 1 đến 12.",
          });
        }
      }

      if (year) {
        year = parseInt(year);
        if (isNaN(year) || year < 2000 || year > 2100) {
          // Giới hạn năm logic
          return res.status(400).json({
            success: false,
            message: "Năm không hợp lệ.",
          });
        }
      }

      // Gọi Service để xử lý dữ liệu
      const result = await ReportService.getReport(month, year);

      // 4. Trả về kết quả thành công
      return res.status(200).json({
        success: true,
        message: `Lấy báo cáo tồn kho tháng ${result.month}/${result.year} thành công`,
        data: result, // Bao gồm cả items và summary
      });
    } catch (error) {
      console.error("Report Controller Error:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi server khi xuất báo cáo.",
        error: error.message, // Có thể bỏ dòng này khi deploy production để bảo mật
      });
    }
  },
};

export default ReportController;
