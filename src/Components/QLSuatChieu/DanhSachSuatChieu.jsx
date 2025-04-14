import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input, DatePicker, Select, Spin } from 'antd';
import { useShowTimeApi } from '../../services/showTimeService';
import { useFilmApi } from '../../services/filmService';
import { useRoomApi } from '../../services/roomService';
import { useCinemaApi } from '../../services/cinemaService';
import moment from 'moment';
import BackToDashboardButton from '../BackToDashBoard';
const { Search } = Input;
const { Option } = Select;

const DanhSachSuatChieu = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [films, setFilms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [loading, setLoading] = useState(false);

  const showTimeService = useShowTimeApi();
  const filmApi = useFilmApi();
  const roomApi = useRoomApi();
  const cinemaApi = useCinemaApi();

  // Lấy dữ liệu phim và rạp
  const fetchFilmsAndCinemas = async () => {
    setLoading(true);
    try {
      const filmsData = await filmApi.getAllFilms();
      const cinemasData = await cinemaApi.getAllCinema();
      
      setFilms(filmsData || []);
      setCinemas(cinemasData || []);
    } catch (error) {
      console.error('Error fetching films and cinemas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách phòng chiếu khi chọn rạp
  const handleCinemaChange = async (cinemaId) => {
    setSelectedCinema(cinemaId);
    // Reset phòng chiếu khi thay đổi rạp
    form.setFieldsValue({ room: undefined });
    
    if (cinemaId) {
      setLoading(true);
      try {
        const roomsData = await roomApi.getRoomsByCinemaId(cinemaId);
        setRooms(roomsData || []);
      } catch (error) {
        console.error(`Error fetching rooms for cinema ID ${cinemaId}:`, error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    } else {
      setRooms([]);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const showtimes = await showTimeService.getAllShowtimes();
      console.log('Fetched showtimes:', showtimes);
      setData(showtimes);
      
      // Lọc suất chiếu có thời gian lớn hơn thời gian hiện tại
      const now = moment();
      const futureShowtimes = showtimes.filter(showtime => {
        const showtimeDate = moment(showtime.start_time);
        return showtimeDate.isAfter(now);
      });
      
      setFilteredData(futureShowtimes);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    }
  };

  useEffect(() => {
    fetchShowtimes();
    fetchFilmsAndCinemas();
  }, []);

  const handleEditShowtime = (record) => {
    setSelectedShowtime(record);
    form.setFieldsValue({
      ...record,
      start_time: record.start_time ? moment(record.start_time) : null,
      film: record.film?.id, // Sử dụng film.id thay vì film.title
      room: record.room?.id, // Sử dụng room.id thay vì room.name
    });
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedShowtime(null);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      const success = await showTimeService.updateShowtimeById(selectedShowtime.id, {
        ...values,
        start_time: values.start_time.format('YYYY-MM-DD HH:mm'),
      });
      if (success) {
        fetchShowtimes();
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
        showtimeDate.isAfter(now) && 
        (item.film.title.toLowerCase().includes(searchValue) ||
         item.room.name.toLowerCase().includes(searchValue))
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
      const formattedValues = {
        ...values,
        start_time: values.start_time.format('YYYY-MM-DD HH:mm'),
      };
      const success = await showTimeService.createShowtime(formattedValues);
      if (success) {
        fetchShowtimes();
        setIsAddModalVisible(false);
      }
    } catch (error) {
      console.error('Error adding showtime:', error);
    }
  };

  const columns = [
    { 
      title: 'Ngày giờ', 
      dataIndex: 'start_time', 
      key: 'start_time',
      render: (text) => moment(text).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => moment(a.start_time).unix() - moment(b.start_time).unix()
    },
    { title: 'Phim', dataIndex: ['film', 'title'], key: 'film' },
    { title: 'Phòng chiếu', dataIndex: ['room', 'name'], key: 'room' },
    { title: 'Rạp', dataIndex: ['room', 'cinema', 'name'], key: 'cinema' },
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
      <Table columns={columns} dataSource={filteredData} />
      
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
            <Select placeholder="Chọn phim" showSearch optionFilterProp="children">
              {films.map((film) => (
                <Option key={film.id} value={film.id}>
                  {film.title || film.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Phòng chiếu" name="room" rules={[{ required: true, message: 'Vui lòng chọn phòng chiếu' }]}>
            <Select placeholder="Chọn phòng chiếu" showSearch optionFilterProp="children">
              {rooms.map((room) => (
                <Option key={room.id} value={room.id}>
                  {room.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Modal thêm suất chiếu */}
      <Modal
        title="Thêm suất chiếu"
        visible={isAddModalVisible}
        onCancel={handleAddModalCancel}
        onOk={handleAddModalOk}
      >
        <Spin spinning={loading}>
          <Form form={form} layout="vertical">
            <Form.Item label="Ngày giờ" name="start_time" rules={[{ required: true, message: 'Vui lòng chọn ngày giờ' }]}>
              <DatePicker showTime format="YYYY-MM-DD HH:mm" />
            </Form.Item>
            
            <Form.Item label="Chọn phim" name="film" rules={[{ required: true, message: 'Vui lòng chọn phim' }]}>
              <Select placeholder="Chọn phim" showSearch optionFilterProp="children">
                {films.map((film) => (
                  <Option key={film.id} value={film.id}>
                    {film.title || film.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item label="Chọn rạp chiếu" name="cinema" rules={[{ required: true, message: 'Vui lòng chọn rạp chiếu' }]}>
              <Select 
                placeholder="Chọn rạp chiếu"
                onChange={handleCinemaChange}
                showSearch 
                optionFilterProp="children"
              >
                {cinemas.map((cinema) => (
                  <Option key={cinema.id} value={cinema.id}>
                    {cinema.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item 
              label="Chọn phòng chiếu" 
              name="room" 
              rules={[{ required: true, message: 'Vui lòng chọn phòng chiếu' }]}
              tooltip={!selectedCinema ? "Hãy chọn rạp chiếu trước" : ""}
            >
              <Select 
                placeholder="Chọn phòng chiếu" 
                disabled={!selectedCinema}
                showSearch 
                optionFilterProp="children"
              >
                {rooms.map((room) => (
                  <Option key={room.id} value={room.id}>
                    {room.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default DanhSachSuatChieu;