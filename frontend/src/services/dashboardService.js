import axios from "./axios";
const dashboardService = {
  getStats: () => axios.get("/api/dashboard/stats"),
  getRevenueData: () => axios.get("/api/dashboard/revenue"),
  getCategoryData: () => axios.get("/api/dashboard/category"),
  getOrderData: () => axios.get("/api/dashboard/orders"),
};

export default dashboardService;
