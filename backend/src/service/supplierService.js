import SupplierModel from "../models/supplierModel.js";

export const getAllSuppliersService = async () => {
  try {
    const data = await SupplierModel.getAllSuppliers();
    return { errCode: 0, message: "OK", data };
  } catch (error) {
    console.error("Lỗi Supplier Service:", error);
    return { errCode: 1, message: "Lỗi Server", data: [] };
  }
};

export default getAllSuppliersService;
