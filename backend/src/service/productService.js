import ProductModel from "../models/productModel.js";

const getAllProductsService = async () => {
  try {
    const products = await ProductModel.getAllProducts();
    return {
      errCode: 0,
      message: "OK",
      data: products,
    };
  } catch (error) {
    console.error("Lỗi Service:", error);
    return {
      errCode: 1,
      message: "Lỗi Server",
      data: [],
    };
  }
};

export const deleteProductService = async (ids) => {
  try {
    // Gọi Model để update Database
    // Chúng ta sẽ dùng Soft Delete (cập nhật trạng thái) chứ không xóa hẳn
    await ProductModel.deleteProducts(ids);
    return {
      errCode: 0,
      message: "Xóa sản phẩm thành công!",
    };
  } catch (error) {
    console.error("Lỗi Service", error);
    return {
      errCode: 1,
      message: "Lỗi Server khi xóa sản phẩm",
    };
  }
};
export const activeProductService = async (id) => {
  try {
    await ProductModel.activeProduct(id);
    return {
      errCode: 0,
      message: "Kích hoạt sản phẩm thành công!",
    };
  } catch (error) {
    console.error("Lỗi Service Activate:", error);
    return {
      errCode: 1,
      message: "Lỗi Server khi kích hoạt",
    };
  }
};
export default getAllProductsService;
