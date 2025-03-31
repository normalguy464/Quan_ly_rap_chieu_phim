import React from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import axios from 'axios';


const ThemNhanVien = ({ isModalVisible, handleCancel }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields()
      .then(values => {
        console.log('Form values:', values);
        axios.post('http://localhost:5001/api/addUser', {
          fullname: values.name,
          birthdate: values.dob.format('YYYY-MM-DD'), // Chuyển đổi ngày sinh
          address: values.address,
          phone_number: values.phone,
          email: values.email
        })
        .then(response => {
          console.log('Response:', response.data);
          form.resetFields();
          handleCancel();
        })
        .catch(error => {
          console.error('Error adding user:', error);
        });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal title="Thêm nhân viên" visible={isModalVisible} onOk={onOk} onCancel={handleCancel}>
      <Form form={form} layout="vertical">
        <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}>
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemNhanVien;
