import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { exportToExcel } from '../utils/excelExport';

// Đăng ký các components cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const RevenueByMonthChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() trả về 0-11
  const [year, setYear] = useState(currentYear > 2025 ? 2025 : (currentYear < 2024 ? 2024 : currentYear));
  const [displayMode, setDisplayMode] = useState('all'); // 'all' hoặc 'nonzero'

  // Tên tháng để hiển thị
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  
  // Hàm xử lý khi click xuất Excel
  const handleExportExcel = () => {
    // Dữ liệu đã được định dạng phù hợp cho Excel
    const formattedData = rawData.map(item => ({
      'Tháng': `Tháng ${item.month}`,
      'Doanh thu': item.total_revenue.toLocaleString('vi-VN') + ' VND',
      'Năm': item.year
    }));
    
    // Tên file dựa trên tùy chọn đang hiển thị
    const displayText = displayMode === 'nonzero' ? 'thang-co-doanh-thu' : 'tat-ca';
    const filename = `doanh-thu-theo-thang-nam-${year}-${displayText}`;
    
    exportToExcel(formattedData, filename);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/visualization/total_revenue_by_month`);
        
        // Lọc dữ liệu theo năm
        const filteredData = response.data.results.filter(item => item.year === year);
        
        // Lưu dữ liệu thô cho xuất Excel
        setRawData(filteredData);
        
        // Sắp xếp dữ liệu theo tháng
        const sortedData = filteredData.sort((a, b) => a.month - b.month);
        
        // Xác định số tháng cần hiển thị
        // Nếu là năm hiện tại, chỉ hiển thị đến tháng hiện tại
        // Nếu là các năm khác, hiển thị đủ 12 tháng
        const monthLimit = (year === currentYear) ? currentMonth : 12;
        
        // Tạo mảng có đủ tháng, với tháng không có dữ liệu thì gán giá trị 0
        const monthlyData = Array(monthLimit).fill(0);
        sortedData.forEach(item => {
          if (item.month <= monthLimit) {
            monthlyData[item.month - 1] = item.total_revenue;
          }
        });

        // Tìm tháng đầu tiên có doanh thu
        const firstMonthWithRevenue = monthlyData.findIndex(value => value > 0);
        
        // Xác định các tháng và dữ liệu hiển thị dựa trên mode
        let visibleMonths, visibleData;
        
        if (displayMode === 'nonzero' && firstMonthWithRevenue !== -1) {
          // Chỉ lấy từ tháng đầu tiên có doanh thu đến hết
          visibleMonths = monthNames.slice(firstMonthWithRevenue, monthLimit);
          visibleData = monthlyData.slice(firstMonthWithRevenue);
        } else {
          // Hiển thị tất cả các tháng
          visibleMonths = monthNames.slice(0, monthLimit);
          visibleData = monthlyData;
        }
        
        // Tính toán giá trị min và max cho trục Y
        const values = visibleData.filter(value => value > 0); // Chỉ xét các giá trị có dữ liệu
        const maxValue = values.length > 0 ? Math.max(...values) : 0;
        const minValue = values.length > 0 ? Math.min(...values) : 0;
        
        // Tính khoảng cách phù hợp cho trục Y để thấy rõ sự chênh lệch
        let yMin = 0; // Mặc định bắt đầu từ 0
        // Nếu có đủ dữ liệu và chênh lệch giữa các giá trị nhỏ, điều chỉnh min
        if (values.length > 1 && (maxValue - minValue) / maxValue < 0.5) {
          yMin = Math.floor(minValue * 0.8 / 10000000) * 10000000;
        }
        // Làm tròn max lên một chút để có khoảng trống phía trên
        const yMax = Math.ceil(maxValue * 1.1 / 10000000) * 10000000;
        
        setChartData({
          labels: visibleMonths,
          datasets: [
            {
              label: 'Doanh thu (VND)',
              data: visibleData,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              tension: 0.3,
              pointBackgroundColor: 'rgb(75, 192, 192)',
              pointRadius: 5,
              pointHoverRadius: 7,
              spanGaps: true, // Không vẽ đường giữa các điểm 0
              segment: {
                borderColor: ctx => ctx.p0.parsed.y === 0 || ctx.p1.parsed.y === 0 
                  ? 'rgba(0,0,0,0)' // Ẩn đường giữa các điểm 0
                  : undefined
              }
            }
          ]
        });
        
        // Cập nhật options với min và max mới tính toán
        setChartOptions({
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: `Doanh thu theo tháng năm ${year}`,
              font: {
                size: 18
              }
            },
            datalabels: {
              display: ctx => ctx.dataset.data[ctx.dataIndex] > 0, // Chỉ hiển thị nhãn cho giá trị > 0
              color: 'black',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 4,
              padding: {
                top: 4,
                bottom: 4,
                left: 6,
                right: 6
              },
              font: {
                weight: 'bold',
                size: 10
              },
              formatter: (value) => {
                if (value === 0) return '';
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
                  if (value === 0) return 'Không có doanh thu';
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
              beginAtZero: yMin === 0,
              min: yMin,
              max: yMax,
              ticks: {
                stepSize: (yMax - yMin) / 10,
                callback: function(value) {
                  return new Intl.NumberFormat('vi-VN', {
                    notation: 'compact',
                    compactDisplay: 'short',
                    maximumFractionDigits: 1
                  }).format(value);
                }
              }
            }
          }
        });
        
        setError(null);
      } catch (err) {
        console.error("Error fetching monthly revenue data:", err);
        setError("Không thể tải dữ liệu biểu đồ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [year, currentYear, currentMonth, displayMode]);

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
  };
  
  const handleDisplayModeChange = (e) => {
    setDisplayMode(e.target.value);
  };

  return (
    <div className="chart-container">
      <div className="chart-controls" style={{ marginBottom: '20px', display: 'flex', gap: '20px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <label>
            Chọn năm: 
            <select value={year} onChange={handleYearChange} style={{ marginLeft: '8px' }}>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
          </label>
          <label>
            Hiển thị: 
            <select value={displayMode} onChange={handleDisplayModeChange} style={{ marginLeft: '8px' }}>
              <option value="all">Tất cả các tháng</option>
              <option value="nonzero">Chỉ tháng có doanh thu</option>
            </select>
          </label>
        </div>
        
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={handleExportExcel}
          disabled={loading || error}
        >
          Xuất Excel
        </Button>
      </div>
      
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div style={{ height: '500px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default RevenueByMonthChart;