import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input } from 'antd';
import axios from 'axios';

const { Search } = Input;

const DanhSachTheLoai = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchGenreList = () => {
    axios.get('/genres_with_full_info.json')
      .then(response => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
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

  const handleEditModalOk = () => {
    form.validateFields()
      .then(values => {
        axios.put(`http://localhost:5001/api/updateGenre/${selectedGenre.id}`, values)
          .then(response => {
            console.log(response.data);
            fetchGenreList();
            setIsEditModalVisible(false);
            setSelectedGenre(null);
          })
          .catch(error => {
            console.error('Error updating genre:', error);
          });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDeleteGenre = (id) => {
    axios.delete(`http://localhost:5001/api/deleteGenre/${id}`)
      .then(response => {
        console.log(response.data);
        fetchGenreList();
      })
      .catch(error => {
        console.error('Error deleting genre:', error);
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
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEditGenre(record)}>Cập nhật</Button>
          <Button type="default" onClick={() => handleDeleteGenre(record.id)}>Xóa</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách thể loại</h1>
        <Search
          placeholder="Tìm kiếm thể loại"
          onSearch={handleSearch}
          style={{ width: 300, border: '2px solid #d9d9d9', borderRadius: 4 }}
        />
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
        </Form>
      </Modal>
    </>
  );
};

export default DanhSachTheLoai;