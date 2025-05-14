import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { exportToExcel } from '../utils/excelExport';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const PromotionRatioChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(0); // 0 = All months

  const monthNames = [
    'Tất cả các tháng', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  
  // Hàm xử lý khi click xuất Excel
  const handleExportExcel = () => {
    // Dữ liệu đã được định dạng phù hợp cho Excel
    const formattedData = rawData.map(item => ({
      'Năm': item.year,
      'Tháng': item.month === 0 ? 'Tất cả các tháng' : `Tháng ${item.month}`,
      'Tỷ lệ sử dụng': (item.used_ratio * 100).toFixed(2) + '%',
      'Số lượng sử dụng': item.used_count,
      // 'Tổng số khuyến mãi': item.total_count
    }));
    
    // Tên file dựa trên tùy chọn đang hiển thị
    const monthText = month === 0 ? 'tat-ca' : `thang-${month}`;
    const filename = `ty-le-su-dung-khuyen-mai-nam-${year}-${monthText}`;
    
    exportToExcel(formattedData, filename);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/visualization/promotion_ratio`);
        const apiData = response.data.results;

        // Filter data by year and month
        let filteredData = apiData.filter(item => item.year === year);
        if (month > 0) {
          filteredData = filteredData.filter(item => item.month === month);
        }
        
        // Lưu dữ liệu thô cho xuất Excel
        setRawData(filteredData);

        // Prepare labels and datasets
        const labels = filteredData.map(item => `${item.month}/${item.year}`);
        const usedRatioData = filteredData.map(item => item.used_ratio); // Remove *100 conversion
        const usedCountData = filteredData.map(item => item.used_count);

        if (filteredData.length === 0) {
          setError(`Không có dữ liệu cho ${monthNames[month]} năm ${year}`);
          setChartData(null);
        } else {
          setChartData({
            labels,
            datasets: [
              {
                label: 'Tỷ lệ đã sử dụng',
                data: usedRatioData,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                yAxisID: 'y',
              },
              {
                label: 'Số lượt đã sử dụng',
                data: usedCountData,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                yAxisID: 'y1',
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
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: `Biểu đồ tỷ lệ sử dụng khuyến mãi ${month === 0 ? '' : monthNames[month]} năm ${year}`,
      },
      datalabels: {
        display: true,
        color: 'black',
        anchor: 'end',
        align: 'top',
        formatter: (value, context) => {
          if (context.dataset.yAxisID === 'y') {
            return value.toFixed(4);
          }
          return value;
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 1,
        ticks: {
          callback: value => value.toFixed(2)
        },
        title: {
          display: true,
          text: 'Tỷ lệ sử dụng'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Số lượt sử dụng'
        }
      }
    }
  };

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
    setMonth(0); // Reset month to "All months" when year changes
  };

  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value));
  };

  return (
    <div className="chart-container">
      <div className="chart-controls" style={{ marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
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
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default PromotionRatioChart;