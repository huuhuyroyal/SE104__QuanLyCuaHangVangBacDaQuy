import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = {
  // Kiểm tra token
  verifyToken: (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          errCode: 1,
          message: "Bạn chưa đăng nhập",
        });
      }

      const accessToken = token.split(" ")[1];

      jwt.verify(
        accessToken,
        process.env.JWT_SECRET || "matkhaucuaban",
        (err, userDecoded) => {
          if (err) {
            return res.status(403).json({
              errCode: 2,
              message: "Token không hợp lệ hoặc đã hết hạn",
            });
          }
          req.user = userDecoded;
          next();
        }
      );
    } catch (error) {
      return res.status(401).json({
        errCode: 1,
        message: "Xác thực thất bại",
      });
    }
  },

  // Middleware Phân quyền
  checkPermission: (allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          errCode: 1,
          message: "Chưa xác thực người dùng",
        });
      }

      const userRole = req.user.Role;

      if (allowedRoles.includes(userRole)) {
        next(); // Được phép
      } else {
        return res.status(403).json({
          errCode: 3,
          message: `Bạn không có quyền thực hiện chức năng này. (Role của bạn là: ${userRole})`,
        });
      }
    };
  },
};

export default authMiddleware;
