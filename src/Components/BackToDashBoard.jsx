import React from 'react';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const BackToDashboardButton = ({ style }) => {
  const navigate = useNavigate();

  return (
    <Button 
      type="primary"
      icon={<HomeOutlined />}
      style={{ marginBottom: 16, ...style }}
    >
      <Link to={'/'}>Quay về trang chủ</Link>
    </Button>
  );
};

export default BackToDashboardButton;