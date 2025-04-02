import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select } from 'antd';
import { useFilmApi } from '../../services/filmService';
import { useCinemaApi } from '../../services/cinemaService';
import { useShowTimeApi } from '../../services/showTimeService';

const { Option } = Select;

const ThemSuatChieu = ({ isModalVisible, handleCancel }) => {
  const [form] = Form.useForm();
  const [films, setFilms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const showtimes = ['8h00', '10h00', '14h30', '17h30', '21h30'];

  const filmApi = useFilmApi();
  const cinemaApi = useCinemaApi();
  const showTimeApi = useShowTimeApi();

  useEffect(() => {
    filmApi.getAllFilms().then(setFilms);
    cinemaApi.getAllCinema().then(setCinemas);
  }, []);

  const handleCinemaChange = (cinemaId) => {
    setSelectedCinema(cinemaId);
    cinemaApi.getCinemaById(cinemaId).then((cinema) => {
      setRooms(cinema.rooms || []);
    });
  };

  const onOk = () => {
    form.validateFields()
      .then((values) => {
        const showtimeData = {
          date: values.date.format('DD-MM-YYYY'),
          time: values.time,
          film: values.film,
          cinema: values.cinema,
          room: values.room,
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
      <Form form={form} layout="vertical">
        <Form.Item label="Ngày xem phim" name="date" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
          <DatePicker format="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item label="Giờ chiếu" name="time" rules={[{ required: true, message: 'Vui lòng chọn giờ chiếu' }]}>
          <Select placeholder="Chọn giờ chiếu">
            {showtimes.map((time) => (
              <Option key={time} value={time}>{time}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Chọn phim" name="film" rules={[{ required: true, message: 'Vui lòng chọn phim' }]}>
          <Select placeholder="Chọn phim">
            {films.map((film) => (
              <Option key={film.id} value={film.name}>{film.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Chọn rạp chiếu" name="cinema" rules={[{ required: true, message: 'Vui lòng chọn rạp chiếu' }]}>
          <Select placeholder="Chọn rạp chiếu" onChange={handleCinemaChange}>
            {cinemas.map((cinema) => (
              <Option key={cinema.id} value={cinema.id}>{cinema.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Chọn phòng chiếu" name="room" rules={[{ required: true, message: 'Vui lòng chọn phòng chiếu' }]}>
          <Select placeholder="Chọn phòng chiếu">
            <Option value="all">Tất cả phòng chiếu</Option>
            {rooms.map((room) => (
              <Option key={room.id} value={room.name}>{room.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemSuatChieu;
