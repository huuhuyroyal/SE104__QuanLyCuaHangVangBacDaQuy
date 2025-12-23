import supplierService from "../service/supplierService.js";

const supplierController = {
  getSuppliers: async (req, res) => {
    try {
      const response = await supplierService.getAllSuppliers();
      return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
      console.error("Lỗi Controller Suppliers:", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
    }
  },

  getSupplierById: async (req, res) => {
    try {
      const response = await supplierService.getSupplierById(req.params.id);
      return res.status(response.errCode === 0 ? 200 : 404).json(response);
    } catch (error) {
      console.error("Lỗi lấy supplier by id:", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
    }
  },

  searchSuppliers: async (req, res) => {
    try {
      const response = await supplierService.searchSuppliers(req.query.q || "");
      return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
      console.error("Lỗi search supplier:", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
    }
  },

  createSupplier: async (req, res) => {
    try {
      const response = await supplierService.createSupplier({
        maNCC: req.body.maNCC,
        tenNCC: req.body.tenNCC,
        diaChi: req.body.diaChi,
        soDienThoai: req.body.soDienThoai,
      });
      return res.status(response.errCode === 0 ? 201 : 400).json(response);
    } catch (error) {
      console.error("Lỗi create supplier:", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
    }
  },

  updateSupplier: async (req, res) => {
    try {
      const response = await supplierService.updateSupplier({
        maNCC: req.params.id,
        tenNCC: req.body.tenNCC,
        diaChi: req.body.diaChi,
        soDienThoai: req.body.soDienThoai,
      });
      return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
      console.error("Lỗi update supplier:", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
    }
  },

  deleteSupplier: async (req, res) => {
    try {
      const response = await supplierService.deleteSupplier(req.params.id);
      return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
      console.error("Lỗi delete supplier:", error);
      return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
    }
  },
};

export default supplierController;
