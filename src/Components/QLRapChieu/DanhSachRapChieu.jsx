import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Input } from 'antd';
import { useCinemaApi } from '../../services/cinemaService';
import ThemRapChieu from './ThemRapChieu';

const { Search } = Input;

const DanhSachRapChieu = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [form] = Form.useForm();
  const cinemaService = useCinemaApi();

  const fetchCinemaList = async () => {
    try {
      const cinemas = await cinemaService.getAllCinema();
      console.log(cinemas);
      setData(cinemas);
      setFilteredData(cinemas);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchRooms = async (cinemaId) => {
    try {
      const roomsData = await cinemaService.getCinemaById(cinemaId);
      setRooms(roomsData.rooms || []);
      setIsRoomModalVisible(true);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleEditCinema = (record) => {
    setSelectedCinema(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedCinema(null);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      const success = await cinemaService.updateCinemaById(selectedCinema.id, values);
      if (success) {
        fetchCinemaList();
        setIsEditModalVisible(false);
        setSelectedCinema(null);
      }
    } catch (error) {
      console.error('Error updating cinema:', error);
    }
  };

  const handleDeleteCinema = async (id) => {
    try {
      const success = await cinemaService.deleteCinema(id);
      if (success) {
        fetchCinemaList();
      }
    } catch (error) {
      console.error('Error deleting cinema:', error);
    }
  };

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = data.filter((item) => {
      return (
        item.id.toString().includes(searchValue) ||
        item.name.toLowerCase().includes(searchValue) ||
        item.address.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchCinemaList();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên rạp chiếu',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          {/* <Button type="default" style={{ marginRight: 8 }} onClick={() => fetchRooms(record.id)}>Xem danh sách phòng chiếu</Button> */}
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEditCinema(record)}>Cập nhật</Button>
          <Button type="default" onClick={() => handleDeleteCinema(record.id)}>Xóa</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách rạp chiếu</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Search
            placeholder="Tìm kiếm rạp chiếu"
            onSearch={handleSearch}
            style={{ width: 300, border: '2px solid #d9d9d9', borderRadius: 4 }}
          />
          <Button type="primary" onClick={() => setIsAddModalVisible(true)}>Thêm rạp chiếu</Button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredData} />
      <ThemRapChieu
        isModalVisible={isAddModalVisible}
        handleCancel={() => setIsAddModalVisible(false)}
        refreshCinemaList={fetchCinemaList} // Pass the refresh function
      />
      <Modal
        title="Chỉnh sửa thông tin rạp chiếu"
        visible={isEditModalVisible}
        onCancel={handleEditModalCancel}
        onOk={handleEditModalOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên rạp chiếu" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên rạp chiếu' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Danh sách phòng chiếu"
        visible={isRoomModalVisible}
        onCancel={() => setIsRoomModalVisible(false)}
        footer={null}
      >
        <Table
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id' },
            { title: 'Tên phòng chiếu', dataIndex: 'name', key: 'name' },
            { title: 'Loại phòng', dataIndex: 'type', key: 'type' },
            { title: 'Số ghế', dataIndex: 'seats', key: 'seats' },
          ]}
          dataSource={rooms}
        />
      </Modal>
    </>
  );
};

export default DanhSachRapChieu;