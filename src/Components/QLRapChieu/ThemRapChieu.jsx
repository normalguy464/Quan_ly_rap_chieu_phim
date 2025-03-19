import React from 'react';
import { Modal, Form, Input } from 'antd';
import axios from 'axios';

const ThemRapChieu = ({ isModalVisible, handleCancel }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields()
      .then(values => {
        axios.post('http://localhost:5001/api/addCinema', {
          name: values.name,
          address: values.address
        })
        .then(response => {
          console.log('Response:', response.data);
          form.resetFields();
          handleCancel();
        })
        .catch(error => {
          console.error('Error adding cinema:', error);
        });
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
      </Form>
    </Modal>
  );
};

export default ThemRapChieu;