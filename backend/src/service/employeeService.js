import EmployeeModel from "../models/employeeModel.js";
import { connection } from "../config/connectDB.js"; 

// Lấy danh sách nhân viên
const getAllEmployeesService = async () => {
    try {
        const employees = await EmployeeModel.getAllEmployees(); // Gọi trực tiếp Model
        return { 
            errCode: 0, 
            message: "OK", 
            data: employees 
        };
    } catch (error) {
        console.error("Lỗi Service Employees:", error);
        return { errCode: 1, message: "Lỗi Server", data: [] };
    }
};

// Lấy chi tiết và lịch sử bán hàng
const getEmployeeDetailService = async (MaTaiKhoan) => {
    try {
        const detail = await EmployeeModel.getEmployeeStatsById(MaTaiKhoan);
        if (!detail) {
            return { errCode: 1, message: "Không tìm thấy nhân viên", data: null };
        }
        const salesHistory = await EmployeeModel.getEmployeeSalesHistory(MaTaiKhoan);
        return { 
            errCode: 0, 
            message: "OK", 
            data: { ...detail, salesHistory } 
        };
    } catch (error) {
        console.error("Lỗi Service Employee Detail:", error);
        return { errCode: 1, message: "Lỗi Server", data: null };
    }
};

// Tạo tài khoản mới
const createEmployeeService = async (data) => {
    try {
        const { TenTaiKhoan, MatKhau, Role } = data;
        
        // Kiểm tra tài khoản tồn tại dùng connection.execute
        const [existing] = await connection.execute(
            "SELECT * FROM TAIKHOAN WHERE TenTaiKhoan = ?", 
            [TenTaiKhoan]
        );
        
        if (existing.length > 0) {
            return { errCode: 3, message: "Tên tài khoản đã tồn tại" };
        }

        const insertId = await EmployeeModel.createEmployee({ TenTaiKhoan, MatKhau, Role });
        return { 
            errCode: 0, 
            message: "Thành công", 
            data: { MaTaiKhoan: insertId } 
        };
    } catch (error) {
        console.error("Lỗi Service Create Employee:", error);
        return { errCode: 1, message: "Lỗi Server" };
    }
};

// Xóa nhân viên
const deleteEmployeeService = async (MaTaiKhoan) => {
    try {
        const affected = await EmployeeModel.deleteEmployeeById(MaTaiKhoan);
        if (!affected || affected === 0) {
            return { errCode: 1, message: "Không tìm thấy nhân viên" };
        }
        return { errCode: 0, message: "Xóa nhân viên thành công" };
    } catch (error) {
        console.error("Lỗi Service Delete Employee:", error);
        return { errCode: 1, message: "Lỗi Server" };
    }
};

export default { 
    getAllEmployeesService, 
    getEmployeeDetailService, 
    createEmployeeService, 
    deleteEmployeeService 
};