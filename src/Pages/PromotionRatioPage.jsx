import React from 'react';
import BackToDashboardButton from '../Components/BackToDashBoard';
import PaymentMethodChart from '../Charts/PaymentMethodChart';
import PromotionRatioChart from '../Charts/PromotionRatioChart';

const PromotionRatioPage = () => {
  return (
    <div className="chart-page" style={{ padding: '20px' }}>
      <BackToDashboardButton />
      <h1>Promotion Ratio Analysis</h1>
      <div className="chart-wrapper" style={{ 
        maxWidth: '1000px', 
        margin: '20px auto', 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <PromotionRatioChart />
      </div>
    </div>
  );
}

export default PromotionRatioPage;