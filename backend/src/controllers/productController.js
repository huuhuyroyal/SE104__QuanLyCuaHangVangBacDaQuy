import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { connection } from "../config/connectDB.js";
import getAllProductsService from "../service/productService.js";
import {
  deleteProductService,
  activeProductService,
  createNewProductService,
  getAllCategoriesService,
  updateProductService,
} from "../service/productService.js";
//CẤU HÌNH CLOUDINARY
cloudinary.config({
  cloud_name: "dfwvvjaxz",
  api_key: "594583985267193",
  api_secret: "BJmcUpNWZVF9etanaKwj8fHTPrQ",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "jewelry-store-seed",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) => {
      const productName = req.body.TenSanPham || "unknown-product";
      return `${productName}`;
    },
  },
});

export const upload = multer({ storage: storage });

//TRUY VẤN SẢN PHẨM
const getProducts = async (req, res) => {
  try {
    const response = await getAllProductsService();
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller:", error);
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi nội bộ Server",
    });
  }
};
const getAllCategories = async (req, res) => {
  try {
    const response = await getAllCategoriesService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

// XÓA SẢN PHẨM
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
//KICH HOẠT SẢN PHẨM
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

//THÊM SẢN PHẨM MỚI
const createNewProducts = async (req, res) => {
  try {
    const data = req.body;
    const file = req.file;
    if (!data.TenSanPham || !data.MaLoaiSanPham || !data.MaSanPham) {
      return res.status(400).json({
        errCode: 1,
        message:
          "Vui lòng điền Mã Sản phẩm, Tên sản phẩm và chọn Loại sản phẩm!",
      });
    }
    const [existing] = await connection.query(
      "SELECT * FROM sanpham WHERE MaSanPham = ?",
      [data.MaSanPham]
    );
    if (existing && existing.length > 0) {
      return res.status(400).json({
        errCode: 1,
        message: `Mã sản phẩm '${data.MaSanPham}' đã tồn tại! Vui lòng kiểm tra lại.`,
      });
    }
    // xử lý ảnh
    if (file) {
      data.HinhAnh = file.path;
    } else {
      data.HinhAnh = "#";
    }
    const response = await createNewProductService(data);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller Create:", error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};
const updateProducts = async (req, res) => {
  try {
    const data = req.body;
    const file = req.file;

    // Validate cơ bản
    if (!data.MaSanPham || !data.TenSanPham || !data.MaLoaiSanPham) {
      return res.status(400).json({
        errCode: 1,
        message: "Thiếu thông tin bắt buộc!",
      });
    }

    // LOGIC ẢNH THÔNG MINH
    if (file) {
      data.HinhAnh = file.path;
    } else if (data.HinhAnh === "") {
      data.HinhAnh = null;
    } else {
    }

    const response = await updateProductService(data);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi Controller Update:", error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

export default {
  getProducts,
  getAllCategories,
  deleteProducts,
  activeProducts,
  createNewProducts,
  updateProducts,
};
