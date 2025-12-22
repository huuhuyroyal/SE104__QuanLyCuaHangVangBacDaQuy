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
};

export default customerController;
