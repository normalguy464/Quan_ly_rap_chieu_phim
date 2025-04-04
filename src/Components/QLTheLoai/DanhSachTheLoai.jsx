import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input, Modal as AntdModal, message } from 'antd';
import { useGenreApi } from '../../services/genreService';

const { Search } = Input;

const DanhSachTheLoai = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // State for Add Modal
  const [form] = Form.useForm();
  const genreService = useGenreApi();

  const fetchGenreList = async () => {
    try {
      const genres = await genreService.getAllGenres();
      setData(genres);
      setFilteredData(genres);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEditGenre = (record) => {
    setSelectedGenre(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedGenre(null);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      const success = await genreService.updateGenreById(selectedGenre.id, values);
      if (success) {
        fetchGenreList();
        setIsEditModalVisible(false);
        setSelectedGenre(null);
      }
    } catch (error) {
      console.error('Error updating genre:', error);
    }
  };

  const handleDeleteGenre = async (id) => {
    try {
      const success = await genreService.deleteGenre(id);
      if (success) {
        message.success('Xóa thể loại thành công'); // Show success message
        fetchGenreList();
      } else {
        message.error('Xóa thể loại thất bại'); // Show error message if API fails
      }
    } catch (error) {
      console.error('Error deleting genre:', error);
      message.error('Đã xảy ra lỗi khi xóa thể loại'); // Show error message
    }
  };

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = data.filter((item) => {
      return (
        item.id.toString().includes(searchValue) ||
        item.name.toLowerCase().includes(searchValue) ||
        item.description.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(filtered);
  };

  const handleAddGenre = () => {
    form.resetFields(); // Reset form fields
    setIsAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleAddModalOk = async () => {
    try {
      const values = await form.validateFields();
      const success = await genreService.createGenre(values); // Call API to create genre
      if (success) {
        fetchGenreList(); // Refresh genre list after adding
        setIsAddModalVisible(false);
      }
    } catch (error) {
      console.error('Error adding genre:', error);
    }
  };

  useEffect(() => {
    fetchGenreList();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên thể loại',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEditGenre(record)}>Cập nhật</Button>
          <Button
            type="default"
            onClick={() => {
              AntdModal.confirm({
                title: 'Xác nhận xóa',
                content: 'Bạn có chắc chắn muốn xóa thể loại này?',
                okText: 'Xóa',
                cancelText: 'Hủy',
                onOk: () => handleDeleteGenre(record.id), // Call delete function on confirmation
              });
            }}
          >
            Xóa
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách thể loại</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Search
            placeholder="Tìm kiếm thể loại"
            onSearch={handleSearch}
            style={{ width: 300, border: '2px solid #d9d9d9', borderRadius: 4 }}
          />
          <Button type="primary" onClick={handleAddGenre}>Thêm thể loại</Button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredData} />
      <Modal
        title="Chỉnh sửa thông tin thể loại"
        visible={isEditModalVisible}
        onCancel={handleEditModalCancel}
        onOk={handleEditModalOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên thể loại" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên thể loại' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm thể loại"
        visible={isAddModalVisible}
        onCancel={handleAddModalCancel}
        onOk={handleAddModalOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên thể loại" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên thể loại' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DanhSachTheLoai;