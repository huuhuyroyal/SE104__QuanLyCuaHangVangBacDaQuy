import unitService from "../service/unitService.js";

const unitController = {
  // Lấy tất cả đơn vị tính
  getAllUnits: async (req, res) => {
    try {
      const result = await unitService.getAllUnits();
      res.status(result.errCode === 0 ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        errCode: 1,
        message: "Lỗi server",
        error: error.message,
      });
    }
  },

  // Lấy đơn vị tính theo ID
  getUnitById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await unitService.getUnitById(id);
      res.status(result.errCode === 0 ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        errCode: 1,
        message: "Lỗi server",
        error: error.message,
      });
    }
  },

  // Tìm kiếm đơn vị tính
  searchUnits: async (req, res) => {
    try {
      const { q } = req.query;
      const result = await unitService.searchUnits(q || "");
      res.status(result.errCode === 0 ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        errCode: 1,
        message: "Lỗi server",
        error: error.message,
      });
    }
  },

  // Tạo đơn vị tính mới
  createUnit: async (req, res) => {
    try {
      const { maDVT, tenDVT } = req.body;
      const result = await unitService.createUnit(maDVT, tenDVT);
      res.status(result.errCode === 0 ? 201 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        errCode: 1,
        message: "Lỗi server",
        error: error.message,
      });
    }
  },

  // Cập nhật đơn vị tính
  updateUnit: async (req, res) => {
    try {
      const { id } = req.params;
      const { tenDVT } = req.body;
      const result = await unitService.updateUnit(id, tenDVT);
      res.status(result.errCode === 0 ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        errCode: 1,
        message: "Lỗi server",
        error: error.message,
      });
    }
  },

  // Xóa đơn vị tính
  deleteUnit: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await unitService.deleteUnit(id);
      res.status(result.errCode === 0 ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        errCode: 1,
        message: "Lỗi server",
        error: error.message,
      });
    }
  },
};

export default unitController;
