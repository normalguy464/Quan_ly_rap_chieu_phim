import React from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import { useUserApi } from '../../services/userService'; // Import userService

const ThemKhachHang = ({ isModalVisible, handleCancel }) => {
  const [form] = Form.useForm();
  const { createUser } = useUserApi(); // Destructure createUser from userService

  const onOk = () => {
    form.validateFields()
      .then(async values => {
        console.log('Form values:', values);
        const formattedBirthdate = values.birthdate.toISOString().split('T')[0]; // Format birthdate to remove time
        const success = await createUser({
          username: values.username, // Add username field
          full_name: values.fullname,
          birthdate: formattedBirthdate, // Use formatted birthdate
          address: values.address,
          phone_number: values.phone,
          email: values.email
        });
        if (success) {
          form.resetFields(); // Reset all fields
          handleCancel();
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal title="Thêm khách hàng" visible={isModalVisible} onOk={onOk} onCancel={handleCancel}>
      <Form form={form} layout="vertical">
        <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Tên" name="fullname" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Ngày tháng năm sinh" name="birthdate" rules={[{ required: true, message: 'Vui lòng nhập ngày tháng năm sinh' }]}>
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
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

export default ThemKhachHang;