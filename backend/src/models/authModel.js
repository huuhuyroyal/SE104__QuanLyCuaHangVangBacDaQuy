import { connection } from "../config/connectDB.js";

// Find user by username (TenTaiKhoan)
const findUserByUsername = async (TenTaiKhoan) => {
  try {
    const query = "SELECT * FROM TAIKHOAN WHERE TenTaiKhoan = ?";
    const [rows] = await connection.execute(query, [TenTaiKhoan]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export default { findUserByUsername };
