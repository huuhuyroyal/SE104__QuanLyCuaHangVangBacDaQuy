import React, { useState, useEffect } from "react";
import { Table, Tag, Input, Button, Select } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "./ProductPage.css";

const ProductPage = () => {
  // khởi tạo dữ liệu cho search
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [searchText, setSearchText] = useState("");
  // Khỏi tạo cho nút xóa(có dữ liệu mới được xóa)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [state, setState] = useState({ selectedProducts: [] });
  const [loading, setLoading] = useState(false);
  const categoryMap = {
    LSP01: "Nhẫn",
    LSP02: "Nhẫn Cưới",
    LSP03: "Dây Chuyền",
    LSP04: "Lắc Tay",
    LSP05: "Bông Tai",
    LSP06: "Vàng",
    LSP07: "Đá Quý",
    LSP08: ".",
    LSP09: "..",
    LSP10: "...",
  };
  const allCategories = Object.values(categoryMap).map((item) => ({
    text: item,
    value: item,
  }));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi xuống backend
      const response = await fetch("http://localhost:8080/api/products");
      const result = await response.json();

      if (result.data) {
        const formattedData = result.data.map((item) => ({
          key: item.MaSanPham,
          ProductName: item.TenSanPham,
          ProductID: item.MaSanPham,
          category: categoryMap[item.MaLoaiSanPham],
          stock: item.SoLuongTon,
          // Format giá tiền việt nam
          price: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(Number(item.DonGiaBanRa)),
          image: item.HinhAnh || "https://via.placeholder.com/40",
          isDelete: item.DaXoa || false,
        }));

        setData(formattedData);
        setFilteredData(formattedData);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // này mới chỉ là hàm, sau này code pop up thêm sản phẩm khi click vô
  const handleCreateProduct = () => {
    console.log("Chuyển sang trang thêm sản phẩm");
  };

  // xử lý search
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
  };

  // cấu hình table dữ liệu
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "ProductName",
      key: "ProductName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={record.image}
            alt={record.ProductName}
            style={{
              width: 40,
              height: 40,
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
          <div>{text}</div>
        </div>
      ),
    },
    { title: "Mã sản phẩm", dataIndex: "ProductID", key: "ProductID" },
    {
      title: "Phân loại",
      dataIndex: "category",
      key: "category",
      filters: allCategories,
      onFilter: (value, record) => record.category === value,
      render: (category) => <Tag color="#a91811">{category}</Tag>,
    },
    { title: "Số lượng", key: "stock", dataIndex: "stock" },
    { title: "Giá", key: "price", dataIndex: "price" },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tag color={record.isDelete ? "error" : "success"}>
            {record.isDelete ? "Đã đóng" : "Đang bán"}
          </Tag>
          {record.isDelete && (
            <Button type="primary" size="small" ghost>
              Kích hoạt
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="main">
      <div className="Product-main-content">
        <header className="Product-header">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            onChange={handleSearchChange} // Kích hoạt tìm kiếm
          />

          <div className="delete-section">
            <Button
              danger
              icon={<DeleteOutlined />}
              className="delete-all-button"
              disabled={state.selectedProducts.length === 0}
            >
              Xóa{" "}
              {state.selectedProducts.length > 0
                ? `(${state.selectedProducts.length})`
                : ""}
            </Button>
          </div>
          <div className="add-section">
            <Button
              type="add"
              icon={<PlusOutlined />}
              className="add-product"
              onClick={handleCreateProduct}
            >
              Thêm sản phẩm
            </Button>
          </div>
        </header>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 8 }}
          rowSelection={{
            onChange: (selectedRowKeys) => {
              setState({ selectedProducts: selectedRowKeys });
            },
          }}
        />
      </div>
    </div>
  );
};

export default ProductPage;
