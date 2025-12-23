import React, { useState, useEffect } from "react";
import { Table, Button, Input } from "antd";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import "./Unit.css";

const Unit = () => {
  // Mock data
  const initialData = [
    {
      key: "1",
      ProductID: "ID001",
      DVT: "Cái",
    },
    {
      key: "2",
      ProductID: "ID002",
      DVT: "Sợi",
    },
    {
      key: "3",
      ProductID: "ID003",
      DVT: "Cặp",
    },
    {
      key: "4",
      ProductID: "VSJ004",
      DVT: "Miếng",
    },
  ];
  // Initialize data for search
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [searchText, setSearchText] = useState("");

  const handleCreateProduct = () => {
    console.log("Navigate to add product page");
  };

  // Handle search
  const handleSearchChange = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  // Filter
  useEffect(() => {
    let tempFiltered = data;

    if (searchText) {
      tempFiltered = tempFiltered.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchText)
        )
      );
    }

    // Update final displayed data
    setFilteredData(tempFiltered);
  }, [data, searchText]);

  const columns = [
    {
      title: "Mã Sản Phẩm",
      dataIndex: "ProductID",
      key: "ProductID",
    },

    { title: "Đơn vị tính", dataIndex: "DVT", key: "DVT" },
  ];
  return (
    <div className="main">
      <header className="Unit-header">
        <Input.Search
          placeholder="Tìm kiếm sản phẩm..."
          onChange={handleSearchChange} // Trigger search
        />

        <div className="add-section">
          <Button
            type="add"
            icon={<PlusOutlined />}
            className="add-product"
            onClick={handleCreateProduct}
          >
            Thêm đơn vị tính
          </Button>
        </div>
      </header>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Unit;
