import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import ThemPhongChieu from './ThemPhongChieu';
import { useRoomApi } from '../../services/roomService';
import { useCinemaApi } from '../../services/cinemaService';
import BackToDashboardButton from '../BackToDashBoard';

const DanhSachPhongChieu = () => {
  const [rooms, setRooms] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const roomApi = useRoomApi();
  const cinemaApi = useCinemaApi();

  const fetchRoomList = async () => {
    setLoading(true);
    try {
      const data = await roomApi.getAllRooms();
      console.log("Room data:", data); // In ra để kiểm tra cấu trúc dữ liệu
      
      // Xử lý dữ liệu trước khi hiển thị
      const processedRooms = data.map(room => {
        console.log("Processing room:", room); // Log chi tiết từng phòng
        
        // Tìm cinema_id từ các khả năng khác nhau
        let cinema_id = null;
        if (room.cinema_id !== undefined) {
          cinema_id = room.cinema_id;
        } else if (room.cinemaId !== undefined) {
          cinema_id = room.cinemaId;
        } else if (room.cinema !== undefined) {
          cinema_id = typeof room.cinema === 'object' ? room.cinema.id : room.cinema;
        }
        
        // Trả về phòng với cinema_id đã được xác định
        return {
          ...room,
          cinema_id: cinema_id
        };
      });
      
      setRooms(processedRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      message.error('Không thể tải danh sách phòng chiếu!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const success = await roomApi.deleteRoom(roomId);
      if (success) {
        message.success('Phòng chiếu đã được xóa thành công!');
        fetchRoomList();
      } else {
        message.error('Xóa phòng chiếu thất bại!');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      message.error('Đã xảy ra lỗi khi xóa phòng chiếu!');
    }
  };

  useEffect(() => {
    // Lấy danh sách phòng khi component được mount
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
      dataIndex: 'capacity',
      key: 'capacity',
      render: (text) => text || 'Chưa cập nhật' // Để xử lý trường hợp null
    },
    {
      title: 'Cinema ID',
      dataIndex: 'cinema_id',
      key: 'cinema_id',
      render: (text) => {
        return text !== null && text !== undefined ? text : 'Không có';
      }
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
      <Table 
        columns={columns} 
        dataSource={rooms} 
        rowKey="id" 
        loading={loading}
      />
      <ThemPhongChieu
        isModalVisible={isAddModalVisible}
        handleCancel={() => setIsAddModalVisible(false)}
        refreshRoomList={fetchRoomList}
      />
    </>
  );
};

export default DanhSachPhongChieu;