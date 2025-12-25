import customerService from "../service/customerService.js";

const customerController = {
  getAllCustomers: async (req, res) => {
    try {
      const result = await customerService.getAllCustomers();
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ errCode: 1, message: "Server error" });
    }
  },
  getCustomerById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await customerService.getCustomerById(id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ errCode: 1, message: "Server error" });
    }
  },
  createCustomer: async (req, res) => {
    try {
      // req.body chứa dữ liệu từ form gửi lên
      const result = await customerService.createCustomer(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ errCode: -1, message: "Lỗi server" });
    }
  },

  updateCustomer: async (req, res) => {
    try {
      const result = await customerService.updateCustomer(
        req.params.id,
        req.body
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ errCode: -1, message: "Lỗi server" });
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      const result = await customerService.deleteCustomer(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ errCode: -1, message: "Lỗi server" });
    }
  },
};

export default customerController;
