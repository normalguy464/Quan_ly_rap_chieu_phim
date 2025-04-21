import React from 'react';
import { Modal, Form, Input } from 'antd';
import { useCinemaApi } from '../../services/cinemaService';

const ThemRapChieu = ({ isModalVisible, handleCancel, refreshCinemaList }) => {
  const [form] = Form.useForm();
  const { createCinema } = useCinemaApi();

  const onOk = () => {
    form.validateFields()
      .then(async values => {
        const success = await createCinema({
          name: values.name,
          address: values.address,
          phone_number: values.phoneNumber
        });
        if (success) {
          form.resetFields();
          handleCancel();
          refreshCinemaList(); // Call the refresh function
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal title="Thêm rạp chiếu" visible={isModalVisible} onOk={onOk} onCancel={handleCancel}>
      <Form form={form} layout="vertical">
        <Form.Item label="Tên rạp chiếu" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên rạp chiếu' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Số điẹn thoại" name="phoneNumber" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemRapChieu;