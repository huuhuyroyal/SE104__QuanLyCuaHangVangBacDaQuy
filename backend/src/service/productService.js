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
    const currentProducts = await ProductModel.getProductsByIds(ids);
    if (!currentProducts || currentProducts.length === 0) {
      return { errCode: 1, message: "Không tìm thấy sản phẩm!" };
    }

    const idsToStatusChange = [];
    const idsToDelete = [];
    currentProducts.forEach((product) => {
      const isDeleted = product.isDelete == 1 || product.isDelete === true;

      if (isDeleted) {
        idsToDelete.push(product.MaSanPham);
      } else {
        idsToStatusChange.push(product.MaSanPham);
      }
    });

    let message = "";
    if (idsToStatusChange.length > 0) {
      await ProductModel.statusChange(idsToStatusChange);
      message += `Đã tắt trạng thái hoạt động của ${idsToStatusChange.length} sản phẩm. `;
    }

    // Xóa vĩnh viễn
    if (idsToDelete.length > 0) {
      try {
        await ProductModel.deleteProduct(idsToDelete);
        message += `Đã xóa vĩnh viễn ${idsToDelete.length} sản phẩm. `;
      } catch (dbError) {
        if (
          dbError.errno === 1451 ||
          dbError.code === "ER_ROW_IS_REFERENCED_2"
        ) {
          return {
            errCode: 2,
            message: `Không thể xóa vĩnh viễn do sản phẩm đang có dữ liệu liên quan (Tồn kho/Hóa đơn). Sản phẩm sẽ được giữ ở trạng thái "Đã đóng".`,
          };
        }
        throw dbError;
      }
    }
    return {
      errCode: 0,
      message: message.trim(),
    };
  } catch (error) {
    console.error("Lỗi Service Delete:", error);
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
// THÊM SẢN PHẨM MỚI
export const createNewProductService = async (data) => {
  try {
    await ProductModel.createProduct(data);
    return {
      errCode: 0,
      message: "Thêm sản phẩm thành công!",
    };
  } catch (error) {
    console.error("Lỗi Service Create:", error);
    return {
      errCode: 1,
      message: "Lỗi Server khi thêm sản phẩm",
    };
  }
};
export const getAllCategoriesService = async () => {
  try {
    const categories = await ProductModel.getAllCategories();
    return {
      errCode: 0,
      message: "OK",
      data: categories,
    };
  } catch (error) {
    console.error("Lỗi Service Category:", error);
    return {
      errCode: 1,
      message: "Lỗi Server",
      data: [],
    };
  }
};
export const updateProductService = async (data) => {
  try {
    // Gọi Model để update vào Database
    await ProductModel.updateProduct(data);
    return {
      errCode: 0,
      message: "Cập nhật sản phẩm thành công!",
    };
  } catch (error) {
    console.error("Lỗi Service Update:", error);
    return {
      errCode: 1,
      message: "Lỗi Server khi cập nhật",
    };
  }
};
export default getAllProductsService;
