import React from "react";
import "./Logout.css";

const Logout = ({ onConfirm, onCancel }) => {
  return (
    <div className="logout-overlay" onClick={onCancel}>
      <div className="logout-box" onClick={(e) => e.stopPropagation()}>
        <span>Bạn có chắc muốn đăng xuất</span>
        <div className="logout-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Hủy
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
