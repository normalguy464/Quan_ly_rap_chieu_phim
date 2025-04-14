import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import ThemPhongChieu from './ThemPhongChieu';
import { useRoomApi } from '../../services/roomService';
import BackToDashboardButton from '../BackToDashBoard';
const DanhSachPhongChieu = () => {
  const [rooms, setRooms] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const { getAllRooms, deleteRoom } = useRoomApi();

  const fetchRoomList = async () => {
    try {
      const data = await getAllRooms();
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
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

  useEffect(() => {
    fetchRoomList();
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
      dataIndex: 'seats',
      key: 'seats',
    },
    {
      title: 'Rạp chiếu',
      dataIndex: 'cinemaName',
      key: 'cinemaName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button
            type="default"
            danger
            onClick={() => handleDeleteRoom(record.id)}
          >
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
      <Table columns={columns} dataSource={rooms} rowKey="id" />
      <ThemPhongChieu
        isModalVisible={isAddModalVisible}
        handleCancel={() => setIsAddModalVisible(false)}
        refreshRoomList={fetchRoomList}
      />
    </>
  );
};

export default DanhSachPhongChieu;