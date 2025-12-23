import {
  getAllInvoicesService,
  getInvoiceByIdService,
  createInvoiceService,
  updateInvoiceService,
  deleteInvoicesService,
} from "../service/invoiceService.js";

const getInvoices = async (req, res) => {
  try {
    const { q } = req.query;
    const response = await getAllInvoicesService(q);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller Invoices:", error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getInvoiceByIdService(id);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller Invoice getById:", error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

const createInvoice = async (req, res) => {
  try {
    const data = req.body;
    if (!data.SoPhieuBH || !data.MaKH) {
      return res.status(400).json({ errCode: 1, message: "Thiếu thông tin phiếu" });
    }
    const response = await createInvoiceService(data);
    if (response.errCode && response.errCode !== 0) {
      const status = response.errCode === 2 ? 409 : 400;
      return res.status(status).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller Invoice create:", error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const data = req.body;
    if (!data.SoPhieuBH) {
      return res.status(400).json({ errCode: 1, message: "Thiếu mã phiếu" });
    }
    const response = await updateInvoiceService(data);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller Invoice update:", error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

const deleteInvoices = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0) {
      return res.status(400).json({ errCode: 1, message: "Không có phiếu để xóa" });
    }
    const response = await deleteInvoicesService(ids);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller Invoice delete:", error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

export default {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoices,
};
