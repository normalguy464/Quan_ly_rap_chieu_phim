import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input } from 'antd';
import axios from 'axios';

const { Search } = Input;

const DanhSachKhachHang = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchCustomerList = () => {
    axios.get('/customers_with_full_info.json')
      .then(response => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleEditCustomer = (record) => {
    setSelectedCustomer(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedCustomer(null);
  };

  const handleEditModalOk = () => {
    form.validateFields()
      .then(values => {
        axios.put(`http://localhost:5001/api/updateCustomer/${selectedCustomer.id}`, values)
          .then(response => {
            console.log(response.data);
            fetchCustomerList();
            setIsEditModalVisible(false);
            setSelectedCustomer(null);
          })
          .catch(error => {
            console.error('Error updating customer:', error);
          });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDeleteCustomer = (id) => {
    axios.delete(`http://localhost:5001/api/deleteCustomer/${id}`)
      .then(response => {
        console.log(response.data);
        fetchCustomerList();
      })
      .catch(error => {
        console.error('Error deleting customer:', error);
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
    fetchCustomerList();
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
      title: 'Reward Point',
      dataIndex: 'reward_point',
      key: 'reward_point',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEditCustomer(record)}>Cập nhật</Button>
          <Button type="default" onClick={() => handleDeleteCustomer(record.id)}>Xóa</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách khách hàng</h1>
        <Search
          placeholder="Tìm kiếm khách hàng"
          onSearch={handleSearch}
          style={{ width: 300, border: '2px solid #d9d9d9', borderRadius: 4, marginTop: -8 }}
        />
      </div>
      <Table columns={columns} dataSource={filteredData} />
      <Modal
        title="Chỉnh sửa thông tin khách hàng"
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
          <Form.Item label="Reward Points" name="reward_point" rules={[{ required: true, message: 'Vui lòng nhập điểm thưởng' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DanhSachKhachHang;