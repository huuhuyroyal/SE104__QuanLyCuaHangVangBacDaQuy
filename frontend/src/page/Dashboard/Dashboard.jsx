import React from "react";
import "./Dashboard.css";

// Update import paths for react-icons and recharts
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

const data1 = [
  {
    name: "Tháng 1",
    last: 4000,
    now: 2400,
  },
  {
    name: "Tháng 2",
    last: 3000,
    now: 1398,
  },
  {
    name: "Tháng 3",
    last: 2000,
    now: 9800,
  },
  {
    name: "Tháng 4",
    last: 2780,
    now: 3908,
  },
  {
    name: "Tháng 5",
    last: 1890,
    now: 4800,
  },
  {
    name: "Tháng 6",
    last: 2390,
    now: 3800,
  },
  {
    name: "Tháng 7",
    last: 3490,
    now: 4300,
  },
  {
    name: "Tháng 8",
    last: 2000,
    now: 9800,
  },
  {
    name: "Tháng 9",
    last: 2780,
    now: 3908,
  },
  {
    name: "Tháng 10",
    last: 1890,
    now: 4800,
  },
  {
    name: "Tháng 11",
    last: 2000,
    now: 9800,
  },
  {
    name: "Tháng 12",
    last: 2780,
    now: 3908,
  },
];

const data2 = [
  {
    name: "Tháng 1",
    last: 4000,
    now: 2400,
  },
  {
    name: "Tháng 2",
    last: 3000,
    now: 1398,
  },
  {
    name: "Tháng 3",
    last: 2000,
    now: 9800,
  },
  {
    name: "Tháng 4",
    last: 2780,
    now: 3908,
  },
  {
    name: "Tháng 5",
    last: 1890,
    now: 4800,
  },
  {
    name: "Tháng 6",
    last: 2390,
    now: 3800,
  },
  {
    name: "Tháng 7",
    last: 3490,
    now: 4300,
  },
  {
    name: "Tháng 8",
    last: 2000,
    now: 9800,
  },
  {
    name: "Tháng 9",
    last: 2780,
    now: 3908,
  },
  {
    name: "Tháng 10",
    last: 1890,
    now: 4800,
  },
  {
    name: "Tháng 11",
    last: 2000,
    now: 9800,
  },
  {
    name: "Tháng 12",
    last: 2780,
    now: 3908,
  },
];
const data3 = [
  {
    name: "Hoa tai",
    last: 4000,
    now: 2400,
  },
  {
    name: "Vòng cổ",
    last: 3000,
    now: 1398,
  },
  {
    name: "Vòng tay",
    last: 2000,
    now: 9800,
  },
  {
    name: "Nhẫn",
    last: 2780,
    now: 3908,
  },
];

const Dashboard = () => {
  return (
    <main className="main-container">
      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>SẢN PHẨM</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>300</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>DANH MỤC</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>12</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>KHÁCH HÀNG</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>33</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>THÔNG BÁO</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>42</h1>
        </div>
      </div>

      <div className="charts-container">
        {/* Container cho Line Chart */}
        <div className="chart-line">
          <h3>Doanh thu năm</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data1}
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 50,
              }}
            >
              <Legend
                formatter={(value) => {
                  if (value === "now") return "Năm 2025";
                  if (value === "last") return "Năm 2024";
                  return value;
                }}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="now"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="last" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-below">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            {/* Bar Chart - Bên trái */}
            <div
              className="chart-bar"
              style={{ width: "48%", height: "300px" }}
            >
              <h3>Đơn hàng mới</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data2}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 50,
                  }}
                >
                  <Legend
                    formatter={(value) => {
                      if (value === "now") return "Hoàn thành";
                      if (value === "last") return "Đã hủy";
                      return value;
                    }}
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Bar dataKey="now" fill="#8884d8" />
                  <Bar dataKey="last" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Bên phải */}
            <div
              className="chart-pie"
              style={{ width: "48%", height: "300px" }}
            >
              <h3>Doanh thu trên danh mục sản phẩm</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data3}
                    dataKey="now"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
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
