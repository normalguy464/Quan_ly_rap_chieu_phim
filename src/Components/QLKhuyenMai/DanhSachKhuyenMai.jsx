import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input } from 'antd';
import { usePromotionApi } from '../../services/promotionService'; // Import promotionService
import BackToDashboardButton from '../BackToDashBoard';
const { Search } = Input;

const DanhSachKhuyenMai = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const promotionService = usePromotionApi();

  const fetchPromotionList = async () => {
    try {
      const promotions = await promotionService.getAllPromotion();
      setData(promotions);
      setFilteredData(promotions);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      const success = await promotionService.updatePromotionById(selectedPromotion.id, values);
      if (success) {
        fetchPromotionList();
        setIsEditModalVisible(false);
        setSelectedPromotion(null);
      }
    } catch (error) {
      console.error('Error updating promotion:', error);
    }
  };

  const handleDeletePromotion = async (id) => {
    try {
      const success = await promotionService.deletePromotion(id);
      if (success) {
        fetchPromotionList();
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
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

  const handleAddPromotion = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleAddModalOk = async () => {
    try {
      const values = await form.validateFields();
      const success = await promotionService.createPromotion(values);
      if (success) {
        fetchPromotionList();
        setIsAddModalVisible(false);
      }
    } catch (error) {
      console.error('Error creating promotion:', error);
    }
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
    {
      title: 'Create Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(), // Format date to display only the day
    },
    {
      title: 'Duration (days)',
      dataIndex: 'duration',
      key: 'duration',
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
      <BackToDashboardButton />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách khuyến mãi</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Search
            placeholder="Tìm kiếm khuyến mãi"
            onSearch={handleSearch}
            style={{ width: 300, border: '2px solid #d9d9d9', borderRadius: 4 }}
          />
          <Button type="primary" onClick={handleAddPromotion}>Thêm mới khuyến mãi</Button>
        </div>
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
          <Form.Item label="Ngày bắt đầu" name="start_date" rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu' }]}>
            <Input placeholder="dd/mm/yyyy" />
          </Form.Item>
          <Form.Item label="Thời gian (ngày)" name="duration" rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}>
            <Input type="number" placeholder="Nhập số ngày" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm mới khuyến mãi"
        visible={isAddModalVisible}
        onCancel={handleAddModalCancel}
        onOk={handleAddModalOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Ngày bắt đầu" name="start_date" rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu' }]}>
            <Input placeholder="dd/mm/yyyy" />
          </Form.Item>
          <Form.Item label="Thời gian (ngày)" name="duration" rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}>
            <Input type="number" placeholder="Nhập số ngày" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DanhSachKhuyenMai;