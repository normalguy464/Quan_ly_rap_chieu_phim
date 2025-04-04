import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message, DatePicker } from 'antd'; // Added DatePicker
import { useUserApi } from '../../services/userService';
import moment from 'moment'; // Import moment for date formatting

const ThemKhachHang = ({ isModalVisible, handleCancel, customer, onCustomerUpdated }) => {
  const [form] = Form.useForm();
  const userService = useUserApi();

  useEffect(() => {
    if (customer) {
      form.setFieldsValue({
        id: customer.id,
        email: customer.email,
        full_name: customer.full_name,
        username: customer.username, // Added username
        birthdate: customer.birthdate ? moment(customer.birthdate, 'YYYY-MM-DD') : null, // Ensure moment object for DatePicker
        address: customer.address,
        phone_number: customer.phone_number,
      });
    } else {
      form.resetFields();
    }
  }, [customer, form]);

  const handleSubmit = async (values) => {
    try {
      // Format birthdate to remove time
      if (values.birthdate) {
        values.birthdate = moment(values.birthdate).format('YYYY-MM-DD');
      }

      let success = false;
      
      if (customer) {
        // Update existing customer
        success = await userService.updateUserById(customer.id, values);
        if (success) {
          message.success('Cập nhật khách hàng thành công!');
        } else {
          message.error('Cập nhật khách hàng thất bại!');
          return; // Don't close modal or refresh list if failed
        }
      } else {
        // Create new customer
        success = await userService.createUser(values);
        if (success) {
          message.success('Thêm khách hàng thành công!');
        } else {
          message.error('Thêm khách hàng thất bại!');
          return; // Don't close modal or refresh list if failed
        }
      }
      
      // Only if operation was successful:
      form.resetFields(); // Clear form
      handleCancel(); // Close the modal
      
      // Always trigger list refresh after successful operation
      if (typeof onCustomerUpdated === 'function') {
        onCustomerUpdated(); // Refresh the customer list in parent component
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Đã xảy ra lỗi: ' + (error.message || 'Không xác định'));
    }
  };

  return (
    <Modal
      title={customer ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
      open={isModalVisible} // Changed from 'visible' to 'open' for newer Ant Design versions
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true} // Ensure form state is destroyed when modal closes
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
            { type: 'email', message: 'Email không hợp lệ!' }
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
          name="username"
          label="Tên đăng nhập"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]} // Added username field
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="birthdate"
          label="Ngày sinh"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]} // Added birthdate field
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
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item className="text-right">
          <Button type="default" onClick={handleCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            {customer ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemKhachHang;