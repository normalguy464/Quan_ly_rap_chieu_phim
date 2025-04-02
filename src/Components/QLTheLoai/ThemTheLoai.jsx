import React from 'react';
import { Modal, Form, Input } from 'antd';
import { useGenreApi } from '../../services/genreService';

const ThemTheLoai = ({ isModalVisible, handleCancel }) => {
  const [form] = Form.useForm();
  const { createGenre } = useGenreApi();

  const onOk = () => {
    form.validateFields()
      .then(async (values) => {
        const success = await createGenre({ name: values.name });
        if (success) {
          form.resetFields();
          handleCancel();
        }
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
