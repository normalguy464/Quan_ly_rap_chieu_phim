import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, message } from 'antd';
import { useUserApi } from '../../services/userService';
import moment from 'moment'; // Import moment for date formatting

const ThemNhanVien = ({ isModalVisible, handleCancel, employee, onEmployeeUpdated }) => {
  const [form] = Form.useForm();
  const userService = useUserApi();

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        id: employee.id,
        email: employee.email,
        full_name: employee.full_name,
        username: employee.username,
        birthdate: employee.birthdate ? moment(employee.birthdate, 'YYYY-MM-DD') : null,
        address: employee.address,
        phone_number: employee.phone_number,
      });
    } else {
      form.resetFields();
    }
  }, [employee, form]);

  const handleSubmit = async (values) => {
    try {
      if (values.birthdate) {
        values.birthdate = moment(values.birthdate).format('YYYY-MM-DD');
      }

      // Remove password if it's not provided
      if (!values.password) {
        delete values.password;
      }

      const payload = {
        ...values,
        role_id: 2,
      };

      let success = false;

      if (employee) {
        success = await userService.updateUserById(employee.id, payload);
        if (success) {
          message.success('Cập nhật nhân viên thành công!');
        } else {
          message.error('Cập nhật nhân viên thất bại!');
          return;
        }
      } else {
        success = await userService.createUser(payload);
        if (success) {
          message.success('Thêm nhân viên thành công!');
        } else {
          message.error('Thêm nhân viên thất bại!');
          return;
        }
      }

      form.resetFields();
      handleCancel();

      if (typeof onEmployeeUpdated === 'function') {
        onEmployeeUpdated();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Đã xảy ra lỗi: ' + (error.message || 'Không xác định'));
    }
  };

  return (
    <Modal
      title={employee ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="id" label="ID" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="full_name"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="birthdate"
          label="Ngày sinh"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone_number"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input />
        </Form.Item>
        {/* Only show password field when adding a new employee */}
        {!employee && (
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item className="text-right">
          <Button type="default" onClick={handleCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            {employee ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemNhanVien;