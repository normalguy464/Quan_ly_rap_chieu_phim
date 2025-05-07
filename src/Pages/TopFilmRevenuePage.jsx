import React from 'react';
import TopFilmChart from "../Charts/TopFilmChart";
import BackToDashboardButton from '../Components/BackToDashBoard';

const TopFilmRevenuePage = () => {
  return (
    <div className="chart-page" style={{ padding: '20px' }}>
      <BackToDashboardButton />
      <h1>Top Film Revenue Analysis</h1>
      <div className="chart-wrapper" style={{ 
        maxWidth: '1000px', 
        margin: '20px auto', 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <TopFilmChart />
      </div>
    </div>
  );
}

export default TopFilmRevenuePage;