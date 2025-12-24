import EmployeeModel from "../models/employeeModel.js";

const getAllEmployeesService = async () => {
  try {
    const employees = await EmployeeModel.getAllEmployees();
    return { errCode: 0, message: "OK", data: employees };
  } catch (error) {
    console.error("Lỗi Service Employees:", error);
    return { errCode: 1, message: "Lỗi Server", data: [] };
  }
};

const getEmployeeDetailService = async (id) => {
  try {
    const detail = await EmployeeModel.getEmployeeStatsById(id);
    if (!detail) {
      return { errCode: 1, message: "Không tìm thấy nhân viên", data: null };
    }
    return { errCode: 0, message: "OK", data: detail };
  } catch (error) {
    console.error("Lỗi Service Employee Detail:", error);
    return { errCode: 1, message: "Lỗi Server", data: null };
  }
};

const createEmployeeService = async (data) => {
  try {
    const { TenTaiKhoan, MatKhau, Role } = data;
    if (!TenTaiKhoan || !MatKhau || !Role) {
      return { errCode: 2, message: "Thiếu thông tin tạo tài khoản" };
    }
    const insertId = await EmployeeModel.createEmployee({ TenTaiKhoan, MatKhau, Role });
    return { errCode: 0, message: "Tạo tài khoản thành công", data: { MaTaiKhoan: insertId } };
  } catch (error) {
    console.error("Lỗi Service Create Employee:", error);
    if (error && error.code === "ER_DUP_ENTRY") {
      return { errCode: 3, message: "Tên tài khoản đã tồn tại" };
    }
    return { errCode: 1, message: "Lỗi Server" };
  }
};

const deleteEmployeeService = async (id) => {
  try {
    const affected = await EmployeeModel.deleteEmployeeById(id);
    if (!affected || affected === 0) {
      return { errCode: 1, message: "Không tìm thấy nhân viên hoặc đã xóa" };
    }
    return { errCode: 0, message: "Xóa nhân viên thành công" };
  } catch (error) {
    console.error("Lỗi Service Delete Employee:", error);
    return { errCode: 1, message: "Lỗi Server khi xóa nhân viên" };
  }
};

export default { getAllEmployeesService, getEmployeeDetailService, createEmployeeService, deleteEmployeeService };
