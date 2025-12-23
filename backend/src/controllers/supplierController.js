import { getAllSuppliersService } from "../service/supplierService.js";

const getSuppliers = async (req, res) => {
  try {
    const response = await getAllSuppliersService();
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller Suppliers:", error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

export default { getSuppliers };
