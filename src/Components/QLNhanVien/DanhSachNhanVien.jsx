import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input } from 'antd';
import { useUserApi } from '../../services/userService'; // Import userService

const { Search } = Input;

const DanhSachNhanVien = () => {
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [selectedEmployee, setSelectedEmployee] = useState(null); 
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); 
  const [form] = Form.useForm();
  const userService = useUserApi(); // Initialize userService

  const fetchEmployeeList = async () => {
    try {
      const users = await userService.getAllUser();
      if (Array.isArray(users)) { // Ensure users is an array
        const adminUsers = users.filter(user => user.roles[0] === 'admin'); // Filter users with role 'admin'
        setData(adminUsers);
        setFilteredData(adminUsers); // Initialize filtered data with admin users
      } else {
        console.error('Error: users is not an array');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEditEmployee = (record) => {
    setSelectedEmployee(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedEmployee(null);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      const success = await userService.updateUserById(selectedEmployee.id, values);
      if (success) {
        fetchEmployeeList(); // Refresh employee list after editing
        setIsEditModalVisible(false);
        setSelectedEmployee(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const success = await userService.deleteUser(id);
      if (success) {
        fetchEmployeeList(); // Refresh employee list after deletion
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = data.filter((item) => {
      return (
        item.id.toString().includes(searchValue) ||
        item.fullname.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(filtered);
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
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
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
      title: 'Birthdate',
      dataIndex: 'birthdate',
      key: 'birthdate',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEditEmployee(record)}>Cập nhật</Button>
          <Button type="default" onClick={() => handleDeleteEmployee(record.id)}>Xóa</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách nhân viên</h1>
        <Search
          placeholder="Tìm kiếm nhân viên"
          onSearch={handleSearch}
          style={{ width: 300, border: '2px solid #d9d9d9', borderRadius: 4}}
        />
      </div>
      <Table columns={columns} dataSource={filteredData} /> {/* Hiển thị bảng danh sách nhân viên */}
      <Modal
        title="Chỉnh sửa thông tin nhân viên"
        visible={isEditModalVisible}
        onCancel={handleEditModalCancel}
        onOk={handleEditModalOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên" name="fullname" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Ngày tháng năm sinh" name="birthdate" rules={[{ required: true, message: 'Vui lòng nhập ngày tháng năm sinh' }]}>
            <Input placeholder="dd/mm/yyyy" />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone_number" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DanhSachNhanVien;