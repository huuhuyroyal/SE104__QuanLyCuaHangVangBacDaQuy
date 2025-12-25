import EmployeeService from "../service/employeeService.js";

export const getAllEmployees = async (req, res) => {
  const response = await EmployeeService.getAllEmployeesService();
  return res.status(200).json(response);
};

export const createEmployee = async (req, res) => {
  const response = await EmployeeService.createEmployeeService(req.body);
  return res.status(200).json(response);
};

export const deleteEmployee = async (req, res) => {
  const { MaTaiKhoan } = req.params;
  const response = await EmployeeService.deleteEmployeeService(MaTaiKhoan);
  return res.status(200).json(response);
};
