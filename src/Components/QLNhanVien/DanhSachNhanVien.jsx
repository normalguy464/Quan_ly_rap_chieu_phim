import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input } from 'antd';
import axios from 'axios';

const { Search } = Input;

const DanhSachNhanVien = () => {
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [selectedEmployee, setSelectedEmployee] = useState(null); 
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); 
  const [form] = Form.useForm();

  const fetchEmployeeList = () => {
    axios.get('/users_with_full_info.json')
      .then(response => {
        setData(response.data);
        setFilteredData(response.data); // Khởi tạo dữ liệu đã lọc bằng dữ liệu gốc
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
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

  const handleEditModalOk = () => {
    form.validateFields()
      .then(values => {
        // Gửi yêu cầu PUT tới server để cập nhật thông tin nhân viên
        axios.put(`http://localhost:5001/api/updateUser/${selectedEmployee.id}`, values)
          .then(response => {
            console.log(response.data);
            fetchEmployeeList(); // Cập nhật danh sách nhân viên sau khi chỉnh sửa
            setIsEditModalVisible(false);
            setSelectedEmployee(null);
          })
          .catch(error => {
            console.error('Error updating user:', error);
          });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDeleteEmployee = (id) => {
    // Gửi yêu cầu DELETE tới server để xóa nhân viên
    axios.delete(`http://localhost:5001/api/deleteUser/${id}`)
      .then(response => {
        console.log(response.data);
        fetchEmployeeList(); // Cập nhật danh sách nhân viên sau khi xóa
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
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