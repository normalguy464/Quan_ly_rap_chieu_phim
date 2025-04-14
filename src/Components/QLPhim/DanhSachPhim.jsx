import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input, DatePicker, Switch, Select } from 'antd'; // Added Select
import { useFilmApi } from '../../services/filmService';
import { useGenreApi } from '../../services/genreService';
import BackToDashboardButton from '../BackToDashBoard';
import moment from 'moment';

const { Search } = Input;

const DanhSachPhim = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [genres, setGenres] = useState([]); // State for genres
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // State for Add Modal
  const [form] = Form.useForm();
  const filmService = useFilmApi();
  const genreService = useGenreApi(); // Initialize genre service

  const fetchFilmList = async () => {
    try {
      const films = await filmService.getAllFilms();
      setData(films);
      setFilteredData(films);
    } catch (error) {
      console.error('Error fetching films:', error);
    }
  };

  const fetchGenres = async () => {
    try {
      const genresData = await genreService.getAllGenres(); // Fetch genres from API
      setGenres(genresData);
      console.log('Fetched genres:', genresData); // Log fetched genres
    } catch (error) {
      console.error('Error fetching genres:', error);
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

  const handleAddFilm = () => {
    form.resetFields(); // Reset form fields
    setIsAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleAddModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        release_date: values.release_date ? values.release_date.format('YYYY-MM-DD') : null, // Format release date
      };
      const success = await filmService.createFilm(formattedValues); // Call API to create film
      if (success) {
        fetchFilmList(); // Refresh film list after adding
        setIsAddModalVisible(false);
      }
    } catch (error) {
      console.error('Error adding film:', error);
    }
  };

  useEffect(() => {
    fetchFilmList();
    fetchGenres(); // Fetch genres on component mount
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
        <span className='flex gap-2'>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEditFilm(record)}>Cập nhật</Button>
          <Button type="default" onClick={() => handleDeleteFilm(record.id)}>Xóa</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <BackToDashboardButton />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách phim</h1>
        <div style={{ display: 'flex', gap: 8 }}>
        <Search
            placeholder="Tìm kiếm phim"
            onSearch={handleSearch}
            style={{ width: 300, border: '2px solid #d9d9d9', borderRadius: 4 }}
          />
          <Button type="primary" onClick={handleAddFilm}>Thêm phim</Button>
        </div>
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
          <Form.Item label="Thể loại" name="genre" rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}>
            <Select>
              {genres.map((genre) => (
                <Select.Option key={genre.id} value={genre.name}>
                  {genre.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Hoạt động" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm phim"
        visible={isAddModalVisible}
        onCancel={handleAddModalCancel}
        onOk={handleAddModalOk}
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
          <Form.Item label="Thể loại" name="genre" rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}>
            <Select>
              {genres.map((genre) => (
                <Select.Option key={genre.id} value={genre.name}>
                  {genre.name}
                </Select.Option>
              ))}
            </Select>
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
