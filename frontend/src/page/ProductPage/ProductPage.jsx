import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Button,
  Select,
  Modal,
  message,
  Form,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./ProductPage.css";
import getAllProductsService, {
  deleteProductsService,
  activateProductService,
  createNewProductService,
  getAllCategoriesService,
  updateProductService,
} from "../../services/productService";
import { checkActionPermission } from "../../utils/checkRole";

const ProductPage = () => {
  // khởi tạo state
  const [data, setData] = useState([]); // Khởi tạo mảng rỗng để tránh lỗi
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [state, setState] = useState({ selectedProducts: [] });
  const [loading, setLoading] = useState(false);

  const [fileList, setFileList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  // Lấy thông tin user để check quyền
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.Role;
  // load data lần đầu
  useEffect(() => {
    const initPage = async () => {
      await fetchCategories();
      await fetchData();
    };
    initPage();
  }, []);

  // LẤY DANH MỤC
  const fetchCategories = async () => {
    try {
      const res = await getAllCategoriesService();
      if (res && res.errCode === 0) {
        const rawCategories = res.data;

        const options = rawCategories.map((item) => {
          const value = item.MaLoaiSanPham;
          const label = item.TenLoaiSanPham;

          return {
            label: label,
            value: value,
          };
        });
        setCategories(options);
      }
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    }
  };

  // LẤY DANH SÁCH SẢN PHẨM
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllProductsService();
      if (res && res.errCode === 0) {
        const formattedData = res.data.map((item) => ({
          key: item.MaSanPham,
          ProductName: item.TenSanPham,
          ProductID: item.MaSanPham,
          category: item.TenLoaiSanPham || "Chưa phân loại",
          categoryId: item.MaLoaiSanPham,
          stock: item.SoLuongTon,
          price: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(Number(item.DonGiaBanRa)),
          image: item.HinhAnh,
          isDelete: item.isDelete === 1 || item.isDelete === true,
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

  //XỬ LÝ XÓA
  const handleDeleteProducts = () => {
    if (!checkActionPermission(["admin"], false))
      return message.error("Liên hệ admin để thực hiện xóa sản phẩm");
    if (state.selectedProducts.length === 0) return;
    const selectedItems = data.filter((item) =>
      state.selectedProducts.includes(item.ProductID)
    );

    const activeItems = selectedItems.filter((item) => !item.isDelete);
    const inactiveItems = selectedItems.filter((item) => item.isDelete);

    let title = "";
    let content = "";
    let okText = "";
    let okType = "danger";

    if (activeItems.length > 0 && inactiveItems.length === 0) {
      title = "Xác nhận tắt hoạt động";
      content = `Bạn có chắc chắn muốn ngừng kinh doanh ${activeItems.length} sản phẩm này? Sản phẩm sẽ chuyển sang trạng thái "Đã đóng".`;
      okText = "Tắt hoạt động";
    } else if (activeItems.length === 0 && inactiveItems.length > 0) {
      // Chỉ chọn cái đã đóng -> Hỏi xóa vĩnh viễn
      title = "Cảnh báo xóa vĩnh viễn";
      content = `Bạn có chắc chắn muốn XÓA VĨNH VIỄN ${inactiveItems.length} sản phẩm này? `;
      okText = "Xóa vĩnh viễn";
    }

    Modal.confirm({
      title: title,
      icon: <ExclamationCircleOutlined />,
      content: content,
      okText: okText,
      okType: okType,
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          const res = await deleteProductsService(state.selectedProducts);
          if (res && res.errCode === 0) {
            message.success(res.message);
            setState({ selectedProducts: [] });
            await fetchData();
          } else if (res && res.errCode === 2) {
            message.warning(res.message, 5);
            setState({ selectedProducts: [] });
            await fetchData();
          } else {
            message.error(res.message || "Xóa thất bại!");
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  //XỬ LÝ KÍCH HOẠT LẠI
  const handleActivate = async (id) => {
    if (!checkActionPermission(["admin", "warehouse"])) return;
    try {
      setLoading(true);
      const res = await activateProductService(id);
      if (res && res.errCode === 0) {
        message.success("Đã kích hoạt lại sản phẩm!");
        await fetchData();
      } else {
        message.error(res.message || "Kích hoạt thất bại");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // XỬ LÝ THÊM MỚI
  const handleCreateProduct = () => {
    if (!checkActionPermission(["admin", "warehouse"])) return;
    setIsEditMode(false);
    setIsModalOpen(true);
    form.resetFields();
    setFileList([]);
  };

  const handleCreateOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append("MaSanPham", values.MaSanPham);
      formData.append("TenSanPham", values.TenSanPham);
      formData.append("MaLoaiSanPham", values.MaLoaiSanPham);
      // Xử lý khi upload ảnh
      if (fileList.length > 0) {
        const file = fileList[0];

        if (file.originFileObj) {
          formData.append("HinhAnh", file.originFileObj);
        } else if (file instanceof File) {
          formData.append("HinhAnh", file);
        } else if (file.url) {
          formData.append("HinhAnh", file.url);
        }
      }

      let res;
      if (isEditMode) {
        res = await updateProductService(formData);
      } else {
        res = await createNewProductService(formData);
      }

      if (res && res.errCode === 0) {
        message.success(
          isEditMode ? "Cập nhật thành công!" : "Thêm thành công!"
        );
        setIsModalOpen(false);
        form.resetFields();
        setFileList([]);
        await fetchData();
      } else {
        message.error(res.message || "Thao tác thất bại");
      }
    } catch (error) {
      console.log("Validate Failed:", error);
    } finally {
      setLoading(false);
    }
  };
  // Hàm xử lý edit
  const handleEditProduct = (record) => {
    if (!checkActionPermission(["admin", "warehouse"])) return;
    setIsEditMode(true);
    setIsModalOpen(true);
    // Đổ dữ liệu cũ vào Form
    form.setFieldsValue({
      MaSanPham: record.ProductID,
      TenSanPham: record.ProductName,
      MaLoaiSanPham: record.categoryId,
    });

    // Xử lý hiển thị ảnh cũ
    if (record.image) {
      setFileList([
        {
          uid: "-1",
          name: "Ảnh hiện tại",
          status: "done",
          url: record.image,
        },
      ]);
    } else {
      setFileList([]);
    }
  };

  const handleCreateCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
  };

  // CẤU HÌNH TABLE & FILTER
  const uploadProps = {
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    onRemove: () => setFileList([]),
    fileList,
  };

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

  const filterOptions = categories.map((c) => ({
    text: c.label,
    value: c.label,
  }));

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "ProductName",
      key: "ProductName",
      render: (text, record) => (
        <div
          className="edit-product"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
          onClick={() => handleEditProduct(record)}
        >
          <img
            src={record.image}
            alt={record.ProductName}
            style={{
              width: 40,
              height: 40,
              objectFit: "cover",
              borderRadius: "4px",
              border: "1px solid #eee",
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
      filters: filterOptions,
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
            onChange={handleSearchChange}
          />

          <div className="delete-section">
            <Button
              danger
              icon={<DeleteOutlined />}
              className="delete-all-button"
              disabled={state.selectedProducts.length === 0}
              onClick={handleDeleteProducts}
            >
              Xóa{" "}
              {state.selectedProducts.length > 0
                ? `(${state.selectedProducts.length})`
                : ""}
            </Button>
          </div>
          <div className="add-section">
            <Button
              type="primary"
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
          locale={{
            emptyText: "Không có sản phẩm nào giống với từ khóa tìm kiếm",
          }}
        />

        {/*Modal thêm/sửa sản phẩm*/}
        <Modal
          title={isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
          open={isModalOpen}
          onOk={handleCreateOk}
          onCancel={handleCreateCancel}
          okText={isEditMode ? "Lưu thay đổi" : "Thêm sản phẩm"}
          cancelText="Hủy"
          confirmLoading={loading}
        >
          <Form form={form} layout="vertical" name="form_product">
            <Form.Item
              name="MaSanPham"
              label="Mã sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập Mã sản phẩm!" },
                {
                  validator: (_, value) => {
                    if (isEditMode) return Promise.resolve();
                    const isDuplicate = data.some(
                      (item) => item.ProductID === value
                    );
                    if (isDuplicate)
                      return Promise.reject("Mã này đã tồn tại!");
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                placeholder="SP01"
                disabled={isEditMode}
                style={
                  isEditMode
                    ? { color: "#000", backgroundColor: "#f5f5f5" }
                    : {}
                }
              />
            </Form.Item>

            <Form.Item
              name="TenSanPham"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <Input placeholder="Nhẫn Kim Cương" />
            </Form.Item>

            <Form.Item
              name="MaLoaiSanPham"
              label="Loại sản phẩm"
              rules={[
                { required: true, message: "Vui lòng chọn loại sản phẩm!" },
              ]}
            >
              <Select placeholder="Chọn loại sản phẩm" options={categories} />
            </Form.Item>

            <Form.Item label="Hình ảnh sản phẩm">
              <Upload {...uploadProps} listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />}>
                  {isEditMode ? "Thay đổi ảnh" : "Thêm ảnh"}
                </Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ProductPage;
