import React, { useEffect, useState } from 'react';
import { Button, Table, Input, message } from 'antd'; // Remove unused imports
import { useUserApi } from '../../services/userService';
import ThemKhachHang from './ThemKhachHang'; // Import ThemKhachHang component
import BackToDashboardButton from '../BackToDashBoard'; // Import BackToDashboardButton component

const DanhSachKhachHang = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // State for Add Modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State for Edit Modal
  const [editingCustomer, setEditingCustomer] = useState(null); // State for the customer being edited
  const userService = useUserApi();

  const fetchEmployeeList = async () => {
    try {
      const users = await userService.getAllUser();
      if (Array.isArray(users)) {
        const customerUsers = users.filter(user => user.roles[0] === 'user');
        setData(customerUsers);
        setFilteredData(customerUsers);
      } else {
        console.error('Error: users is not an array');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddCustomer = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = async (id) => {
    try {
      const success = await userService.deleteUser(id);
      if (success) {
        message.success('Xóa khách hàng thành công!');
        fetchEmployeeList(); // Refresh the list after deletion
      } else {
        message.error('Xóa khách hàng thất bại!');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      message.error('Xóa khách hàng thất bại!');
    }
  };

  useEffect(() => {
    fetchEmployeeList();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Role',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => roles.join(', '),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span className='flex'>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEditCustomer(record)}>Cập nhật</Button>
          <Button type="default" onClick={() => handleDeleteCustomer(record.id)}>Xóa</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <BackToDashboardButton />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách khách hàng</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input.Search
            placeholder="Tìm kiếm khách hàng"
            onSearch={(value) => {
              const searchValue = value.toLowerCase();
              const filtered = data.filter((item) =>
                item.id.toString().includes(searchValue) || item.full_name.toLowerCase().includes(searchValue)
              );
              setFilteredData(filtered);
            }}
            style={{ width: 300, border: '2px solid #d9d9d9', borderRadius: 4 }}
          />
          <Button type="primary" onClick={handleAddCustomer}>Thêm khách hàng</Button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredData} />
      <ThemKhachHang
        isModalVisible={isAddModalVisible}
        handleCancel={handleAddModalCancel}
        onCustomerUpdated={fetchEmployeeList} // Pass callback to refresh list
      />
      {isEditModalVisible && (
        <ThemKhachHang
          isModalVisible={isEditModalVisible}
          handleCancel={handleEditModalCancel}
          customer={editingCustomer} // Pass the customer being edited
          onCustomerUpdated={fetchEmployeeList} // Pass callback to refresh list
        />
      )}
    </>
  );
};

export default DanhSachKhachHang;