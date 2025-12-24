import { connection } from "../config/connectDB.js";

const getAllEmployees = async () => {
  const query = `SELECT MaTaiKhoan, TenTaiKhoan, Role, createdAt, updatedAt FROM TAIKHOAN`;
  const [rows] = await connection.execute(query);
  return rows;
};

const getEmployeeStatsById = async (id) => {
  const query = `
    SELECT t.MaTaiKhoan, t.TenTaiKhoan, t.Role,
      IFNULL((SELECT COUNT(*) FROM PHIEUBANHANG pb WHERE pb.MaTaiKhoan = t.MaTaiKhoan),0) AS SoDonBan,
      IFNULL((SELECT SUM(pb.TongTien) FROM PHIEUBANHANG pb WHERE pb.MaTaiKhoan = t.MaTaiKhoan),0) AS DoanhThu,
      IFNULL((SELECT SUM(ct.SoLuongBan) FROM PHIEUBANHANG pb JOIN CHITIETBANHANG ct ON pb.SoPhieuBH = ct.SoPhieuBH WHERE pb.MaTaiKhoan = t.MaTaiKhoan),0) AS SoLuongBan
    FROM TAIKHOAN t
    WHERE t.MaTaiKhoan = ?
  `;
  const [rows] = await connection.execute(query, [id]);
  return rows[0];
};

const createEmployee = async ({ TenTaiKhoan, MatKhau, Role }) => {
  const query = `INSERT INTO TAIKHOAN (TenTaiKhoan, MatKhau, Role) VALUES (?, ?, ?)`;
  const [result] = await connection.execute(query, [TenTaiKhoan, MatKhau, Role]);
  return result.insertId;
};

const deleteEmployeeById = async (id) => {
  const query = `DELETE FROM TAIKHOAN WHERE MaTaiKhoan = ?`;
  const [result] = await connection.execute(query, [id]);
  return result.affectedRows;
};

export default { getAllEmployees, getEmployeeStatsById, createEmployee, deleteEmployeeById };
