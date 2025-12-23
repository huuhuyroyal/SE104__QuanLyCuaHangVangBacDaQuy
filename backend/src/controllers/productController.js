import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();
import { connection } from "../config/connectDB.js";
import getAllProductsService from "../service/productService.js";
import {
  deleteProductService,
  activeProductService,
  createNewProductService,
  getAllCategoriesService,
  updateProductService,
} from "../service/productService.js";
// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn("Cloudinary credentials are missing. Image uploads will likely fail until you set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your .env file.");
}
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
    console.error("Controller error:", error);
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

// DELETE PRODUCTS
const deleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        errCode: 1,
        message: "Không có sản phẩm nào được chọn để xóa!",
      });
    }

    // Call service to handle
    const response = await deleteProductService(ids);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Controller Delete error:", error);
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi nội bộ Server",
    });
  }
};
// ACTIVATE PRODUCTS
const activeProducts = async (req, res) => {
  try {
    const { id } = req.body; // Product ID
    if (!id) {
      return res.status(400).json({ message: "Missing product ID" });
    }

    const response = await activeProductService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

// CREATE NEW PRODUCT
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
    // handle image
    if (file) {
      data.HinhAnh = file.path;
    } else {
      data.HinhAnh = "#";
    }
    const response = await createNewProductService(data);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Controller Create error:", error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};
const updateProducts = async (req, res) => {
  try {
    const data = req.body;
    const file = req.file;

    // Basic validation
    if (!data.MaSanPham || !data.TenSanPham || !data.MaLoaiSanPham) {
      return res.status(400).json({
        errCode: 1,
        message: "Thiếu thông tin bắt buộc!",
      });
    }

    // Smart image handling
    if (file) {
      data.HinhAnh = file.path;
    } else if (data.HinhAnh === "") {
      data.HinhAnh = null;
    } else {
    }

    const response = await updateProductService(data);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Controller Update error:", error);
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
