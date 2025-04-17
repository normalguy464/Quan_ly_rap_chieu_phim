import React, { useEffect, useState } from 'react';
import { Button, Table, Input, message } from 'antd'; // Adjust imports
import { useUserApi } from '../../services/userService';
import ThemNhanVien from './ThemNhanVien'; // Import ThemNhanVien component
import BackToDashboardButton from '../BackToDashBoard'; // Import BackToDashboardButton component
const DanhSachNhanVien = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // State for Add Modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State for Edit Modal
  const [editingEmployee, setEditingEmployee] = useState(null); // State for the employee being edited
  const userService = useUserApi();

  const fetchEmployeeList = async () => {
    try {
      const users = await userService.getAllUser();
      if (Array.isArray(users)) {
        const adminUsers = users.filter(user => user.roles[0] == 'admin'|| user.roles[0] == 'staff'); // Filter for admin users
        console.log('Admin Users:', adminUsers); // Log the filtered admin users
        setData(adminUsers);
        setFilteredData(adminUsers);
      } else {
        console.error('Error: users is not an array');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddEmployee = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const success = await userService.deleteUser(id);
      if (success) {
        message.success('Xóa nhân viên thành công!');
        fetchEmployeeList(); // Refresh the list after deletion
      } else {
        message.error('Xóa nhân viên thất bại!');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      message.error('Xóa nhân viên thất bại!');
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
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEditEmployee(record)}>Cập nhật</Button>
          <Button type="default" onClick={() => handleDeleteEmployee(record.id)}>Xóa</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <BackToDashboardButton />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách nhân viên</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input.Search
            placeholder="Tìm kiếm nhân viên"
            onSearch={(value) => {
              const searchValue = value.toLowerCase();
              const filtered = data.filter((item) =>
                item.id.toString().includes(searchValue) || item.fullname.toLowerCase().includes(searchValue)
              );
              setFilteredData(filtered);
            }}
            style={{ width: 300, border: '2px solid #d9d9d9', borderRadius: 4 }}
          />
          <Button type="primary" onClick={handleAddEmployee}>Thêm nhân viên</Button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredData} />
      <ThemNhanVien
        isModalVisible={isAddModalVisible}
        handleCancel={handleAddModalCancel}
        onEmployeeUpdated={fetchEmployeeList} // Pass callback to refresh list
      />
      {isEditModalVisible && (
        <ThemNhanVien
          isModalVisible={isEditModalVisible}
          handleCancel={handleEditModalCancel}
          employee={editingEmployee} // Pass the employee being edited
          onEmployeeUpdated={fetchEmployeeList} // Pass callback to refresh list
        />
      )}
    </>
  );
};

export default DanhSachNhanVien;