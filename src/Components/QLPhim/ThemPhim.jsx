import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const QLFilm = ({ isModalVisible, handleOk, handleCancel }) => {

  const [form] = Form.useForm();
  
    const onOk = () => {
      form.validateFields()
        .then(values => {
          handleOk(values);
          form.resetFields();
        })
        .catch(info => {
          console.log('Validate Failed:', info);
        });
    };

    useEffect(() => {
        if (!isModalVisible) {
          form.resetFields();
        }
      }, [isModalVisible, form]);

  return (
    <Modal title="Thêm phim mới" visible={isModalVisible} onOk={onOk} onCancel={handleCancel}>
      <Form form={form} layout="vertical">
        <Form.Item label="Tên phim" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên phim' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Thể loại" name="genre" rules={[{ required: true, message: 'Vui lòng nhập thể loại phim' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Đạo diễn" name="Director" rules={[{ required: true, message: 'Vui lòng nhập tên đạo diễn' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Thời lượng" name="Duration" rules={[{ required: true, message: 'Vui lòng nhập thời lượng phim' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="Describe" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QLFilm;