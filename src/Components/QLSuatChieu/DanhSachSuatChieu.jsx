import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';

const DanhSachSuatChieu = () => {
  const [data, setData] = useState([]);

  const fetchShowtimes = () => {
    axios.get('/showtimes_with_full_info.json')
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching showtimes:', error));
  };

  useEffect(() => {
    fetchShowtimes();
  }, []);

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

  const handleDeleteShowtime = (id) => {
    axios.delete(`http://localhost:5001/api/deleteShowtime/${id}`)
      .then(() => fetchShowtimes())
      .catch((error) => console.error('Error deleting showtime:', error));
  };

  return <Table columns={columns} dataSource={data} />;
};

export default DanhSachSuatChieu;
