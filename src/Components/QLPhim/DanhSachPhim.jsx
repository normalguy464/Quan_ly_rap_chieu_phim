import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input, DatePicker, Switch } from 'antd';
import { useFilmApi } from '../../services/filmService';

const { Search } = Input;

const DanhSachPhim = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const filmService = useFilmApi();

  const fetchFilmList = async () => {
    try {
      const films = await filmService.getAllFilms();
      setData(films);
      setFilteredData(films);
    } catch (error) {
      console.error('Error fetching films:', error);
    }
  };

  const handleEditFilm = (record) => {
    setSelectedFilm(record);
    form.setFieldsValue({
      ...record,
      release_date: record.release_date ? moment(record.release_date) : null,
    });
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedFilm(null);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      const success = await filmService.updateFilmById(selectedFilm.id, {
        ...values,
        release_date: values.release_date.format('YYYY-MM-DD'),
      });
      if (success) {
        fetchFilmList();
        setIsEditModalVisible(false);
        setSelectedFilm(null);
      }
    } catch (error) {
      console.error('Error updating film:', error);
    }
  };

  const handleDeleteFilm = async (id) => {
    try {
      const success = await filmService.deleteFilm(id);
      if (success) {
        fetchFilmList();
      }
    } catch (error) {
      console.error('Error deleting film:', error);
    }
  };

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = data.filter((item) => {
      return (
        item.title.toLowerCase().includes(searchValue) ||
        item.description.toLowerCase().includes(searchValue) ||
        item.author.toLowerCase().includes(searchValue) ||
        item.genre.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchFilmList();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên phim',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Ngày phát hành',
      dataIndex: 'release_date',
      key: 'release_date',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Thể loại',
      dataIndex: 'genre',
      key: 'genre',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (isActive ? 'Có' : 'Không'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEditFilm(record)}>Cập nhật</Button>
          <Button type="default" onClick={() => handleDeleteFilm(record.id)}>Xóa</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách phim</h1>
        <Search
          placeholder="Tìm kiếm phim"
          onSearch={handleSearch}
          style={{ width: 300, border: '2px solid #d9d9d9', borderRadius: 4, marginTop: -8 }}
        />
      </div>
      <Table columns={columns} dataSource={filteredData} />
      <Modal
        title="Chỉnh sửa thông tin phim"
        visible={isEditModalVisible}
        onCancel={handleEditModalCancel}
        onOk={handleEditModalOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên phim" name="title" rules={[{ required: true, message: 'Vui lòng nhập tên phim' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Thời lượng (phút)" name="duration" rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Ngày phát hành" name="release_date" rules={[{ required: true, message: 'Vui lòng chọn ngày phát hành' }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item label="Tác giả" name="author" rules={[{ required: true, message: 'Vui lòng nhập tác giả' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Thể loại" name="genre" rules={[{ required: true, message: 'Vui lòng nhập thể loại' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Hoạt động" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DanhSachPhim;
