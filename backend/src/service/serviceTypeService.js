import ServiceTypeModel from "../models/serviceTypeModel.js";

export const getAllServiceTypes = async () => {
  try {
    const data = await ServiceTypeModel.getAll();
    return { errCode: 0, message: "OK", data };
  } catch (error) {
    return { errCode: 1, message: "Lỗi Server", data: [] };
  }
};

export const createServiceType = async (data) => {
  try {
    await ServiceTypeModel.create(data);
    return { errCode: 0, message: "Thêm thành công!" };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
       return { errCode: 1, message: "Mã loại dịch vụ đã tồn tại!" };
    }
    return { errCode: 1, message: "Lỗi khi thêm loại dịch vụ" };
  }
};

export const updateServiceType = async (data) => {
  try {
    await ServiceTypeModel.update(data);
    return { errCode: 0, message: "Cập nhật thành công!" };
  } catch (error) {
    return { errCode: 1, message: "Lỗi khi cập nhật" };
  }
};

export const deleteServiceType = async (id) => {
  try {
    await ServiceTypeModel.delete(id);
    return { errCode: 0, message: "Xóa thành công!" };
  } catch (error) {
    // Handle foreign key constraint error if services are using this type
    if (error.errno === 1451) {
      return { errCode: 2, message: "Không thể xóa: Có phiếu dịch vụ đang sử dụng loại này!" };
    }
    return { errCode: 1, message: "Lỗi khi xóa" };
  }
};