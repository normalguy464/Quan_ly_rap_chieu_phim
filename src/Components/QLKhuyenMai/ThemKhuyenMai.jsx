import React from 'react';
import { Modal, Form, Input } from 'antd';
import axios from 'axios';

const ThemKhuyenMai = ({ isModalVisible, handleCancel }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields()
      .then(values => {
        axios.post('http://localhost:5001/api/addPromotion', {
          description: values.description,
          start_date: values.start_date,
          end_date: values.end_date
        })
        .then(response => {
          console.log('Response:', response.data);
          form.resetFields();
          handleCancel();
        })
        .catch(error => {
          console.error('Error adding promotion:', error);
        });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal title="Thêm khuyến mãi" visible={isModalVisible} onOk={onOk} onCancel={handleCancel}>
      <Form form={form} layout="vertical">
        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Ngày bắt đầu" name="start_date" rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu' }]}>
          <Input placeholder="dd/mm/yyyy" />
        </Form.Item>
        <Form.Item label="Ngày kết thúc" name="end_date" rules={[{ required: true, message: 'Vui lòng nhập ngày kết thúc' }]}>
          <Input placeholder="dd/mm/yyyy" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemKhuyenMai;