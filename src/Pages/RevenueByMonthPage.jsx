import React from 'react';
import RevenueByMonthChart from "../Charts/RevenueByMonthChart";
import BackToDashboardButton from '../Components/BackToDashBoard';

const RevenueByMonthPage = () => {
  return (
    <div className="chart-page" style={{ padding: '20px' }}>
      <BackToDashboardButton />
      <h1>Monthly Revenue Analysis</h1>
      <div className="chart-wrapper" style={{ 
        maxWidth: '1000px', 
        margin: '20px auto', 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <RevenueByMonthChart />
      </div>
    </div>
  );
}

export default RevenueByMonthPage;