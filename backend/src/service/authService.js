import authModel from "../models/authModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const login = async (TenTaiKhoan, MatKhau) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!TenTaiKhoan || !MatKhau) {
        resolve({
          errCode: 1,
          message: "Vui lòng nhập tên tài khoản và mật khẩu!",
          statusCode: 400,
        });
        return;
      }

      const user = await authModel.findUserByUsername(TenTaiKhoan);

      if (!user) {
        resolve({
          errCode: 2,
          message: "Tài khoản không tồn tại!",
          statusCode: 404,
        });
        return;
      }

      const checkPassword = user.MatKhau === MatKhau;
      if (!checkPassword) {
        resolve({
          errCode: 3,
          message: "Mật khẩu không chính xác!",
          statusCode: 401,
        });
        return;
      }

      delete user.MatKhau;

      const token = jwt.sign(
        {
          id: user.MaTaiKhoan,
          TenTaiKhoan: user.TenTaiKhoan,
          Role: user.Role,
        },
        process.env.JWT_SECRET || "matkhaucuaban",
        { expiresIn: "1d" }
      );

      resolve({
        errCode: 0,
        message: "Đăng nhập thành công!",
        statusCode: 200,
        token: token,
        user: user,
      });
    } catch (error) {
      reject(error);
    }
  });
};
export default { login };
