import React, { useState, useEffect } from 'react';
import { Modal, Form, DatePicker, Select, Button } from 'antd';
import { useFilmApi } from '../../services/filmService';
import { useRoomApi } from '../../services/roomService';
import { useCinemaApi } from '../../services/cinemaService';
import { useShowTimeApi } from '../../services/showTimeService';

import moment from 'moment';

const { Option } = Select;

const ThemSuatChieu = ({ isModalVisible, handleCancel}) => {
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

  // Fetch films and cinemas on mount
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

  // Fetch rooms when a cinema is selected
  const handleCinemaChange = async (cinemaId) => {
    setSelectedCinema(cinemaId);
    form.setFieldsValue({ room: undefined }); // Reset room selection
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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);

      const selectedFilm = films.find((film) => film.id === values.film); // Find the selected film by ID

      const payload = {
        name: selectedFilm?.title || '', // Use the film title based on the selected ID
        start_time: values.start_time.format('YYYY-MM-DDTHH:mm:ss'), // Format start_time
        film_id: values.film, // Use selected film ID
        room_id: values.room, // Use selected room ID
      };

      console.log('Payload:', payload);
      const success = await showTimeService.createShowtime(payload);
      if (success) {
        form.resetFields(); // Reset form fields after successful submission
        handleCancel(); // Close the modal
      }
    } catch (error) {
      console.error('Error adding showtime:', error);
    }
  };

  return (
    <Modal
      title="Thêm suất chiếu"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Thêm
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Ngày giờ" name="start_time" rules={[{ required: true, message: 'Vui lòng chọn ngày giờ' }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>
        <Form.Item label="Phim" name="film" rules={[{ required: true, message: 'Vui lòng chọn phim' }]}>
          <Select placeholder="Chọn phim">
            {films.map((film) => (
              <Option key={film.id} value={film.id}>
                {film.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Rạp chiếu" name="cinema" rules={[{ required: true, message: 'Vui lòng chọn rạp chiếu' }]}>
          <Select placeholder="Chọn rạp chiếu" onChange={handleCinemaChange}>
            {cinemas.map((cinema) => (
              <Option key={cinema.id} value={cinema.id}>
                {cinema.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Phòng chiếu" name="room" rules={[{ required: true, message: 'Vui lòng chọn phòng chiếu' }]}>
          <Select placeholder="Chọn phòng chiếu">
            {rooms.map((room) => (
              <Option key={room.id} value={room.id}>
                {room.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemSuatChieu;