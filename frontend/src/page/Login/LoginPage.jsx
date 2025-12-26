import React, { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { handleLoginApi } from "../../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await handleLoginApi(values.username, values.password);
      if (res && res.errCode === 0) {
        message.success("Đăng nhập thành công!");
        localStorage.setItem("accessToken", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        const role = res.user.Role;

        if (role === "admin") {
          navigate("/Dashboard"); // Trang chủ của Admin
        } else if (role === "seller") {
          navigate("/Dashboard"); // Trang bán hàng của nhân viên bán hàng
        } else if (role === "warehouse") {
          navigate("/InventoryReport"); // Trang kho của thủ kho
        } else {
          navigate("/"); // Mặc định
        }
      } else {
        message.error(res.message);
      }
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.message || "Lỗi server không xác định";
        message.error(`Lỗi ${error.response.status}: ${msg}`);
      } else if (error.request) {
        console.log(" Không nhận được phản hồi từ Server");
        message.error(
          "Không thể kết nối Server! Kiểm tra lại Backend xem đã chạy chưa?"
        );
      } else {
        console.log("Lỗi Setup:", error.message);
        message.error("Lỗi Frontend: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card
        title="ĐĂNG NHẬP HỆ THỐNG"
        bordered={false}
        style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
      >
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập Tên tài khoản!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Tên tài khoản"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập Mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
              block
              style={{
                color: "white",
              }}
            >
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
