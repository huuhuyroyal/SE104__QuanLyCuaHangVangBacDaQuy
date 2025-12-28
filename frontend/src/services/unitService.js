import axios from "./axios";

const unitService = {
  // Lấy tất cả đơn vị tính
  getAllUnits: async () => {
    try {
      const response = await axios.get("/api/units");
      return response;
    } catch (error) {
      return error.response && error.response.data ? error.response.data : { errCode: 1, message: error.message };
    }
  },

  // Tìm kiếm đơn vị tính
  searchUnits: async (searchText) => {
    try {
      const response = await axios.get("/api/units/search", {
        params: { q: searchText },
      });
      return response;
    } catch (error) {
      return error.response && error.response.data ? error.response.data : { errCode: 1, message: error.message };
    }
  },

  // Lấy đơn vị tính theo ID
  getUnitById: async (id) => {
    try {
      const response = await axios.get(`/api/units/${id}`);
      return response;
    } catch (error) {
      return error.response && error.response.data ? error.response.data : { errCode: 1, message: error.message };
    }
  },

  // Tạo đơn vị tính mới
  createUnit: async (data) => {
    try {
      const response = await axios.post("/api/units", data);
      return response;
    } catch (error) {
      return error.response && error.response.data ? error.response.data : { errCode: 1, message: error.message };
    }
  },

  // Lấy mã đơn vị tính mới
  getNextCode: async () => {
    try {
      const response = await axios.get("/api/units/next-code");
      return response;
    } catch (error) {
      return error.response && error.response.data ? error.response.data : { errCode: 1, message: error.message };
    }
  },

  // Cập nhật đơn vị tính
  updateUnit: async (id, data) => {
    try {
      const response = await axios.put(`/api/units/${id}`, data);
      return response;
    } catch (error) {
      return error.response && error.response.data ? error.response.data : { errCode: 1, message: error.message };
    }
  },

  // Xóa đơn vị tính
  deleteUnit: async (id) => {
    try {
      const response = await axios.delete(`/api/units/${id}`);
      return response;
    } catch (error) {
      return error.response && error.response.data ? error.response.data : { errCode: 1, message: error.message };
    }
  },
};

export default unitService;
