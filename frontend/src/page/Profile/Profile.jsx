import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Modal,
  Table,
  Tag,
  Select,
  Popconfirm,
  Space,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import profileService from "../../services/profileService";
import "./Profile.css";

const Profile = () => {
  // Lấy thông tin user hiện tại từ localStorage đã lưu khi đăng nhập
  const [currentProfile, setCurrentProfile] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [loading, setLoading] = useState(false);

  // state cho Admin
  const [profilesList, setProfilesList] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // state cho seller và warehouse
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [passForm] = Form.useForm();

  // Load danh sách nếu là Admin
  useEffect(() => {
    if (currentProfile.Role === "admin") {
      fetchAllProfiles();
    }
  }, [currentProfile.Role]);

  // ADMIN
  const fetchAllProfiles = async () => {
    setLoading(true);
    try {
      const res = await profileService.getAllProfiles();
      if (res && res.errCode === 0) {
        setProfilesList(res.data);
      }
    } catch (error) {
      message.error("Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (values) => {
    try {
      setLoading(true);
      const res = await profileService.createProfile(values);
      if (res && res.errCode === 0) {
        message.success("Tạo tài khoản mới thành công!");
        setIsCreateModalOpen(false);
        createForm.resetFields();
        fetchAllProfiles(); // Load lại bảng
      } else {
        message.error(res.message || "Tạo thất bại (Có thể trùng tên)");
      }
    } catch (error) {
      message.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (profilename) => {
    try {
      const res = await profileService.deleteProfile(profilename);
      if (res && res.errCode === 0) {
        message.success("Đã xóa tài khoản: " + profilename);
        fetchAllProfiles();
      } else {
        message.error(res.message || "Xóa thất bại");
      }
    } catch (error) {
      message.error("Lỗi khi xóa tài khoản");
    }
  };

  // SELLER VÀ WAREHOUSE
  const handleOpenChangePass = () => {
    passForm.resetFields();
    setIsChangePassModalOpen(true);
  };

  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      const username = currentProfile.TenTaiKhoan;

      const payload = {
        profilename: username,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      const res = await profileService.changePassword(payload);
      if (res && res.errCode === 0) {
        message.success("Đổi mật khẩu thành công!");
        setIsChangePassModalOpen(false);
        passForm.resetFields();
      } else {
        message.error(res.message || "Mật khẩu cũ không đúng");
      }
    } catch (error) {
      message.error("Mật khẩu hiện tại không chính xác");
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình cột bảng cho Admin
  const adminColumns = [
    {
      title: "Tên tài khoản",
      dataIndex: "TenTaiKhoan",
      key: "TenTaiKhoan",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Mật khẩu",
      dataIndex: "MatKhau",
      key: "MatKhau",
      width: 220,
      render: (pass) => (
        <Input.Password
          value={pass}
          readOnly
          bordered={false}
          style={{
            cursor: "default",
            background: "transparent",
            maxWidth: "100%",
          }}
        />
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "Role",
      key: "Role",
      render: (role) => {
        let color = "blue";
        let label = role;
        if (role === "admin") {
          color = "red";
          label = "Quản trị viên";
        } else if (role === "seller") {
          color = "green";
          label = "Bán hàng";
        } else if (role === "warehouse") {
          color = "orange";
          label = "Thủ kho";
        }
        return <Tag color={color}>{label ? label.toUpperCase() : ""}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          {/* Không cho xóa chính mình*/}
          {record.TenTaiKhoan !== currentProfile.TenTaiKhoan && (
            <Popconfirm
              title="Xóa tài khoản?"
              description={`Bạn chắc chắn muốn xóa ${record.TenTaiKhoan}?`}
              onConfirm={() => handleDeleteProfile(record.TenTaiKhoan)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button danger icon={<DeleteOutlined />} size="small">
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Render
  return (
    <div className="profile-container">
      {/* ADMIN*/}
      {currentProfile.Role === "admin" ? (
        <div className="admin-profile-container">
          <div className="admin-header">
            <h2>
              <SafetyCertificateOutlined /> Quản lý tài khoản
            </h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
              style={{ background: "#a91811", borderColor: "#a91811" }}
            >
              Tạo tài khoản mới
            </Button>
          </div>

          <Table
            columns={adminColumns}
            dataSource={profilesList}
            rowKey="TenTaiKhoan"
            loading={loading}
            pagination={{ pageSize: 6 }}
          />

          {/* Modal Tạo Profile (Admin) */}
          <Modal
            title="Tạo tài khoản nhân viên mới"
            open={isCreateModalOpen}
            onCancel={() => setIsCreateModalOpen(false)}
            onOk={() => createForm.submit()}
            confirmLoading={loading}
            okText="Tạo mới"
            cancelText="Hủy"
          >
            <Form
              form={createForm}
              layout="vertical"
              onFinish={handleCreateProfile}
            >
              <Form.Item
                name="TenTaiKhoan"
                label="Tên tài khoản"
                rules={[
                  { required: true, message: "Vui lòng nhập tên tài khoản" },
                  { min: 4, message: "Tên tài khoản ít nhất 4 ký tự" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Ví dụ: banhang01"
                />
              </Form.Item>

              <Form.Item
                name="MatKhau"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu"
                />
              </Form.Item>

              <Form.Item
                name="Role"
                label="Chức vụ"
                rules={[{ required: true, message: "Vui lòng chọn quyền" }]}
                initialValue="seller"
              >
                <Select>
                  <Select.Option value="seller">
                    Nhân viên bán hàng (Seller)
                  </Select.Option>
                  <Select.Option value="warehouse">
                    Thủ kho (Warehouse)
                  </Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      ) : (
        /* SELLER AND WAREHOUSE */
        <div className="profile-box">
          <div className="profile-role-tag">
            <Tag
              style={{ fontSize: "20px" }}
              color={currentProfile.Role === "seller" ? "green" : "orange"}
            >
              {currentProfile.Role === "seller"
                ? "Nhân viên bán hàng"
                : "Thủ kho"}
            </Tag>
          </div>

          <Form layout="vertical">
            <Form.Item label="Tên đăng nhập">
              <Input
                prefix={<UserOutlined />}
                value={currentProfile.TenTaiKhoan || ""}
                readOnly
                style={{
                  color: "#000",
                  backgroundColor: "#fff",
                  cursor: "default",
                }}
              />
            </Form.Item>

            <Form.Item label="Mật khẩu">
              <Input.Password
                prefix={<LockOutlined />}
                value="********"
                readOnly
                style={{ cursor: "default", backgroundColor: "#fff" }}
                visibilityToggle={false}
              />
            </Form.Item>

            <Button
              type="primary"
              icon={<EditOutlined />}
              block
              style={{
                marginTop: 15,
                background: "#3e0703",
                borderColor: "#3e0703",
                height: "40px",
              }}
              onClick={handleOpenChangePass}
            >
              Đổi mật khẩu
            </Button>
          </Form>

          {/* Modal Đổi Mật Khẩu (Seller và Warehouse) */}
          <Modal
            title="Đổi mật khẩu cá nhân"
            open={isChangePassModalOpen}
            onCancel={() => setIsChangePassModalOpen(false)}
            onOk={() => passForm.submit()}
            confirmLoading={loading}
            okText="Cập nhật"
            cancelText="Hủy"
          >
            <Form
              form={passForm}
              layout="vertical"
              onFinish={handleChangePassword}
            >
              <Form.Item
                name="oldPassword"
                label="Mật khẩu hiện tại"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu cũ" },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu đang dùng" />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới" },
                  { min: 1, message: "Mật khẩu không được để trống" },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu mới lần nữa" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Profile;
