import React from 'react';
import TopFilmChart from "../../Charts/TopFilmChart"; // Sửa đường dẫn


const Dashboard = () => {
  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <div className="chart-wrapper" style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <TopFilmChart />
      </div>
    </div>
  )
}

export default Dashboard;