import React from 'react';
import { Modal, Form, Input } from 'antd';
import axios from 'axios';

const ThemTheLoai = ({ isModalVisible, handleCancel }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields()
      .then(values => {
        axios.post('http://localhost:5001/api/addGenre', {
          name: values.name
        })
        .then(response => {
          console.log('Response:', response.data);
          form.resetFields();
          handleCancel();
        })
        .catch(error => {
          console.error('Error adding genre:', error);
        });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal title="Thêm thể loại" visible={isModalVisible} onOk={onOk} onCancel={handleCancel}>
      <Form form={form} layout="vertical">
        <Form.Item label="Tên thể loại" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên thể loại' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemTheLoai;
