import { connection } from "../config/connectDB.js";

const getAllEmployees = async () => {
    // Sửa db.query thành connection.execute
    const [rows] = await connection.execute("SELECT MaTaiKhoan, TenTaiKhoan, Role FROM TAIKHOAN");
    return rows; // Trả về mảng kết quả
};

const getEmployeeStatsById = async (MaTaiKhoan) => {
  const query = `
    SELECT t.MaTaiKhoan, t.TenTaiKhoan, t.Role,
      IFNULL((SELECT COUNT(*) FROM PHIEUBANHANG pb WHERE pb.MaTaiKhoan = t.MaTaiKhoan),0) AS SoDonBan,
      IFNULL((SELECT SUM(pb.TongTien) FROM PHIEUBANHANG pb WHERE pb.MaTaiKhoan = t.MaTaiKhoan),0) AS DoanhThu,
      IFNULL((SELECT SUM(ct.SoLuongBan) FROM PHIEUBANHANG pb JOIN CHITIETBANHANG ct ON pb.SoPhieuBH = ct.SoPhieuBH WHERE pb.MaTaiKhoan = t.MaTaiKhoan),0) AS SoLuongBan
    FROM TAIKHOAN t
    WHERE t.MaTaiKhoan = ?
  `;
  const [rows] = await connection.execute(query, [MaTaiKhoan]);
  return rows[0];
};

const createEmployee = async ({ TenTaiKhoan, MatKhau, Role }) => {
    const query = `INSERT INTO TAIKHOAN (TenTaiKhoan, MatKhau, Role) VALUES (?, ?, ?)`;
    const [result] = await connection.execute(query, [TenTaiKhoan, MatKhau, Role]);
    return result.insertId; // mysql2 trả về insertId
};

const getEmployeeSalesHistory = async (MaTaiKhoan) => {
  const query = `
    SELECT 
      pb.SoPhieuBH as MaTaiKhoan,
      DATE_FORMAT(pb.NgayLap, '%d %b %Y') as date,
      pb.TongTien as total,
      GROUP_CONCAT(CONCAT(sp.TenSanPham, ' x', ct.SoLuongBan) SEPARATOR ', ') as product_summary,
      COUNT(ct.MaChiTietBH) as product_count,
      pb.NgayLap as dateFull
    FROM PHIEUBANHANG pb
    LEFT JOIN CHITIETBANHANG ct ON pb.SoPhieuBH = ct.SoPhieuBH
    LEFT JOIN SANPHAM sp ON ct.MaSanPham = sp.MaSanPham
    WHERE pb.MaTaiKhoan = ?
    GROUP BY pb.SoPhieuBH, pb.NgayLap, pb.TongTien
    ORDER BY pb.NgayLap DESC
  `;
  const [rows] = await connection.execute(query, [MaTaiKhoan]);
  return rows;
};

const deleteEmployeeById = async (MaTaiKhoan) => {
  const query = `DELETE FROM TAIKHOAN WHERE MaTaiKhoan = ?`;
  const [result] = await connection.execute(query, [MaTaiKhoan]);
  return result.affectedRows;
};

export default { getAllEmployees, getEmployeeStatsById, getEmployeeSalesHistory, createEmployee, deleteEmployeeById };