import {
  PieChartOutlined,
  VideoCameraOutlined,
  UserOutlined,
  LogoutOutlined,
  GiftOutlined,
  HomeOutlined,
  DoubleRightOutlined,
  BarChartOutlined,
  DollarOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function MenuSlider() {
  const location = useLocation(); // Lấy thông tin URL hiện tại
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('/dashboard'); // Key mặc định

  useEffect(() => {
    // Cập nhật selectedKey khi URL thay đổi
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const handleMenuClick = (e) => {
    setSelectedKey(e.key); // Cập nhật trạng thái selectedKey
    navigate(e.key); // Điều hướng đến trang được chọn
  };

  const items = [
    {
      key: '/dashboard',
      label: <Link to={'/dashboard'}>Dashboard</Link>,
      icon: <DoubleRightOutlined />,
    },
    {
      key: '/statistics',
      label: 'Statistics',
      icon: <BarChartOutlined />,
      children: [
        {
          key: '/top-film-revenue',
          label: <Link to={'/top-film-revenue'}>Top Film Revenue</Link>,
          icon: <BarChartOutlined />,
        },
        {
          key: '/revenue-by-cinema',
          label: <Link to={'/revenue-by-cinema'}>Revenue By Cinema</Link>,
          icon: <DollarOutlined />,
        },
        {
          key: '/revenue-by-month',
          label: <Link to={'/revenue-by-month'}>Revenue By Month</Link>,
          icon: <LineChartOutlined />,
        },
      ],
    },
    {
      key: '/employee',
      label: 'Manage Employee',
      icon: <UserOutlined />,
      children: [
        {
          key: '/employee',
          label: <Link to={'/employee'}>Employee List</Link>,
          icon: <UserOutlined />,
        },
      ],
    },
    {
      key: '/customer',
      label: 'Manage Customer',
      icon: <UserOutlined />,
      children: [
        {
          key: '/customer',
          label: <Link to={'/customer'}>Customer List</Link>,
          icon: <UserOutlined />,
        },
      ],
    },
    {
      key: '/film',
      label: 'Manage Movie',
      icon: <VideoCameraOutlined />,
      children: [
        {
          key: '/film',
          label: <Link to={'/film'}>Movie List</Link>,
          icon: <VideoCameraOutlined />,
        },
      ],
    },
    {
      key: '/cinema',
      label: 'Manage Cinema',
      icon: <HomeOutlined />,
      children: [
        {
          key: '/cinema',
          label: <Link to={'/cinema'}>Cinema List</Link>,
          icon: <VideoCameraOutlined />,
        },
      ],
    },
    {
      key: '/room',
      label: 'Manage Cinema Room',
      icon: <HomeOutlined />,
      children: [
        {
          key: '/room',
          label: <Link to={'/room'}>Cinema Room List</Link>,
          icon: <VideoCameraOutlined />,
        },
      ],
    },
    {
      key: '/promotion',
      label: 'Manage Promotion',
      icon: <GiftOutlined />,
      children: [
        {
          key: '/promotion',
          label: <Link to={'/promotion'}>Promotion List</Link>,
          icon: <VideoCameraOutlined />,
        },
      ],
    },
    {
      key: '/genre',
      label: 'Manage Genre',
      icon: <HomeOutlined />,
      children: [
        {
          key: '/genre',
          label: <Link to={'/genre'}>Genre List</Link>,
          icon: <VideoCameraOutlined />,
        },
      ],
    },
    {
      key: '/showtime',
      label: 'Manage Showtime',
      icon: <VideoCameraOutlined />,
      children: [
        {
          key: '/showtime',
          label: <Link to={'/showtime'}>Showtime List</Link>,
          icon: <VideoCameraOutlined />,
        },
      ],
    },
  ];

  return (
    <>
      <Menu
        theme="dark"
        mode="inline"
        items={items}
        selectedKeys={[selectedKey]} // Đồng bộ selectedKey với URL
        onClick={handleMenuClick} // Xử lý khi nhấn vào menu
      />
    </>
  );
}

export default MenuSlider;