import ServiceTicketModel from "../models/serviceTicketModel.js";

export const getAllServiceTickets = async (search) => {
  try {
    const data = await ServiceTicketModel.getAll(search);
    return { errCode: 0, message: "OK", data };
  } catch (error) {
    console.error(error);
    return { errCode: 1, message: "Server Error" };
  }
};

export const getServiceTicketById = async (id) => {
  try {
    const data = await ServiceTicketModel.getById(id);
    return { errCode: 0, message: "OK", data };
  } catch (error) {
    return { errCode: 1, message: "Server Error" };
  }
};

export const createServiceTicket = async (data) => {
  try {
    await ServiceTicketModel.create(data);
    return { errCode: 0, message: "Tạo phiếu dịch vụ thành công!" };
  } catch (error) {
    // Handle specific errors
    if (error.code === 'DUPLICATE_ID') {
        return { errCode: 2, message: "Mã phiếu đã tồn tại!" };
    }
    if (error.message === 'NO_ITEMS') {
        return { errCode: 1, message: "Phiếu dịch vụ phải có ít nhất một dịch vụ!" };
    }
    
    console.error("Create Ticket Error:", error);
    return { errCode: 1, message: "Lỗi tạo phiếu: " + (error.message || "Lỗi Server") };
  }
};

export const updateTicketStatus = async (id, status) => {
    try {
        await ServiceTicketModel.updateStatus(id, status);
        return { errCode: 0, message: "Cập nhật trạng thái thành công" };
    } catch (error) {
        return { errCode: 1, message: "Lỗi cập nhật" };
    }
}

export const deleteServiceTickets = async (ids) => {
  try {
    const deleted = await ServiceTicketModel.delete(ids);
    return { errCode: 0, message: `Đã xóa ${deleted} phiếu` };
  } catch (error) {
    return { errCode: 1, message: "Lỗi xóa phiếu" };
  }
};