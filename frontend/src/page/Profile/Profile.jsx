import React, { useState } from "react";
import { Form, Input, Button, message, Modal, Tag } from "antd";
import { UserOutlined, LockOutlined, EditOutlined } from "@ant-design/icons";
import profileService from "../../services/profileService";
import "./Profile.css";

const Profile = () => {
  const [currentProfile] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );
  const [loading, setLoading] = useState(false);
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const [passForm] = Form.useForm();

  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      const payload = {
        profilename: currentProfile.TenTaiKhoan,
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
      message.error("Mât khẩu cũ không đúng");
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    if (role === "admin") return { label: "Quản trị viên", color: "red" };
    if (role === "seller")
      return { label: "Nhân viên bán hàng", color: "green" };
    return { label: "Thủ kho", color: "orange" };
  };

  const roleInfo = getRoleLabel(currentProfile.Role);

  return (
    <div className="profile-container">
      <div className="profile-box">
        <div className="profile-role-tag">
          <Tag
            style={{ fontSize: "18px", padding: "5px 15px" }}
            color={roleInfo.color}
          >
            {roleInfo.label.toUpperCase()}
          </Tag>
        </div>

        <Form layout="vertical">
          <Form.Item label="Tên đăng nhập">
            <Input
              prefix={<UserOutlined />}
              value={currentProfile.TenTaiKhoan}
              readOnly
            />
          </Form.Item>

          <Form.Item label="Mật khẩu">
            <Input.Password
              prefix={<LockOutlined />}
              value="********"
              readOnly
              visibilityToggle={false}
            />
          </Form.Item>

          <Button
            type="primary"
            icon={<EditOutlined />}
            block
            onClick={() => setIsChangePassModalOpen(true)}
            style={{
              background: "#3e0703",
              borderColor: "#3e0703",
              height: "45px",
            }}
          >
            Đổi mật khẩu cá nhân
          </Button>
        </Form>

        <Modal
          title="Đổi mật khẩu"
          open={isChangePassModalOpen}
          onCancel={() => setIsChangePassModalOpen(false)}
          onOk={() => passForm.submit()}
          confirmLoading={loading}
        >
          <Form
            form={passForm}
            layout="vertical"
            onFinish={handleChangePassword}
          >
            <Form.Item
              name="oldPassword"
              label="Mật khẩu hiện tại"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[{ required: true, min: 4 }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={["newPassword"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value)
                      return Promise.resolve();
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
