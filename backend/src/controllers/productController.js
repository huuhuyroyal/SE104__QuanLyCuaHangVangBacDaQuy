import getAllProductsService from "../service/productService.js";
import {
  deleteProductService,
  activeProductService,
} from "../service/productService.js";

const getProducts = async (req, res) => {
  try {
    // Gọi hàm trực tiếp
    const response = await getAllProductsService();
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller:", error); // Log lỗi ra terminal backend
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi nội bộ Server (Controller Crash)",
    });
  }
};
const deleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        errCode: 1,
        message: "Không có sản phẩm nào được chọn để xóa!",
      });
    }

    // Gọi Service xử lý
    const response = await deleteProductService(ids);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller Delete:", error);
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi nội bộ Server",
    });
  }
};
const activeProducts = async (req, res) => {
  try {
    const { id } = req.body; // Lấy ID sản phẩm
    if (!id) {
      return res.status(400).json({ message: "Thiếu ID sản phẩm" });
    }

    const response = await activeProductService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

export default { getProducts, deleteProducts, activeProducts };
