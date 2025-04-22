import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { useRoomApi } from '../../services/roomService';
import { useCinemaApi } from '../../services/cinemaService';

const { Option } = Select;

const ThemPhongChieu = ({ isModalVisible, handleCancel, refreshRoomList }) => {
  const [form] = Form.useForm();
  const { getAllCinema } = useCinemaApi();
  const [cinemas, setCinemas] = useState([]);
  const roomService = useRoomApi();
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const data = await getAllCinema();
        setCinemas(data || []);
      } catch (error) {
        console.error('Error fetching cinemas:', error);
      }
    };
    fetchCinemas();
  }, []);

  const onOk = () => {
    form.validateFields()
      .then(async (values) => {
        console.log(values); // Log values after successful validation
        const success = await roomService.createRoom({
          name: values.name,
          detail: values.detail,
          capacity: values.capacity,
          cinema_id: values.cinemaId,
        });
        if (success) {
          message.success('Phòng chiếu đã được thêm thành công!');
          form.resetFields();
          handleCancel();
          refreshRoomList(); // Refresh danh sách phòng chiếu
        } else {
          message.error('Thêm phòng chiếu thất bại!');
        }
      })
      .catch((info) => {
        console.error('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Thêm phòng chiếu"
      visible={isModalVisible}
      onOk={onOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Rạp chiếu"
          name="cinemaId"
          rules={[{ required: true, message: 'Vui lòng chọn rạp chiếu' }]}
        >
          <Select placeholder="Chọn rạp chiếu">
            {cinemas.map((cinema) => (
              <Option key={cinema.id} value={cinema.id}>
                {cinema.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
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
          rules={[
            { required: true, message: 'Vui lòng nhập số ghế' },
            
          ]}
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemPhongChieu;