import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input } from 'antd';
import axios from 'axios';

const { Search } = Input;

const DanhSachKhuyenMai = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchPromotionList = () => {
    axios.get('/promotions_with_full_info.json')
      .then(response => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleEditPromotion = (record) => {
    setSelectedPromotion(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedPromotion(null);
  };

  const handleEditModalOk = () => {
    form.validateFields()
      .then(values => {
        axios.put(`http://localhost:5001/api/updatePromotion/${selectedPromotion.id}`, values)
          .then(response => {
            console.log(response.data);
            fetchPromotionList();
            setIsEditModalVisible(false);
            setSelectedPromotion(null);
          })
          .catch(error => {
            console.error('Error updating promotion:', error);
          });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDeletePromotion = (id) => {
    axios.delete(`http://localhost:5001/api/deletePromotion/${id}`)
      .then(response => {
        console.log(response.data);
        fetchPromotionList();
      })
      .catch(error => {
        console.error('Error deleting promotion:', error);
      });
  };

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = data.filter((item) => {
      return (
        item.id.toString().includes(searchValue) ||
        item.name.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchPromotionList();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    // {
    //   title: 'Discount',
    //   dataIndex: 'discount',
    //   key: 'discount',
    // },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEditPromotion(record)}>Cập nhật</Button>
          <Button type="default" onClick={() => handleDeletePromotion(record.id)}>Xóa</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách khuyến mãi</h1>
        <Search
          placeholder="Tìm kiếm khuyến mãi"
          onSearch={handleSearch}
          style={{ width: 300, border: '2px solid #d9d9d9', borderRadius: 4, marginTop: -8 }}
        />
      </div>
      <Table columns={columns} dataSource={filteredData} />
      <Modal
        title="Chỉnh sửa thông tin khuyến mãi"
        visible={isEditModalVisible}
        onCancel={handleEditModalCancel}
        onOk={handleEditModalOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input />
          </Form.Item>
          {/* <Form.Item label="Giảm giá" name="discount" rules={[{ required: true, message: 'Vui lòng nhập giảm giá' }]}>
            <Input />
          </Form.Item> */}
          <Form.Item label="Ngày bắt đầu" name="start_date" rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu' }]}>
            <Input placeholder="dd/mm/yyyy" />
          </Form.Item>
          <Form.Item label="Ngày kết thúc" name="end_date" rules={[{ required: true, message: 'Vui lòng nhập ngày kết thúc' }]}>
            <Input placeholder="dd/mm/yyyy" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DanhSachKhuyenMai;