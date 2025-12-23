import React, { useState } from "react";
import { Table, DatePicker, Button, message, Input } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./InventoryReport.css";

const InventoryReport = () => {
  // 1. STATE MANAGEMENT
  const [selectedMonth, setSelectedMonth] = useState(null); // Save selected month
  const [reportData, setReportData] = useState([]); // Data displayed in the table
  const [loading, setLoading] = useState(false); // Loading state

  // Mock data
  const initialData = [
    {
      key: "1",
      ProductName: "Nhẫn kim cương",
      ProductID: "ID001",
      first_stock: "100",
      final_stock: "50",
      buy: "30",
      DVT: "Cái",
    },
    {
      key: "2",
      ProductName: "Dây chuyền bạc",
      ProductID: "ID002",
      first_stock: "50",
      final_stock: "40",
      buy: "50",
      DVT: "Sợi",
    },
    {
      key: "3",
      ProductName: "Bông tai đá",
      ProductID: "ID003",
      first_stock: "20",
      final_stock: "50",
      buy: "60",
      DVT: "Cặp",
    },
    {
      key: "4",
      ProductName: "Vàng SJC",
      ProductID: "VSJ004",
      first_stock: "20",
      final_stock: "150",
      buy: "200",
      DVT: "Miếng",
    },
  ];

  // Create report function
  const handleCreateReport = () => {
    if (!selectedMonth) {
      message.error("Vui lòng chọn Tháng/Năm để lập báo cáo!");
      return;
    }
    setLoading(true);

    // set simulated load time to 1s; replace with backend call when ready
    setTimeout(() => {
      const monthString = selectedMonth.format("MM/YYYY");
      message.success(`Đã lập báo cáo cho tháng ${monthString}`);
      setReportData(initialData);
      setLoading(false);
    }, 500);
  };

  // Table configuration
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "ProductName",
      key: "ProductName",
    },
    {
      title: "Tồn đầu",
      dataIndex: "first_stock",
      key: "first_stock",
    },
    { title: "Số lượng mua vào", dataIndex: "buy", key: "buy" },
    {
      title: "Số lượng bán ra",
      key: "sales",
      render: (_, record) => {
        const tonDau = parseInt(record.first_stock) || 0;
        const muaVao = parseInt(record.buy) || 0;
        const tonCuoi = parseInt(record.final_stock) || 0;
        return <span>{tonDau + muaVao - tonCuoi}</span>;
      },
    },
    {
      title: "Tồn cuối",
      dataIndex: "final_stock",
      key: "final_stock",
    },
    { title: "Đơn vị tính", dataIndex: "DVT", key: "DVT" },
  ];

  return (
    <div className="container">
      {/* Selection menu */}
      <div className="toolbar">
        <DatePicker
          picker="month"
          placeholder="Chọn tháng/năm"
          format="MM/YYYY"
          onChange={(date) => setSelectedMonth(date)}
        />

        {/* Create Report button */}
        <Button
          type="primary"
          icon={<FileTextOutlined />}
          onClick={handleCreateReport}
        >
          Lập báo cáo
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={reportData}
        pagination={{ pageSize: 5 }}
        loading={loading}
        bordered
        locale={{
          emptyText: "Vui lòng chọn tháng và bấm 'Lập báo cáo' để xem dữ liệu",
        }}
      />
    </div>
  );
};

export default InventoryReport;
