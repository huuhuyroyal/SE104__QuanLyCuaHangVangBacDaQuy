import React, { useState } from 'react';
import Topbar from '../../components/Topbar/Topbar';
import './Profile.css';

const Personal = () => {
  // State to manage input fields
  const [username, setUsername] = useState('admin10diem');
  const [email, setEmail] = useState('nhom10diem@gmail.com');
  

  // State to manage modal visibility and password data
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');


  // Function to show modal
  const showModal = () => {
    setModalVisible(true);
  };


  // Function to hide modal
  const hideModal = () => {
    setModalVisible(false);
    setPasswordError(''); // Reset error when closing modal
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };


  // Handle profile update
  const handleUpdate = (event) => {
    event.preventDefault();
    alert('Cập nhật thông tin thành công!');
  };


  // Handle password change
  const handleChangePassword = (event) => {
    event.preventDefault(); // Prevent default form submission


    // Kiểm tra các trường mật khẩu
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('Vui lòng điền đầy đủ thông tin.');
      return;
    }


    if (newPassword !== confirmNewPassword) {
      setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }


    if (newPassword === currentPassword) {
      setPasswordError('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
      return;
    }


    // Nếu tất cả hợp lệ
    alert('Đổi mật khẩu thành công!');
    hideModal(); // Đóng modal sau khi cập nhật thành công
  };

     
  return (
    <div>
    
      <div style={{ marginLeft: "270px" }}>
        
        <Topbar title="Thông tin cá nhân" />
      </div>
      
    <div className='personal-infoo'>
    <div className='store-info'>
      {/* CONTENT */}
      <section id="content">
        {/* NAVBAR */}
        {/* <nav>
          <div className="form-input">
            <input type="search" placeholder="Tìm kiếm..." />
            <button type="submit">
              <i className="bx bx-search"></i>
            </button>
          </div>
          <a href="#" className="notification">
            <span className="material-symbols-outlined">notifications</span>
            <span className="num">8</span>
          </a>
          <a href="#" className="profile">
            <img src={avatar} alt="Profile" />
          </a>
        </nav> */}


         {/* Add Change Password button */}
{/* Add Change Password button */}
<div
          className="ant-row"
          style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}
        >
          <button className="ant-btn ant-btn-secondary" onClick={showModal} type="button">
            Đổi mật khẩu
          </button>
        </div>



        {/* Account Info Section */}
        <main style={{ marginLeft: '10px', padding: '5px' }}>
          <div className="account-info">
            <h2>Thông tin cá nhân Quản trị viên</h2>
            <form className="ant-form ant-form-horizontal" onSubmit={handleUpdate}>
              <div className="ant-row">
                <div className="ant-col ant-col-24 ant-col-md-12">
                  <label className="ant-form-item-label">Tên đăng nhập</label>
                  <input
                    className="ant-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // Update value on change
                  />
                </div>
              </div>
              <div className="ant-row">
                <div className="ant-col ant-col-24 ant-col-md-12">
                  <label className="ant-form-item-label">Email</label>
                  <input
                    className="ant-input"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update value on change
                  />
                </div>
              </div>
              
              {isModalVisible && (
        <div id="changePasswordModal" style={{ display: 'block'}}>
          <div className="ant-modal-wrap">
            <div className="ant-modal">
              <div className="ant-modal-content">
                <div className="ant-modal-header">
                  <div className="ant-modal-title">Đổi mật khẩu</div>
                </div>
                <div className="ant-modal-body">
                  <form id="changePasswordForm" className="ant-form ant-form-horizontal" onSubmit={handleChangePassword}>
                    <div className="ant-form-item">
                      <label className="ant-form-item-label">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        className="ant-input"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)} // Update value on change
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>
                    <div className="ant-form-item">
                      <label className="ant-form-item-label">Mật khẩu mới</label>
                      <input
                        type="password"
                        className="ant-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} // Update value on change
                        placeholder="Nhập mật khẩu mới"
                      />
                    </div>
                    <div className="ant-form-item">
                      <label className="ant-form-item-label">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        className="ant-input"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)} // Update value on change
                        placeholder="Xác nhận mật khẩu mới"
                      />
                    </div>
                    {/* Display error message if any */}
                    {passwordError && <div className="ant-alert ant-alert-error">{passwordError}</div>}
                    <div className="ant-modal-footer">
                      <button type="button" className="ant-btn ant-btn-secondary" onClick={hideModal}>
                        Đóng
                      </button>
                      <button type="submit" className="ant-btn ant-btn-primary">
                        Đổi mật khẩu
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
           
              <div className="ant-row">
                <div className="ant-col ant-col-24">
                  <label className="ant-form-item-label">Mật khẩu</label>
                  <div className="ant-input-password">
                    <input className="ant-input" type="password" value="********" disabled />
                  </div>
                </div>
              </div>
              <div className="ant-row" style={{ marginTop: '20px' }}>
                <button className="ant-btn ant-btn-primary" type="submit">
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </main>
      </section>


    </div>
    </div>
    </div>
  );
};


export default Personal;

