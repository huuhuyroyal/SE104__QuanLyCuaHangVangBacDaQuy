import DashboardModel from "../models/dashboardModel.js";

export const getStatsService = async () => {
  try {
    const data = await DashboardModel.getStats();
    return {
      errCode: 0,
      message: "OK",
      data: data,
    };
  } catch (error) {
    console.error("Lỗi Service Dashboard:", error);
    return {
      errCode: 1,
      message: "Lỗi Server",
    };
  }
};

export const getRevenueAnalyticsService = async () => {
  try {
    const data = await DashboardModel.getRevenueAnalytics();
    return {
      errCode: 0,
      message: "OK",
      data: data,
    };
  } catch (error) {
    return {
      errCode: 1,
      message: "Lỗi Server",
    };
  }
};

export const getCategoryAnalyticsService = async () => {
  try {
    const data = await DashboardModel.getCategoryAnalytics();
    return {
      errCode: 0,
      message: "OK",
      data: data,
    };
  } catch (error) {
    return {
      errCode: 1,
      message: "Lỗi Server",
    };
  }
};

export const getOrderAnalyticsService = async () => {
  try {
    const data = await DashboardModel.getOrderAnalytics();
    return {
      errCode: 0,
      message: "OK",
      data: data,
    };
  } catch (error) {
    return {
      errCode: 1,
      message: "Lỗi Server",
    };
  }
};

export default {
  getStatsService,
  getRevenueAnalyticsService,
  getCategoryAnalyticsService,
  getOrderAnalyticsService,
};
