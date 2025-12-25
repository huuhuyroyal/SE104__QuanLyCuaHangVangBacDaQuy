import { connection } from "../config/connectDB.js";

const EmployeeModel = {
  getAllEmployees: async () => {
    const [rows] = await connection.execute(
      "SELECT MaTaiKhoan, TenTaiKhoan, Role FROM TAIKHOAN ORDER BY MaTaiKhoan DESC"
    );
    return rows;
  },

  checkExist: async (TenTaiKhoan) => {
    const [rows] = await connection.execute(
      "SELECT MaTaiKhoan FROM TAIKHOAN WHERE TenTaiKhoan = ?",
      [TenTaiKhoan]
    );
    return rows.length > 0;
  },

  createEmployee: async ({ TenTaiKhoan, MatKhau, Role }) => {
    const [result] = await connection.execute(
      "INSERT INTO TAIKHOAN (TenTaiKhoan, MatKhau, Role) VALUES (?, ?, ?)",
      [TenTaiKhoan, MatKhau, Role]
    );
    return result.insertId;
  },

  deleteEmployeeById: async (MaTaiKhoan) => {
    const [result] = await connection.execute(
      "DELETE FROM TAIKHOAN WHERE MaTaiKhoan = ?",
      [MaTaiKhoan]
    );
    return result.affectedRows;
  },
};

export default EmployeeModel;
