import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
import ThemPhongChieu from './ThemPhongChieu';
import { useRoomApi } from '../../services/roomService';
import { useCinemaApi } from '../../services/cinemaService';
import BackToDashboardButton from '../BackToDashBoard';

const DanhSachPhongChieu = () => {
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]); // State for cinemas
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form] = Form.useForm();
  const { getAllRooms, deleteRoom, updateRoom } = useRoomApi();
  const { getAllCinema } = useCinemaApi(); // Fetch cinemas

  const fetchRoomList = async () => {
    try {
      const data = await getAllRooms();
      console.log('Fetched rooms:', data); // Debugging log
      setRooms(data || []); // Ensure rooms is always an array
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchCinemas = async () => {
    try {
      const data = await getAllCinema();
      setCinemas(data || []); // Ensure cinemas is always an array
    } catch (error) {
      console.error('Error fetching cinemas:', error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const success = await deleteRoom(roomId);
      if (success) {
        message.success('Phòng chiếu đã được xóa thành công!');
        fetchRoomList();
      } else {
        message.error('Xóa phòng chiếu thất bại!');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    form.setFieldsValue({
      name: room.name,
      detail: room.detail,
      capacity: room.capacity,
      cinema_id: room.cinema_id, // Pre-fill cinema selection
    });
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedRoom(null);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      const success = await updateRoom(selectedRoom.id, values);
      if (success) {
        message.success('Phòng chiếu đã được cập nhật thành công!');
        fetchRoomList();
        setIsEditModalVisible(false);
        setSelectedRoom(null);
      } else {
        message.error('Cập nhật phòng chiếu thất bại!');
      }
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  useEffect(() => {
    fetchRoomList();
    fetchCinemas(); // Fetch cinemas on component mount
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên phòng chiếu',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số ghế',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Rạp chiếu',
      dataIndex: ['cinema', 'name'],
      key: 'cinema',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span className="flex gap-2">
          <Button type="primary" onClick={() => handleEditRoom(record)}>
            Chỉnh sửa
          </Button>
          <Button type="default" danger onClick={() => handleDeleteRoom(record.id)}>
            Xóa
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <BackToDashboardButton />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách phòng chiếu</h1>
        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
          Thêm phòng chiếu
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={rooms} // Ensure this is bound to the rooms state
        rowKey="id" // Ensure each row has a unique key
      />
      <ThemPhongChieu
        isModalVisible={isAddModalVisible}
        handleCancel={() => setIsAddModalVisible(false)}
        refreshRoomList={fetchRoomList}
      />
      <Modal
        title="Chỉnh sửa phòng chiếu"
        visible={isEditModalVisible}
        onCancel={handleEditModalCancel}
        onOk={handleEditModalOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên phòng chiếu"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên phòng chiếu' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Chi tiết"
            name="detail"
            rules={[{ required: true, message: 'Vui lòng nhập chi tiết phòng chiếu' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số ghế"
            name="capacity"
            rules={[{ required: true, message: 'Vui lòng nhập số ghế' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Rạp chiếu"
            name="cinema_id"
            rules={[{ required: true, message: 'Vui lòng chọn rạp chiếu' }]}
          >
            <Select placeholder="Chọn rạp chiếu">
              {cinemas.map((cinema) => (
                <Select.Option key={cinema.id} value={cinema.id}>
                  {cinema.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DanhSachPhongChieu;