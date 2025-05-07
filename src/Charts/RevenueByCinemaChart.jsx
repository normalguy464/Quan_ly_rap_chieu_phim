import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Đăng ký các components cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const RevenueByCinemaChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() trả về 0-11
  const [year, setYear] = useState(currentYear > 2025 ? 2025 : (currentYear < 2024 ? 2024 : currentYear));
  const [month, setMonth] = useState(0); // 0 = Tất cả các tháng
  const [displayCount, setDisplayCount] = useState(5); // Hiển thị top 5 mặc định

  // Tên tháng để hiển thị
  const monthNames = [
    'Tất cả các tháng', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/visualization/total_revenue_by_cinema');
        
        // Lọc dữ liệu theo năm và tháng (nếu có chọn tháng)
        let filteredData = response.data.results.filter(item => item.year === year);
        
        // Nếu chọn một tháng cụ thể (khác 0), tiếp tục lọc theo tháng
        if (month > 0) {
          filteredData = filteredData.filter(item => item.month === month);
        }
        
        // Nếu năm hiện tại, chỉ xét dữ liệu đến tháng hiện tại
        if (year === currentYear) {
          filteredData = filteredData.filter(item => item.month <= currentMonth);
        }
        
        // Tính tổng doanh thu cho mỗi rạp chiếu
        const cinemas = {};
        filteredData.forEach(item => {
          if (!cinemas[item.cinema_name]) {
            cinemas[item.cinema_name] = 0;
          }
          cinemas[item.cinema_name] += item.total_revenue;
        });
        
        // Chuyển đổi thành mảng và sắp xếp theo doanh thu
        const sortedData = Object.entries(cinemas).map(([name, revenue]) => ({
          cinema_name: name,
          total_revenue: revenue
        })).sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, displayCount); // Chỉ lấy top N rạp có doanh thu cao nhất
        
        // Nếu không có dữ liệu, hiển thị thông báo
        if (sortedData.length === 0) {
          setError(`Không có dữ liệu doanh thu cho ${monthNames[month]} năm ${year}`);
          setLoading(false);
          return;
        }
        
        // Tính toán giá trị min và max cho trục Y
        const values = sortedData.map(item => item.total_revenue);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        
        // Tính khoảng cách phù hợp cho trục Y để thấy rõ sự chênh lệch
        // Lấy khoảng 85-90% của giá trị nhỏ nhất làm min
        const yMin = Math.floor(minValue * 0.85 / 10000000) * 10000000;
        // Làm tròn max lên một chút để có khoảng trống phía trên cột
        const yMax = Math.ceil(maxValue * 1.05 / 10000000) * 10000000;
        
        setChartData({
          labels: sortedData.map(item => item.cinema_name),
          datasets: [
            {
              label: 'Doanh thu (VND)',
              data: sortedData.map(item => item.total_revenue),
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 1,
              barPercentage: 0.6, // Giảm độ rộng của cột
              categoryPercentage: 0.8, // Tăng khoảng cách giữa các cột
            }
          ]
        });
        
        // Tạo tiêu đề dựa trên tháng đã chọn
        const titleText = month === 0 
          ? `Top ${displayCount} Rạp Doanh Thu Cao Nhất Năm ${year}` 
          : `Top ${displayCount} Rạp Doanh Thu Cao Nhất ${monthNames[month]} Năm ${year}`;
        
        // Cập nhật options với min và max mới tính toán
        setChartOptions({
          responsive: true,
          maintainAspectRatio: false, // Cho phép điều chỉnh chiều cao
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: titleText,
              font: {
                size: 18
              }
            },
            datalabels: {
              display: true,
              color: 'black',
              anchor: 'end', // Hiển thị nhãn ở trên đỉnh cột
              align: 'top',
              offset: 0,
              font: {
                weight: 'bold',
                size: 12
              },
              formatter: (value) => {
                return new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  notation: 'compact',
                  compactDisplay: 'short',
                  maximumFractionDigits: 1
                }).format(value);
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.parsed.y;
                  return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    maximumFractionDigits: 0
                  }).format(value);
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false, // Không bắt đầu từ 0
              min: yMin, // Đặt giá trị min
              max: yMax, // Đặt giá trị max
              ticks: {
                stepSize: (yMax - yMin) / 10, // Khoảng cách giữa các điểm chia
                callback: function(value) {
                  return new Intl.NumberFormat('vi-VN', {
                    notation: 'compact',
                    compactDisplay: 'short',
                    maximumFractionDigits: 1
                  }).format(value);
                }
              }
            },
            x: {
              ticks: {
                maxRotation: 45, // Xoay nhãn để tránh chồng chéo
                minRotation: 45,
                font: {
                  size: 13,
                  weight: 'bold'
                }
              }
            }
          }
        });
        
        setError(null);
      } catch (err) {
        console.error("Error fetching cinema revenue data:", err);
        setError("Không thể tải dữ liệu biểu đồ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [year, month, displayCount, currentYear, currentMonth]);

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
    // Reset tháng về "Tất cả" khi đổi năm
    setMonth(0);
  };
  
  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value));
  };
  
  const handleDisplayCountChange = (e) => {
    setDisplayCount(Number(e.target.value));
  };

  // Giới hạn tháng cho năm hiện tại
  const availableMonths = year === currentYear 
    ? monthNames.slice(0, currentMonth + 1) // Chỉ hiển thị đến tháng hiện tại
    : monthNames; // Hiện tất cả các tháng

  return (
    <div className="chart-container">
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
            {availableMonths.map((name, index) => (
              <option key={index} value={index}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          Hiển thị top: 
          <select value={displayCount} onChange={handleDisplayCountChange} style={{ marginLeft: '8px' }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </label>
      </div>
      
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div style={{ height: '500px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default RevenueByCinemaChart;