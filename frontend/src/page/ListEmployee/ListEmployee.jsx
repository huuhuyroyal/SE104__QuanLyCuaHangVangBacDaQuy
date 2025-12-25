import React, { useState, useEffect } from "react";
import { Input, Button, Tag, Table, message, Modal, Form, Select, ConfigProvider } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import employeeService from "../../services/employeeService";
import Topbar from "../../components/Topbar/Topbar";
import "./ListEmployee.css";

const ListEmployee = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("Tất cả chức vụ");
    const [search, setSearch] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await employeeService.getAllEmployees();
            console.log("Dữ liệu nhận từ service:", data); // Kiểm tra dữ liệu nhận được
            setEmployees(Array.isArray(data) ? data : []);
        } catch (error) {
            message.error("Không thể tải danh sách nhân viên");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Logic lọc dữ liệu dựa trên Terminal data
    const filteredEmployees = employees.filter((emp) => {
        const roleMap = {
            admin: "Quản lý",
            seller: "Nhân viên bán hàng",
            warehouse: "Nhân viên kho",
        };
        const roleVN = roleMap[emp.Role] || emp.Role;

        const matchesFilter = activeTab === "Tất cả chức vụ" || roleVN === activeTab;
        const matchesSearch = !search || 
            emp.TenTaiKhoan.toLowerCase().includes(search.toLowerCase()) ||
            String(emp.MaTaiKhoan).includes(search);

        return matchesFilter && matchesSearch;
    });

    const columns = [
        {
            title: "Mã nhân viên",
            dataIndex: "MaTaiKhoan",
            key: "MaTaiKhoan",
            render: (id) => <b>NV{String(id).padStart(3, '0')}</b>
        },
        {
            title: "Tên đăng nhập",
            dataIndex: "TenTaiKhoan",
            key: "TenTaiKhoan",
        },
        {
            title: "Chức vụ",
            dataIndex: "Role",
            key: "Role",
            render: (role) => {
                let color = role === "admin" ? "volcano" : role === "warehouse" ? "blue" : "green";
                let text = role === "admin" ? "Quản lý" : role === "warehouse" ? "Thủ kho" : "Bán hàng";
                return <Tag color={color}>{text.toUpperCase()}</Tag>;
            },
        },
    ];

    return (
        <ConfigProvider theme={{ token: { colorPrimary: "#3E0703" } }}>
            <div className="list-employee-container">
                <Topbar title="Quản lý nhân viên" />
                <div className="employee-page">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Input.Search
                            placeholder="Tìm tên đăng nhập hoặc mã..."
                            style={{ width: 400 }}
                            onSearch={setSearch}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button type="primary" icon={<PlusOutlined />}>Thêm nhân viên</Button>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        {["Tất cả chức vụ", "Quản lý", "Nhân viên bán hàng", "Nhân viên kho"].map(tab => (
                            <Button 
                                key={tab}
                                type={activeTab === tab ? "primary" : "default"}
                                onClick={() => setActiveTab(tab)}
                                style={{ marginRight: 8 }}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>

                    <Table 
                        columns={columns} 
                        dataSource={filteredEmployees} 
                        loading={loading}
                        rowKey="MaTaiKhoan"
                        pagination={{ pageSize: 8 }}
                    />
                </div>
            </div>
        </ConfigProvider>
    );
};

export default ListEmployee;