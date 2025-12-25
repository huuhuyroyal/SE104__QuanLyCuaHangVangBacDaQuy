import EmployeeService from "../service/employeeService.js";

const getAllEmployees = async (req, res) => {
  try {
    const response = await EmployeeService.getAllEmployeesService();
    console.log("Dữ liệu gửi về FE:", response); // Kiểm tra dòng này ở terminal backend
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

const getEmployeeDetail = async (req, res) => {
  try {
    const { MaTaiKhoan } = req.params;
    const response = await EmployeeService.getEmployeeDetailService(MaTaiKhoan);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

const createEmployee = async (req, res) => {
  try {
    const data = req.body;
    const response = await EmployeeService.createEmployeeService(data);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { MaTaiKhoan } = req.params;
    const response = await EmployeeService.deleteEmployeeService(MaTaiKhoan);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

export default { getAllEmployees, getEmployeeDetail, createEmployee, deleteEmployee };
