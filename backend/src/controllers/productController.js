import { connection } from "../config/connectDB.js";

export const getProducts = async (req, res) => {
  try {
    // Chạy câu lệnh SQL lấy dữ liệu từ bảng 'sanpham'
    const [rows] = await connection.execute("SELECT * FROM sanpham");

    return res.status(200).json({
      message: "Success",
      data: rows, // Trả về dữ liệu
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Lỗi ServeR" });
  }
};
