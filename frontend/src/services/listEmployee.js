import axios from './axios';

const axiosInstance = axios; // shared axios instance with auth interceptor

const employeeService = {
  getAllEmployees: async () => {
    try {
      const resp = await axiosInstance.get('/api/employees');
      const payload = resp && resp.errCode === 0 ? resp.data : [];
      return payload.map((user) => ({
        key: user.MaTaiKhoan,
        id: user.MaTaiKhoan,
        employeeCode: `NV${user.MaTaiKhoan.toString().padStart(3, '0')}`,
        username: user.TenTaiKhoan,
        role:
          user.Role === "admin"
            ? "Quản lý"
            : user.Role === "seller"
            ? "Nhân viên bán hàng"
            : user.Role === "warehouse"
            ? "Nhân viên kho"
            : "Nhân viên",
      }));
    } catch (error) {
      console.error('Get all employees error:', error);
      throw error;
    }
  },

  getEmployeeById: async (id) => {
    try {
      const resp = await axiosInstance.get(`/api/employees/${id}`);
      const user = resp && resp.errCode === 0 ? resp.data : null;
      return {
        id: user.MaTaiKhoan,
        employeeCode: `NV${user.MaTaiKhoan.toString().padStart(3, '0')}`,
        username: user.TenTaiKhoan,
        role: user.Role === 'admin' ? 'Quản lý' : 
              user.Role === 'seller' ? 'Nhân viên bán hàng' : 
              user.Role === 'warehouse' ? 'Nhân viên kho' : 'Nhân viên'
      };
    } catch (error) {
      console.error('Get employee by ID error:', error);
      throw error;
    }
  },

  createEmployee: async (employeeData) => {
    try {
      const roleMapping = {
        'Quản lý': 'admin',
        'Nhân viên bán hàng': 'seller',
        'Nhân viên kho': 'warehouse'
      };

      const resp = await axiosInstance.post('/api/employees', {
        TenTaiKhoan: employeeData.username,
        MatKhau: employeeData.password,
        Role: roleMapping[employeeData.role] || "seller",
      });

      return resp;
    } catch (error) {
      console.error('Create employee error:', error);
      throw error;
    }
  },

  deleteEmployee: async (id) => {
    try {
      const resp = await axiosInstance.delete(`/api/employees/${id}`);
      return resp;
    } catch (error) {
      console.error('Delete employee error:', error);  
      throw error;
    }
  }
};

export default employeeService;