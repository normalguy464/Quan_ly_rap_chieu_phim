import React, { useState, useEffect } from 'react';
import { Modal, Form, DatePicker, Select, Spin } from 'antd';
import { useFilmApi } from '../../services/filmService';
import { useRoomApi } from '../../services/roomService';
import { useCinemaApi } from '../../services/cinemaService';
import { useShowTimeApi } from '../../services/showTimeService';

const { Option } = Select;

const ThemSuatChieu = ({ isModalVisible, handleCancel }) => {
  const [form] = Form.useForm();
  const [films, setFilms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [loading, setLoading] = useState(false);

  const filmApi = useFilmApi();
  const roomApi = useRoomApi();
  const cinemaApi = useCinemaApi();
  const showTimeApi = useShowTimeApi();

  // Lấy danh sách phim và rạp chiếu khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const filmsData = await filmApi.getAllFilms();
        const cinemasData = await cinemaApi.getAllCinema();
        
        setFilms(filmsData || []);
        setCinemas(cinemasData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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

  const onOk = () => {
    form.validateFields()
      .then((values) => {
        const showtimeData = {
          datetime: values.datetime.format('YYYY-MM-DD HH:mm'),
          film: values.film,
          room: values.room
        };
        
        showTimeApi.createShowtime(showtimeData)
          .then(() => {
            form.resetFields();
            handleCancel();
          })
          .catch((error) => console.error('Error adding showtime:', error));
      })
      .catch((info) => console.log('Validate Failed:', info));
  };

  return (
    <Modal title="Thêm suất chiếu" visible={isModalVisible} onOk={onOk} onCancel={handleCancel}>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          <Form.Item label="Ngày giờ" name="datetime" rules={[{ required: true, message: 'Vui lòng chọn ngày giờ' }]}>
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
  );
};

export default ThemSuatChieu;