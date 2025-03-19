import React from 'react';
import { Modal, Form, Input } from 'antd';
import axios from 'axios';

const ThemNhanVien = ({ isModalVisible, handleCancel }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields()
      .then(values => {
        console.log('Form values:', values); // Thêm dòng này để kiểm tra giá trị form
        // Gửi yêu cầu POST tới server để thêm nhân viên mới
        axios.post('http://localhost:5001/api/addUser', {
          fullname: values.name,
          birthdate: values.dob,
          address: values.address,
          phone_number: values.phone,
          email: values.email
        })
        .then(response => {
          console.log('Response:', response.data); // Thêm dòng này để kiểm tra phản hồi từ server
          form.resetFields();
          handleCancel(); // Đóng modal sau khi thêm nhân viên thành công
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
        <Form.Item label="Ngày tháng năm sinh" name="dob" rules={[{ required: true, message: 'Vui lòng nhập ngày tháng năm sinh' }]}>
          <Input placeholder="dd/mm/yyyy" />
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