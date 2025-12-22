import axios from "./axios";
const InventoryReportService = {
  getReport: (month, year) => {
    return axios.get("/api/report", {
      params: { month: month, year: year },
    });
  },
};

export default InventoryReportService;
