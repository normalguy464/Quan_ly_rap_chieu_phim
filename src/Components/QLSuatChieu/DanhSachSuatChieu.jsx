import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input, DatePicker } from 'antd';
import { useShowTimeApi } from '../../services/showTimeService';
import moment from 'moment';
import BackToDashboardButton from '../BackToDashBoard';
const { Search } = Input;

const DanhSachSuatChieu = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const showTimeService = useShowTimeApi();

  const fetchShowtimes = async () => {
    try {
      const showtimes = await showTimeService.getAllShowtimes();
      console.log('Fetched showtimes:', showtimes);
      setData(showtimes);
      setFilteredData(showtimes);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    }
  };

  const handleEditShowtime = (record) => {
    setSelectedShowtime(record);
    form.setFieldsValue({
      ...record,
      start_time: record.start_time ? moment(record.start_time) : null,
      film: record.film?.title, // Set film title
      room: record.room?.name, // Set room name
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
    const filtered = data.filter((item) => {
      return (
        item.film.title.toLowerCase().includes(searchValue) ||
        item.room.name.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(filtered);
  };

  const handleAddShowtime = () => {
    form.resetFields();
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

  useEffect(() => {
    fetchShowtimes();
  }, []);

  const columns = [
    { title: 'Ngày giờ', dataIndex: 'start_time', key: 'start_time' },
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
      <Table columns={columns} dataSource={filteredData} />
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
          <Form.Item label="Phim" name="film" rules={[{ required: true, message: 'Vui lòng nhập tên phim' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phòng chiếu" name="room" rules={[{ required: true, message: 'Vui lòng nhập phòng chiếu' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm suất chiếu"
        visible={isAddModalVisible}
        onCancel={handleAddModalCancel}
        onOk={handleAddModalOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Ngày giờ" name="start_time" rules={[{ required: true, message: 'Vui lòng chọn ngày giờ' }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item label="Phim" name="film" rules={[{ required: true, message: 'Vui lòng nhập tên phim' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phòng chiếu" name="room" rules={[{ required: true, message: 'Vui lòng nhập phòng chiếu' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DanhSachSuatChieu;