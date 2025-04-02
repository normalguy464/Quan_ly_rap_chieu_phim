import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useShowTimeApi } from '../../services/showTimeService';

const DanhSachSuatChieu = () => {
  const [data, setData] = useState([]);
  const showTimeService = useShowTimeApi();

  const fetchShowtimes = async () => {
    try {
      const showtimes = await showTimeService.getAllShowtimes();
      setData(showtimes);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    }
  };

  useEffect(() => {
    fetchShowtimes();
  }, []);

  const handleDeleteShowtime = async (id) => {
    try {
      const success = await showTimeService.deleteShowtime(id);
      if (success) fetchShowtimes();
    } catch (error) {
      console.error('Error deleting showtime:', error);
    }
  };

  const columns = [
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    { title: 'Giờ', dataIndex: 'time', key: 'time' },
    { title: 'Phim', dataIndex: 'film', key: 'film' },
    { title: 'Rạp chiếu', dataIndex: 'cinema', key: 'cinema' },
    { title: 'Phòng chiếu', dataIndex: 'room', key: 'room' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="default" onClick={() => handleDeleteShowtime(record.id)}>Xóa</Button>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default DanhSachSuatChieu;
