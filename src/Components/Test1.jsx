import React, { useState } from 'react';
import {
  PieChartOutlined,
  VideoCameraOutlined,
  UserOutlined,
  LogoutOutlined,
  GiftOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Dropdown } from 'antd';
import ThemNhanVien from './QLNhanVien/ThemNhanVien';
import DanhSachNhanVien from './QLNhanVien/DanhSachNhanVien';
import ThemKhachHang from './QLKhachHang/ThemKhachHang';
import DanhSachKhachHang from './QLKhachHang/DanhSachKhachHang';
// import ThemPhongChieu from './QLRapChieu/QLPhongChieu/ThemPhongChieu';
// import DanhSachPhongChieu from './QLRapChieu/QLPhongChieu/DanhSachPhongChieu';
import ThemRapChieu from './QLRapChieu/ThemRapChieu';
import DanhSachRapChieu from './QLRapChieu/DanhSachRapChieu';
import ThemKhuyenMai from './QLKhuyenMai/ThemKhuyenMai';
import DanhSachKhuyenMai from './QLKhuyenMai/DanhSachKhuyenMai';
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children, onClick) {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  };
}

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
  const [isFilmModalVisible, setIsFilmModalVisible] = useState(false);
  const [isCinemaModalVisible, setIsCinemaModalVisible] = useState(false);
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [isPromotionModalVisible, setIsPromotionModalVisible] = useState(false);
  const [activeView, setActiveView] = useState(null); 


  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    console.log('Đăng xuất');
  };

  const showEmployeeModal = () => {
    setIsEmployeeModalVisible(true);
  };

  const handleEmployeeCancel = () => {
    setIsEmployeeModalVisible(false);
  };

  const showCustomerModal = () => {
    setIsCustomerModalVisible(true);
  };

  const handleCustomerCancel = () => {
    setIsCustomerModalVisible(false);
  };

  const showFilmModal = () => {
    setIsFilmModalVisible(true);
  };

  const handleFilmOk = () => {
    setIsFilmModalVisible(false);
  };

  const handleFilmCancel = () => {
    setIsFilmModalVisible(false);
  };

  const showRoomModal = () => {
    setIsRoomModalVisible(true);
  };

  const handleRoomCancel = () => {
    setIsRoomModalVisible(false);
  };

  const showPromotionModal = () => {
    setIsPromotionModalVisible(true);
  };

  const handlePromotionCancel = () => {
    setIsPromotionModalVisible(false);
  };

  const showCinemaModal = () => {
    setIsCinemaModalVisible(true);
  };

  const handleCinemaCancel = () => {
    setIsCinemaModalVisible(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const items = [
    getItem('Dashboard', '1', <PieChartOutlined />),
    getItem('Quản lý nhân viên', '2', <UserOutlined />, [
      getItem('Thêm nhân viên', '3', <UserOutlined />, null, showEmployeeModal),
      getItem('Xem danh sách nhân viên', '6', <UserOutlined />, null, () => setActiveView('employees')), // Hiển thị danh sách nhân viên
    ]),
    getItem('Quản lý khách hàng', '7', <UserOutlined />, [
      getItem('Thêm khách hàng', '8', <UserOutlined />, null, showCustomerModal),
      getItem('Xem danh sách khách hàng', '11', <UserOutlined />, null, () => setActiveView('customers')), // Hiển thị danh sách khách hàng
    ]),
    getItem('Quản lý danh sách phim', '12', <VideoCameraOutlined />, [
      getItem('Thêm phim mới', '13', <VideoCameraOutlined />, null, showFilmModal),
      getItem('Xem danh sách phim', '16', <VideoCameraOutlined />),
    ]),
    getItem('Quản lý rạp chiếu', '17', <HomeOutlined />, [
      getItem('Thêm rạp chiếu', '18', <HomeOutlined />, null, showCinemaModal),
      getItem('Xem danh sách rạp chiếu', '26', <HomeOutlined />, null, () => setActiveView('cinemas')),
    ]),
    getItem('Quản lý khuyến mãi', '23', <GiftOutlined />, [
      getItem('Thêm khuyến mãi', '24', <GiftOutlined />, null, showPromotionModal),
      getItem('Xem danh sách khuyến mãi', '25', <GiftOutlined />, null, () => setActiveView('promotions')),
    ]),
  ];

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Header
        style={{
          width: '99.5%',
          position: 'absolute', 
          top: '10px', 
          display: 'flex',
          alignItems: 'center',
          padding: '0px 20px',
          background: '#001529', 
          color: 'white',
          borderRadius: '10px 0 0 0', 
          zIndex: 1, // Đảm bảo header nằm trên các thành phần khác
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="logo" style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginRight: 20 }}>
            Quản lý hệ thống rạp chiếu phim
          </div>
          <Dropdown overlay={menu} trigger={['click']}>
            <UserOutlined style={{ fontSize: 24, color: 'white', marginLeft: 1020, cursor: 'pointer' }} />
          </Dropdown>
        </div>
      </Header>

      <Layout style={{ marginTop: 64 }}> {/* Thêm khoảng cách để tránh header che khuất nội dung */}
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={270}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout>
          <Content
            style={{
              margin: '0 16px',
              marginTop: '16px', // Thêm khoảng cách để tránh header che khuất nội dung
            }}
          >
            
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <ThemNhanVien isModalVisible={isEmployeeModalVisible} handleCancel={handleEmployeeCancel}/>
              <ThemKhachHang isModalVisible={isCustomerModalVisible} handleCancel={handleCustomerCancel}/>
              <ThemRapChieu isModalVisible={isCinemaModalVisible} handleCancel={handleCinemaCancel}/>
              <ThemKhuyenMai isModalVisible={isPromotionModalVisible} handleCancel={handlePromotionCancel}/>
              {activeView === 'employees' && <DanhSachNhanVien />}
              {activeView === 'customers' && <DanhSachKhachHang />}
              {activeView === 'cinemas' && <DanhSachRapChieu />}
              {activeView === 'promotions' && <DanhSachKhuyenMai />}
              
            </div>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;