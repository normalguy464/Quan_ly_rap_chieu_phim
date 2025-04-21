import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input, DatePicker, Switch, Select } from 'antd'; // Added Select
import { useFilmApi } from '../../services/filmService';
import { useGenreApi } from '../../services/genreService';
import BackToDashboardButton from '../BackToDashBoard';
import moment from 'moment';
import ThemPhim from './ThemPhim';

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
      console.log('Fetched films:', films); // Log fetched films
      console.log('Fetched films:', films); // Log fetched films
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
    const details = filmService.getFilmById(record.id);
    console.log('Editing film:', details); // Log film details
    setSelectedFilm(details);
    form.setFieldsValue({
      ...record,
      release_date: record.release_date ? moment(record.release_date) : null,
      genre_ids: record.genres ? record.genres.map((genre) => genre.id) : [], // Update to genre_ids
      poster_path: record.poster_path, // Add poster_path
      status: record.status, // Add status
      director: record.director, // Add director
      actors: record.actors, // Add actors
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
      const payload = {
        ...values,
        release_date: values.release_date.format('YYYY-MM-DD'),
        genre_ids: values.genre_ids, // Update to genre_ids
      }
      console.log('Updating film with values:', payload); // Log values to be updated
      const success = await filmService.updateFilmById(selectedFilm.id, payload);
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
        genre_ids: values.genre_ids, // Update to genre_ids
      };
      console.log('Adding film with values:', formattedValues); // Log values to be added
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
      dataIndex: 'genres',
      key: 'genres',
      render: (genres) => (Array.isArray(genres) ? genres.map((genre) => genre.name).join(', ') : 'Không có'), // Map through genres to extract names
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
          <Form.Item label="Thể loại" name="genre_ids" rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}>
            <Select
            mode="multiple" // Cho phép chọn nhiều thể loại
            placeholder="Chọn thể loại"
            allowClear>
              {genres.map((genre) => (
                <Select.Option key={genre.id} value={genre.id}>
                  {genre.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Đường dẫn poster" name="poster_path" rules={[{ required: true, message: 'Vui lòng nhập đường dẫn poster' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="COMING_SOON">Sắp chiếu</Select.Option>
              <Select.Option value="NOW_SHOWING">Đang chiếu</Select.Option>
              <Select.Option value="ENDED">Đã kết thúc</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Đạo diễn" name="director" rules={[{ required: true, message: 'Vui lòng nhập tên đạo diễn' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Diễn viên" name="actors" rules={[{ required: true, message: 'Vui lòng nhập danh sách diễn viên' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Hoạt động" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
      <ThemPhim isModalVisible={isAddModalVisible}
        handleCancel={handleAddModalCancel}
        onOk={handleAddModalOk}/>
    </>
  );
};

export default DanhSachPhim;