import InvoiceModel from "../models/invoiceModel.js";

export const getAllInvoicesService = async (search) => {
  try {
    const invoices = await InvoiceModel.getAllInvoices(search);
    return { errCode: 0, message: "OK", data: invoices };
  } catch (error) {
    console.error("Lỗi Invoice Service:", error);
    return { errCode: 1, message: "Lỗi Server", data: [] };
  }
};

export const getInvoiceByIdService = async (soPhieu) => {
  try {
    const data = await InvoiceModel.getInvoiceById(soPhieu);
    return { errCode: 0, message: "OK", data };
  } catch (error) {
    console.error("Lỗi Invoice getById:", error);
    return { errCode: 1, message: "Lỗi Server", data: null };
  }
};

export const createInvoiceService = async (data) => {
  try {
    await InvoiceModel.createInvoice(data);
    return { errCode: 0, message: "Tạo phiếu thành công" };
  } catch (error) {
    console.error("Lỗi createInvoiceService:", error);
    if (
      error &&
      (error.code === "DUPLICATE_INVOICE" ||
        error.message === "DUPLICATE_INVOICE")
    ) {
      return { errCode: 2, message: "Mã phiếu đã tồn tại" };
    }
    return { errCode: 1, message: "Lỗi Server khi tạo phiếu" };
  }
};

export const deleteInvoicesService = async (ids) => {
  try {
    const deleted = await InvoiceModel.deleteInvoices(ids);
    return { errCode: 0, message: `Đã xóa ${deleted} phiếu`, data: deleted };
  } catch (error) {
    console.error("Lỗi deleteInvoicesService:", error);
    return { errCode: 1, message: "Lỗi Server khi xóa phiếu" };
  }
};

export default getAllInvoicesService;
