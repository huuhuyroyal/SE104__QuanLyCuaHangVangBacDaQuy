import PurchaseModel from "../models/purchaseModel.js";

export const getAllPurchasesService = async (search) => {
  try {
    const data = await PurchaseModel.getAllPurchases(search);
    return { errCode: 0, message: "OK", data };
  } catch (error) {
    console.error("Lỗi Purchase Service:", error);
    return { errCode: 1, message: "Lỗi Server", data: [] };
  }
};

export const getPurchaseByIdService = async (id) => {
  try {
    const data = await PurchaseModel.getPurchaseById(id);
    return { errCode: 0, message: "OK", data };
  } catch (error) {
    console.error("Lỗi Purchase getById:", error);
    return { errCode: 1, message: "Lỗi Server", data: null };
  }
};

export const createPurchaseService = async (data) => {
  try {
    await PurchaseModel.createPurchase(data);
    return { errCode: 0, message: "Tạo phiếu mua thành công" };
  } catch (error) {
    console.error("Lỗi createPurchaseService:", error);
    if (error && error.code === "DUPLICATE_PURCHASE") {
      return { errCode: 2, message: "Mã phiếu đã tồn tại" };
    }
    return { errCode: 1, message: "Lỗi Server khi tạo phiếu" };
  }
};

export const updatePurchaseService = async (data) => {
  try {
    await PurchaseModel.updatePurchase(data);
    return { errCode: 0, message: "Cập nhật phiếu mua thành công" };
  } catch (error) {
    console.error("Lỗi updatePurchaseService:", error);
    return { errCode: 1, message: "Lỗi Server khi cập nhật phiếu" };
  }
};

export const deletePurchasesService = async (ids) => {
  try {
    const deleted = await PurchaseModel.deletePurchases(ids);
    return { errCode: 0, message: `Đã xóa ${deleted} phiếu mua`, data: deleted };
  } catch (error) {
    console.error("Lỗi deletePurchasesService:", error);
    return { errCode: 1, message: "Lỗi Server khi xóa phiếu" };
  }
};

export default getAllPurchasesService;
