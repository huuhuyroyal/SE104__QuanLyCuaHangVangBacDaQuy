import EmployeeModel from "../models/employeeModel.js";

const getAllEmployeesService = async () => {
  try {
    const employees = await EmployeeModel.getAllEmployees();
    return { errCode: 0, message: "OK", data: employees };
  } catch (error) {
    console.error("Error Service:", error);
    return { errCode: 1, message: "Lỗi lấy danh sách", data: [] };
  }
};

const createEmployeeService = async (data) => {
  try {
    const { TenTaiKhoan, MatKhau, Role } = data;
    const isExist = await EmployeeModel.checkExist(TenTaiKhoan);

    if (isExist) {
      return { errCode: 3, message: "Tên tài khoản đã tồn tại" };
    }

    const insertId = await EmployeeModel.createEmployee({
      TenTaiKhoan,
      MatKhau,
      Role,
    });
    return {
      errCode: 0,
      message: "Tạo tài khoản thành công",
      data: { MaTaiKhoan: insertId },
    };
  } catch (error) {
    return { errCode: 1, message: "Lỗi hệ thống khi tạo" };
  }
};

const deleteEmployeeService = async (MaTaiKhoan) => {
  try {
    const affected = await EmployeeModel.deleteEmployeeById(MaTaiKhoan);
    if (affected === 0)
      return { errCode: 2, message: "Tài khoản không tồn tại" };
    return { errCode: 0, message: "Xóa thành công" };
  } catch (error) {
    return { errCode: 1, message: "Lỗi hệ thống khi xóa" };
  }
};

export default {
  getAllEmployeesService,
  createEmployeeService,
  deleteEmployeeService,
};
