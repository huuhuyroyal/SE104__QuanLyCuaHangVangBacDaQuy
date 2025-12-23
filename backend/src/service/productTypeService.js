import ProductTypeModel from "../models/productTypeModel.js";

export const getAllTypesService = async () => {
  try {
    const data = await ProductTypeModel.getAll();
    return { errCode: 0, message: "OK", data };
  } catch (error) {
    return { errCode: 1, message: "Lỗi Server", data: [] };
  }
};

export const createTypeService = async (data) => {
  try {
    await ProductTypeModel.create(data);
    return { errCode: 0, message: "Thêm thành công!" };
  } catch (error) {
    return { errCode: 1, message: "Lỗi khi thêm loại sản phẩm" };
  }
};

export const updateTypeService = async (data) => {
  try {
    await ProductTypeModel.update(data);
    return { errCode: 0, message: "Cập nhật thành công!" };
  } catch (error) {
    return { errCode: 1, message: "Lỗi khi cập nhật" };
  }
};

export const deleteTypeService = async (id) => {
  try {
    await ProductTypeModel.delete(id);
    return { errCode: 0, message: "Xóa thành công!" };
  } catch (error) {
    if (error.errno === 1451) {
      return { errCode: 2, message: "Không thể xóa: Có sản phẩm đang thuộc loại này!" };
    }
    return { errCode: 1, message: "Lỗi khi xóa" };
  }
};