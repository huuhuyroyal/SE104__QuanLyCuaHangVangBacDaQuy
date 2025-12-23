import React, { useState, useEffect } from "react";
// Import Ant Design components for UI layout and elements
import { Input, Button, Tag, Table, message, Modal, Form, Select, ConfigProvider } from "antd";
import { ExportOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./ListEmployee.css";
import employeeService from "../../services/listEmployee";
import Topbar from "../../components/Topbar/Topbar";

const ListEmployee = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Tất cả chức vụ");

  // State management for list data, selection, filters, and modal visibility
  const [params, setParams] = useState({
    employees: [],
    selectedRowKeys: [],
    filters: "Tất cả chức vụ",
    isModalVisible: false,
    isDeleteModalVisible: false,
    search: "",
  });

  // Handle switching between role-based filter tabs
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    handleChange("filters", tabName);
  };

  // Fetch all employee data from the backend API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      handleChange("employees", data);
    } catch (error) {
      message.error("Failed to load employee list");
    } finally {
      setLoading(false);
    }
  };

  // Load data once when the component is first mounted
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Submit form data to create a new employee account
  const handleAddEmployee = async (values) => {
    try {
      setLoading(true);
      await employeeService.createEmployee({
        username: values.username,
        password: values.password,
        role: values.role,
        permissions: values.permissions
      });
      
      message.success("Employee added successfully");
      form.resetFields(); // Clear form inputs
      handleChange("isModalVisible", false); // Close modal
      fetchEmployees(); // Refresh the list
    } catch (error) {
      message.error(error.message || "Error adding employee");
    } finally {
      setLoading(false);
    }
  };

  // Delete multiple selected employees simultaneously
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const deletePromises = params.selectedRowKeys.map(id => 
        employeeService.deleteEmployee(id)
      );
      await Promise.all(deletePromises);
      message.success("Deleted successfully");
      handleChange("selectedRowKeys", []);
      handleChange("isDeleteModalVisible", false);
      fetchEmployees();
    } catch (error) {
      message.error("Error deleting employees");
    } finally {
      setLoading(false);
    }
  };

  // Logical filtering: Search by username and filter by role
  const filteredEmployees = params.employees.filter(employee => {
    const matchesFilter = params.filters === "Tất cả chức vụ" || employee.role === params.filters;
    const matchesSearch = !params.search || 
      employee.username.toLowerCase().includes(params.search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Configuration for Table Columns
  const columns = [
    { title: "Employee Code", dataIndex: "employeeCode", key: "employeeCode" },
    { title: "Username", dataIndex: "username", key: "username" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        // Dynamic color coding based on employee role
        let color = role === "Quản lý" ? "#3E0703" : "#9b1b1b";
        return <Tag color={color}>{role}</Tag>;
      },
    },
  ];

  return (
    // ConfigProvider: Globally customize the primary color for Ant Design components
    <ConfigProvider theme={{ token: { colorPrimary: '#3E0703' } }}>
      <div>
        <div style={{ marginLeft: "5px" }}>
          <Topbar title="Employee Management" />
        </div>
        <div className="employee-page">
          
          {/* Action Header: Includes search bar and buttons */}
          <header className="employee-header">
            <div className="header-actions">
              <Input.Search
                placeholder="Tìm kiếm theo tên nhân viên..."
                value={params.search}
                onChange={(e) => handleChange("search", e.target.value)}
                style={{ width: '800px' }} 
                enterButton
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button icon={<ExportOutlined />} className="export-button">
                  Xuất file
                </Button>

                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleChange("isModalVisible", true)}
                  className="add-employee-button"
                >
                  Thêm nhân viên
                </Button>
              </div>
            </div>
          </header>

          {/* Filter Section: Tabs for quick categorization */}
          <div className="filter-section">
            <div className="filter-button">
              {["Tất cả chức vụ", "Quản lý", "Nhân viên"].map((role) => (
                <Button
                  key={role}
                  onClick={() => handleTabClick(role)}
                  className={`filter-btn ${activeTab === role ? "active" : ""}`}
                >
                  {role}
                </Button>
              ))}
            </div>
            
            <div className="filter-buttons">
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                disabled={params.selectedRowKeys.length === 0}
                onClick={() => handleChange("isDeleteModalVisible", true)}
              >
                Delete Selected
              </Button>
            </div>
          </div>

          {/* Table Component: Renders the filtered list with pagination */}
          <Table
            rowSelection={{
              selectedRowKeys: params.selectedRowKeys,
              onChange: (keys) => handleChange("selectedRowKeys", keys),
            }}
            columns={columns}
            dataSource={filteredEmployees}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            onRow={(record) => ({
              // Navigate to details page on row click
              onClick: () => navigate(`/employee-detail/${record.id}`),
            })}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ListEmployee;