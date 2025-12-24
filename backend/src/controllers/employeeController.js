import EmployeeService from "../service/employeeService.js";

const getAllEmployees = async (req, res) => {
  try {
    const response = await EmployeeService.getAllEmployeesService();
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

const getEmployeeDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await EmployeeService.getEmployeeDetailService(id);
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
    const { id } = req.params;
    const response = await EmployeeService.deleteEmployeeService(id);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
  }
};

export default { getAllEmployees, getEmployeeDetail, createEmployee, deleteEmployee };
