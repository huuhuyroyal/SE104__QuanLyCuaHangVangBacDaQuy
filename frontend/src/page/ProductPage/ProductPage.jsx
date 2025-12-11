import React, { useState, useEffect } from "react";
import { Table, Tag, Input, Button, Select, Modal, message } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "./ProductPage.css";
import getAllProductsService, {
  deleteProductsService,
  activateProductService,
} from "../../services/productService";

const ProductPage = () => {
  // khởi tạo dữ liệu cho search
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [searchText, setSearchText] = useState("");
  // Khỏi tạo cho nút xóa
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
      const res = await getAllProductsService();
      if (res && res.errCode === 0) {
        const formattedData = res.data.map((item) => ({
          key: item.MaSanPham,
          ProductName: item.TenSanPham,
          ProductID: item.MaSanPham,
          category: categoryMap[item.MaLoaiSanPham],
          stock: item.SoLuongTon,
          price: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(Number(item.DonGiaBanRa)),
          image: item.HinhAnh || "https://via.placeholder.com/40",
          isDelete: item.isDelete || false,
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
  const handleDeleteProducts = () => {
    if (state.selectedProducts.length === 0) return;
    Modal.confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa ${state.selectedProducts.length} sản phẩm này không?`,
      okText: "Xóa ngay",
      okType: "danger",
      cancelText: "Hủy",

      // Khi người dùng bấm nút "Xóa ngay"
      onOk: async () => {
        setLoading(true); // Bật loading trang
        try {
          const res = await deleteProductsService(state.selectedProducts);
          if (res && res.errCode === 0) {
            message.success("Xóa thành công!");
            // 1. Xóa xong thì bỏ chọn các dòng
            setState({ selectedProducts: [] });
            // 2. Gọi lại API lấy danh sách mới nhất để cập nhật bảng
            await fetchData();
          } else {
            message.error(res.message || "Xóa thất bại!");
          }
        } catch (error) {
          console.error(error);
          message.error("Có lỗi xảy ra khi xóa!");
        } finally {
          setLoading(false);
        }
      },
    });
  };
  const handleActivate = async (id) => {
    try {
      setLoading(true);
      const res = await activateProductService(id);

      if (res && res.errCode === 0) {
        message.success("Đã kích hoạt lại sản phẩm!");
        await fetchData(); // Load lại bảng để thấy trạng thái thay đổi
      } else {
        message.error(res.message || "Kích hoạt thất bại");
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi kích hoạt");
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
            <Button
              type="active"
              size="small"
              ghost
              onClick={() => handleActivate(record.ProductID)}
            >
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
              onClick={handleDeleteProducts}
            >
              Xóa
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
            selectedRowKeys: state.selectedProducts,
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
