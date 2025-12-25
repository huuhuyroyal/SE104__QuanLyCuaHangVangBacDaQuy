import axios from './axios';

const employeeService = {
    getAllEmployees: async () => {
        try {
            const resp = await axios.get('/api/employees');
            // Dựa trên Terminal, dữ liệu nằm trong resp.data.data
            if (resp && resp.data && resp.data.errCode === 0) {
                return resp.data.data; 
            }
            return [];
        } catch (error) {
            console.error('Lỗi lấy danh sách:', error);
            return [];
        }
    },
    // Các hàm khác giữ nguyên...
};

export default employeeService;