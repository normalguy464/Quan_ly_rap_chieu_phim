import React, { useState, useEffect } from 'react';
import TopFilmChart from "../../Charts/TopFilmChart";
import RevenueByCinemaChart from "../../Charts/RevenueByCinemaChart";
import RevenueByMonthChart from "../../Charts/RevenueByMonthChart";
import PromotionRatioChart from "../../Charts/PromotionRatioChart";
import PaymentMethodChart from "../../Charts/PaymentMethodChart";
import TopFilmRatingChart from "../../Charts/TopFilmRatingChart";
import { Button, Row, Col, Card, Spin, Typography, Divider } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  // Làm mới thủ công
  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey(prevKey => prevKey + 1);
    setTimeout(() => setLoading(false), 1000);
  };

  // Cập nhật tự động
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        setRefreshKey(prevKey => prevKey + 1);
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={2}>Tổng quan thống kê</Title>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button 
            type={autoRefresh ? "primary" : "default"} 
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? "Tắt tự động làm mới" : "Bật tự động làm mới"}
          </Button>
          
          {autoRefresh && (
            <select 
              value={refreshInterval} 
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              style={{ padding: '4px 8px', borderRadius: '2px' }}
            >
              <option value={10}>10 giây</option>
              <option value={30}>30 giây</option>
              <option value={60}>1 phút</option>
              <option value={300}>5 phút</option>
            </select>
          )}
          
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            loading={loading} 
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
        </div>
      </div>

      <Spin spinning={loading} tip="Đang cập nhật...">
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <Card title="Doanh thu theo phim" bordered={true}>
              <div style={{ height: '400px' }}>
                <TopFilmChart key={`film-${refreshKey}`} simplified={true} />
              </div>
            </Card>
          </Col>
          
          <Col xs={24} xl={12}>
            <Card title="Doanh thu theo rạp" bordered={true}>
              <div style={{ height: '400px' }}>
                <RevenueByCinemaChart key={`cinema-${refreshKey}`} simplified={true} />
              </div>
            </Card>
          </Col>
          
          <Col xs={24} xl={12}>
            <Card title="Doanh thu theo tháng" bordered={true}>
              <div style={{ height: '400px' }}>
                <RevenueByMonthChart key={`month-${refreshKey}`} simplified={true} />
              </div>
            </Card>
          </Col>
          
          <Col xs={24} xl={12}>
            <Card title="Tỷ lệ sử dụng khuyến mãi" bordered={true}>
              <div style={{ height: '400px' }}>
                <PromotionRatioChart key={`promo-${refreshKey}`} simplified={true} />
              </div>
            </Card>
          </Col>
          
          <Col xs={24} xl={12}>
            <Card title="Phương thức thanh toán" bordered={true}>
              <div style={{ height: '400px' }}>
                <PaymentMethodChart key={`payment-${refreshKey}`} simplified={true} />
              </div>
            </Card>
          </Col>
          
          <Col xs={24} xl={12}>
            <Card title="Đánh giá phim" bordered={true}>
              <div style={{ height: '400px' }}>
                <TopFilmRatingChart key={`rating-${refreshKey}`} simplified={true} />
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Dashboard;