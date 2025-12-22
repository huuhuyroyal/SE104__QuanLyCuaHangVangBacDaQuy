import React, { useState } from "react";
import { Table, DatePicker, Button, message } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import InventoryReportService from "../../services/InventoryReport";
import "./InventoryReport.css";

const InventoryReport = () => {
  // State
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // call api
  const handleCreateReport = async () => {
    if (!selectedMonth) {
      message.error("Vui lòng chọn Tháng/Năm để lập báo cáo!");
      return;
    }

    setLoading(true);
    try {
      const month = selectedMonth.month() + 1;
      const year = selectedMonth.year();

      // Gọi API qua Service
      const response = await InventoryReportService.getReport(month, year);
      console.log("Response Report:", response);

      if (response && response.success) {
        const rawItems = response.data.items;

        // Mapping dữ liệu
        const mappedData = rawItems.map((item) => ({
          key: item.maSanPham,
          ProductName: item.tenSanPham,
          ProductID: item.maSanPham,
          first_stock: item.tonDau,
          buy: item.nhap,
          final_stock: item.tonCuoi,
          DVT: item.dvt,
        }));

        setReportData(mappedData);
        message.success(`Đã lập báo cáo cho tháng ${month}/${year}`);
      }
    } catch (error) {
      console.error("Lỗi lấy báo cáo:", error);
      message.error("Không thể lấy dữ liệu. Kiểm tra server!");
    } finally {
      setLoading(false);
    }
  };

  // cấu hình bảng
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
      {/* Menu chọn */}
      <div className="toolbar">
        <DatePicker
          picker="month"
          placeholder="Chọn tháng/năm"
          format="MM/YYYY"
          onChange={(date) => setSelectedMonth(date)}
        />

        {/* Nút Tạo Báo Cáo */}
        <Button
          type="primary"
          icon={<FileTextOutlined />}
          onClick={handleCreateReport}
          loading={loading}
        >
          Lập báo cáo
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={reportData}
        pagination={{ pageSize: 10 }}
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
