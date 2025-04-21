import React, { use, useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input, DatePicker, Select } from 'antd';
import { useShowTimeApi } from '../../services/showTimeService';
import { useFilmApi } from '../../services/filmService';
import { useRoomApi } from '../../services/roomService';
import { useCinemaApi } from '../../services/cinemaService';
import moment from 'moment';
import BackToDashboardButton from '../BackToDashBoard';
import ThemSuatChieu from './ThemSuatChieu';
const { Search } = Input;
const { Option } = Select;

const DanhSachSuatChieu = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [film, setFilm] = useState();
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 }); // Initialize pagination state

  const showTimeService = useShowTimeApi();
  const filmApi = useFilmApi();
  const roomApi = useRoomApi();
  const cinemaApi = useCinemaApi();

  // Lấy dữ liệu phim và rạp
  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const cinemasData = await cinemaApi.getAllCinema();
      console.log('Cinemas:', cinemasData);
      setCinemas(cinemasData);
    } catch (error) {
      console.error('Error fetching films and cinemas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  // Lấy danh sách phòng chiếu khi chọn rạp
  const handleCinemaChange = async (cinemaId) => {
    setSelectedCinema(cinemaId);
    const roomsData = await roomApi.getRoomsByCinemaId(cinemaId);
    console.log('Rooms:', roomsData);
    setRooms(roomsData || []);
    // Reset phòng chiếu khi thay đổi rạp
    form.setFieldsValue({ room: undefined });
  };

  const fetchShowtimes = async (page, pageSize) => {
    try {
      const result = await showTimeService.getShowtimesByPage(page, pageSize);
      setData(result.showtimes);
      console.log('Showtimes:', result.showtimes);
      setFilteredData(result.showtimes);
      setPagination((prev) => ({ ...prev, total: result.total })); // Update total count in pagination
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    }
  };

  useEffect(() => {
    fetchShowtimes(pagination.current, pagination.pageSize); // Use pagination state
  }, [pagination.current, pagination.pageSize]);

  const handleEditShowtime = (record) => {
    setSelectedShowtime(record);
    setFilm(record.film); // Set selected film for editing
    console.log('Selected showtime:', record);
    form.setFieldsValue({
      ...record,
      start_time: record.start_time ? moment(record.start_time) : null,
      film: record.film?.title,
      room: record.room?.name,
      cinema: record.room?.cinema.name,
    });
    setIsEditModalVisible(true);
    handleCinemaChange(record.room.cinema.id); // Set selected cinema based on the room's cinema
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedShowtime(null);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);
      const payload = {
        name: values.film, // Use the name field directly
        start_time: values.start_time ? values.start_time.format('YYYY-MM-DDTHH:mm:ss') : null, // Ensure start_time is formatted
        film_id: film.id, // Use film ID
        room_id: values.room, // Use room ID
      };
      console.log('Payload:', payload);
      const success = await showTimeService.updateShowtimeById(selectedShowtime.id, payload);
      if (success) {
        fetchShowtimes(pagination.current, pagination.pageSize); // Refresh showtimes with pagination
        setIsEditModalVisible(false);
        setSelectedShowtime(null);
      }
    } catch (error) {
      console.error('Error updating showtime:', error);
    }
  };

  const handleDeleteShowtime = async (id) => {
    try {
      const success = await showTimeService.deleteShowtime(id);
      if (success) {
        fetchShowtimes();
      }
    } catch (error) {
      console.error('Error deleting showtime:', error);
    }
  };

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    // Lọc từ data và giữ nguyên điều kiện thời gian
    const now = moment();
    const filtered = data.filter((item) => {
      const showtimeDate = moment(item.start_time);
      return (
        item.film.title.toLowerCase().includes(searchValue) ||
        item.room.name.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(filtered);
  };

  const handleAddShowtime = () => {
    form.resetFields();
    setSelectedCinema(null); // Reset selected cinema
    setRooms([]); // Reset rooms list
    setIsAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleAddModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);

      const payload = {
        name: values.film, // Use the film name directly
        start_time: values.start_time, // Format start_time
        film_id: values.film, // Use selected film ID
        room_id: values.room, // Use selected room ID
      };

      console.log('Payload:', payload);
      const success = await showTimeService.createShowtime(payload);
      if (success) {
        fetchShowtimes(pagination.current, pagination.pageSize); // Refresh showtimes with pagination
        setIsAddModalVisible(false);
      }
    } catch (error) {
      console.error('Error adding showtime:', error);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const columns = [
    { title: 'Ngày giờ', dataIndex: 'start_time', key: 'start_time', render: (text) => moment(text).format('YYYY-MM-DD HH:mm') }, // Format date
    { title: 'Phim', dataIndex: ['film', 'title'], key: 'film' }, // Display film title
    { title: 'Phòng chiếu', dataIndex: ['room', 'name'], key: 'room' }, // Display room name
    { title: 'Rạp', dataIndex: ['room', 'cinema', 'name'], key: 'cinema' }, // Display cinema name
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span className='flex gap-2'>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEditShowtime(record)}>Cập nhật</Button>
          <Button type="default" onClick={() => handleDeleteShowtime(record.id)}>Xóa</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <BackToDashboardButton />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách suất chiếu</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Search
            placeholder="Tìm kiếm suất chiếu"
            onSearch={handleSearch}
            style={{ width: 300, border: '2px solid #d9d9d9', borderRadius: 4 }}
          />
          <Button type="primary" onClick={handleAddShowtime}>Thêm suất chiếu</Button>
        </div>
      </div>
      <Table
      rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
      />
      
      {/* Modal chỉnh sửa suất chiếu */}
      <Modal
        title="Chỉnh sửa thông tin suất chiếu"
        visible={isEditModalVisible}
        onCancel={handleEditModalCancel}
        onOk={handleEditModalOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Ngày giờ" name="start_time" rules={[{ required: true, message: 'Vui lòng chọn ngày giờ' }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item label="Phim" name="film" rules={[{ required: true, message: 'Vui lòng chọn phim' }]}>
            <Select placeholder="Chọn phim">
              {data.map((item) => (
                <Option key={item.film.id} value={item.film.id}>{item.film.title}</Option> // Use film.id as value
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Rạp chiếu" name="cinema" rules={[{ required: true, message: 'Vui lòng chọn rạp chiếu' }]}>
            <Select placeholder="Chọn rạp chiếu" onChange={handleCinemaChange}>
              {cinemas.map((item) => (
                <Option key={item.id} value={item.id} >{item.name}</Option> // Use film.id as value
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Phòng chiếu" name="room" rules={[{ required: true, message: 'Vui lòng chọn phòng chiếu' }]}>
            <Select placeholder="Chọn phòng chiếu">
              {rooms.map((item) => (
                <Option key={item.id} value={item.id}>{item.name}</Option> // Use room.id as value
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <ThemSuatChieu isModalVisible={isAddModalVisible} 
      handleCancel={handleAddModalCancel}
      />
    </>
  );
};

export default DanhSachSuatChieu;