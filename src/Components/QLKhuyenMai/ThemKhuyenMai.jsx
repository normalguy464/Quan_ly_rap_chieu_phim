import React from 'react';
import { Modal, Form, Input } from 'antd';
import { usePromotionApi } from '../../services/promotionService';

const ThemKhuyenMai = ({ isModalVisible, handleCancel }) => {
  const [form] = Form.useForm();
  const { createPromotion } = usePromotionApi();

  const onOk = () => {
    form.validateFields()
      .then(async values => {
        const success = await createPromotion({
          description: values.description,
          start_date: values.start_date,
          duration: values.duration,
        });
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
    <Modal title="Thêm khuyến mãi" visible={isModalVisible} onOk={onOk} onCancel={handleCancel}>
      <Form form={form} layout="vertical">
        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Ngày bắt đầu" name="start_date" rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu' }]}>
          <Input placeholder="dd/mm/yyyy" />
        </Form.Item>
        <Form.Item label="Thời gian (ngày)" name="duration" rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}>
          <Input type="number" placeholder="Nhập số ngày" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemKhuyenMai;