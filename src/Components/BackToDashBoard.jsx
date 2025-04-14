import React from 'react';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const BackToDashboardButton = ({ style }) => {
  const navigate = useNavigate();

  return (
    <Button 
      type="primary"
      icon={<HomeOutlined />}
      onClick={() => navigate('/dashboard')}
      style={{ marginBottom: 16, ...style }}
    >
      Quay về trang chủ
    </Button>
  );
};

export default BackToDashboardButton;