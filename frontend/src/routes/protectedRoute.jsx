import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { message } from "antd";
import { hasMenuAccess, isAuthenticated } from "../utils/checkRole";
import { routes } from "../routes";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Check đăng nhập (Nếu chưa -> về Login)
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  const pageName =
    routes.find((route) => route.path === location.pathname)?.Title ||
    location.pathname;
  // Check quyền truy cập
  if (!hasMenuAccess(location.pathname)) {
    message.error({
      content: "Bạn không có quyền truy cập vào trang " + pageName,
      key: "permission_denied",
    });
    return <Navigate to="/Dashboard" replace />;
  }
  return children;
};

export default ProtectedRoute;
