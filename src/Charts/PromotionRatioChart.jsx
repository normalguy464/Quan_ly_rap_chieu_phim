import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PromotionRatioChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(0); // 0 = All months

  const monthNames = [
    'Tất cả các tháng', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/visualization/promotion_ratio');
        const apiData = response.data.results;

        // Filter data by year and month
        let filteredData = apiData.filter(item => item.year === year);
        if (month > 0) {
          filteredData = filteredData.filter(item => item.month === month);
        }

        // Prepare labels and datasets
        const labels = filteredData.map(item => `${item.month}/${item.year}`);
        const usedRatioData = filteredData.map(item => (item.used_ratio * 100).toFixed(2));
        const usedCountData = filteredData.map(item => item.used_count);

        if (filteredData.length === 0) {
          setError(`Không có dữ liệu cho ${monthNames[month]} năm ${year}`);
          setChartData(null);
        } else {
          setChartData({
            labels,
            datasets: [
              {
                label: 'Tỷ lệ đã sử dụng (%)',
                data: usedRatioData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
              },
              {
                label: 'Số lượt đã sử dụng',
                data: usedCountData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3,
              },
            ],
          });
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching promotion ratio data:', err);
        setError('Không thể tải dữ liệu biểu đồ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Biểu đồ tỷ lệ sử dụng khuyến mãi ${month === 0 ? '' : monthNames[month]} năm ${year}`,
      },
    },
  };

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
    setMonth(0); // Reset month to "All months" when year changes
  };

  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value));
  };

  return (
    <div>
      <div className="chart-controls" style={{ marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <label>
          Chọn năm:
          <select value={year} onChange={handleYearChange} style={{ marginLeft: '8px' }}>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
          </select>
        </label>
        <label>
          Chọn tháng:
          <select value={month} onChange={handleMonthChange} style={{ marginLeft: '8px' }}>
            {monthNames.map((name, index) => (
              <option key={index} value={index}>{name}</option>
            ))}
          </select>
        </label>
      </div>
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default PromotionRatioChart;
