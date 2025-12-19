import {
  getStatsService,
  getRevenueAnalyticsService,
  getCategoryAnalyticsService,
  getOrderAnalyticsService,
} from "../service/dashboardService.js";

const getStats = async (req, res) => {
  try {
    const response = await getStatsService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ errCode: -1, message: "Lỗi nội bộ Server" });
  }
};

const getRevenueAnalytics = async (req, res) => {
  try {
    const response = await getRevenueAnalyticsService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ errCode: -1, message: "Lỗi nội bộ Server" });
  }
};

const getCategoryAnalytics = async (req, res) => {
  try {
    const response = await getCategoryAnalyticsService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ errCode: -1, message: "Lỗi nội bộ Server" });
  }
};

const getOrderAnalytics = async (req, res) => {
  try {
    const response = await getOrderAnalyticsService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ errCode: -1, message: "Lỗi nội bộ Server" });
  }
};

export default {
  getStats,
  getRevenueAnalytics,
  getCategoryAnalytics,
  getOrderAnalytics,
};
