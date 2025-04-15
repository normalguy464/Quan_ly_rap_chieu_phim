import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select } from 'antd';
import { useFilmApi } from '../../services/filmService';
import { useRoomApi } from '../../services/roomService';
import { useShowTimeApi } from '../../services/showTimeService';

const { Option } = Select;

const ThemSuatChieu = ({ isModalVisible, handleCancel }) => {
  const [form] = Form.useForm();
  const [films, setFilms] = useState([]);
  const [rooms, setRooms] = useState([]);

  const filmApi = useFilmApi();
  const roomApi = useRoomApi();
  const showTimeApi = useShowTimeApi();

  useEffect(() => {
    filmApi.getAllFilms().then(setFilms);
    roomApi.getAllRooms().then(setRooms);
  }, []);

  const onOk = () => {
    form.validateFields()
      .then((values) => {
        const showtimeData = {
          datetime: values.datetime.format('YYYY-MM-DD HH:mm'),
          film: { title: values.film }, // Adjusted to match DanhSachSuatChieu
          room: { name: values.room }, // Adjusted to match DanhSachSuatChieu
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
        <Form.Item label="Ngày giờ" name="datetime" rules={[{ required: true, message: 'Vui lòng chọn ngày giờ' }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>
        <Form.Item label="Chọn phim" name="film" rules={[{ required: true, message: 'Vui lòng chọn phim' }]}>
          <Select placeholder="Chọn phim">
            {films.map((film) => (
              // Changed to film.title
              <Option key={film.id} value={film.title}>{film.title}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Chọn phòng chiếu" name="room" rules={[{ required: true, message: 'Vui lòng chọn phòng chiếu' }]}>
          <Select placeholder="Chọn phòng chiếu">
            {rooms.map((room) => (
              // Changed to room.name
              <Option key={room.id} value={room.name}>{room.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemSuatChieu;