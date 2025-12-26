import {
  getAllPurchasesService,
  getPurchaseByIdService,
  createPurchaseService,
  deletePurchasesService,
} from "../service/purchaseService.js";

const getPurchases = async (req, res) => {
  try {
    const { q } = req.query;
    const response = await getAllPurchasesService(q);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller Purchases:", error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getPurchaseByIdService(id);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller Purchase getById:", error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

const createPurchase = async (req, res) => {
  try {
    const data = req.body;
    if (!data.SoPhieuMH || !data.MaNCC) {
      return res
        .status(400)
        .json({ errCode: 1, message: "Thiếu thông tin phiếu" });
    }
    const response = await createPurchaseService(data);
    if (response.errCode && response.errCode !== 0) {
      const status = response.errCode === 2 ? 409 : 400;
      return res.status(status).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller Purchase create:", error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

const deletePurchases = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0) {
      return res
        .status(400)
        .json({ errCode: 1, message: "Không có phiếu để xóa" });
    }
    const response = await deletePurchasesService(ids);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller Purchase delete:", error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

export default {
  getPurchases,
  getPurchaseById,
  createPurchase,
  deletePurchases,
};
