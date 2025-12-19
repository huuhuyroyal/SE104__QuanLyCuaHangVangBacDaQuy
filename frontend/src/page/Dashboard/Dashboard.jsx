import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import dashboardService from "../../services/dashboardService";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    customers: 0,
    orders: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm điền tháng(nếu tháng không bán được hàng thì sẽ tự động thêm số vì nếu không có thì chart sẽ bị dồn, khuyết tháng)
  const fillMissingMonths = (data, valueKeys) => {
    const fullYear = [];
    for (let i = 1; i <= 12; i++) {
      const found = data.find(
        (item) => parseInt(item.thang || item.name) === i
      );

      if (found) {
        fullYear.push({ ...found, name: `Tháng ${i}` });
      } else {
        const emptyObj = { name: `Tháng ${i}` };
        valueKeys.forEach((key) => (emptyObj[key] = 0));
        fullYear.push(emptyObj);
      }
    }
    return fullYear;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resStats, resRevenue, resCategory, resOrders] =
          await Promise.all([
            dashboardService.getStats(),
            dashboardService.getRevenueData(),
            dashboardService.getCategoryData(),
            dashboardService.getOrderData(),
          ]);
        if (resStats && resStats.errCode === 0) {
          setStats(resStats.data);
        }

        // Line Chart
        if (resRevenue && resRevenue.errCode === 0) {
          const rawData = resRevenue.data.map((item) => ({
            ...item,
            now: Number(item.now),
            last: Number(item.last),
          }));
          setRevenueData(fillMissingMonths(rawData, ["now", "last"]));
        }

        // Pie Chart
        if (resCategory && resCategory.errCode === 0) {
          const rawCat = resCategory.data.map((item) => ({
            name: item.name,
            value: Number(item.value),
          }));
          setCategoryData(rawCat);
        }

        // Bar Chart
        if (resOrders && resOrders.errCode === 0) {
          const rawOrd = resOrders.data.map((item) => ({
            ...item,
            now: Number(item.now),
            last: Number(item.last),
          }));
          setOrderData(fillMissingMonths(rawOrd, ["now", "last"]));
        }
      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading)
    return (
      <div className="loading-container" style={{ padding: "20px" }}>
        Đang tải dữ liệu thực tế...
      </div>
    );

  return (
    <main className="main-container">
      {/* các thẻ */}
      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>SẢN PHẨM</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>{stats.products}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>LOẠI SẢN PHẨM</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>{stats.categories}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>KHÁCH HÀNG</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{stats.customers}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>ĐƠN HÀNG</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>{stats.orders}</h1>
        </div>
      </div>

      <div className="charts-container">
        {/* line chart */}
        <div className="chart-line">
          <h3>Doanh thu theo tháng</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={revenueData} margin={{ right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("vi-VN", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(value)
                }
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="now"
                name="Năm 2025"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="last"
                name="Năm 2024"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-below">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {/* bar chart */}
            <div
              className="chart-bar"
              style={{
                flex: 1,
                minWidth: "400px",
                height: "300px",
                backgroundColor: "#fff",
                borderRadius: "5px",
              }}
            >
              <h3>Số lượng đơn hàng</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="now" name="Năm 2025" fill="#8884d8" />
                  <Bar dataKey="last" name="Năm 2024" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* pie chart */}
            <div
              className="chart-pie"
              style={{
                flex: 1,
                minWidth: "400px",
                height: "300px",
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <h3>Tỷ trọng doanh thu theo danh mục (Năm 2025)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
