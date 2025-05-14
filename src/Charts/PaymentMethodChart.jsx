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
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { exportToExcel } from '../utils/excelExport';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PaymentMethodChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(0);

  const monthNames = [
    'Tất cả các tháng', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  
  // Hàm xử lý khi click xuất Excel
  const handleExportExcel = () => {
    // Dữ liệu đã được định dạng phù hợp cho Excel
    const formattedData = [];
    
    // Nhóm dữ liệu theo phương thức thanh toán
    const paymentMethods = [...new Set(rawData.map(item => item.payment_method_name))];
    paymentMethods.forEach(methodName => {
      const methodItems = rawData.filter(item => item.payment_method_name === methodName);
      
      // Tổng hợp số giao dịch và doanh thu
      const totalTransactions = methodItems.reduce((sum, item) => sum + item.transaction_count, 0);
      const totalRevenue = methodItems.reduce((sum, item) => sum + item.total_revenue, 0);
      
      formattedData.push({
        'Phương thức thanh toán': methodName,
        'Số lượng giao dịch': totalTransactions,
        'Doanh thu': totalRevenue.toLocaleString('vi-VN') + ' VND',
        'Năm': year,
        'Tháng': month === 0 ? 'Tất cả các tháng' : `Tháng ${month}`
      });
    });
    
    // Tên file dựa trên tùy chọn đang hiển thị
    const monthText = month === 0 ? 'tat-ca' : `thang-${month}`;
    const filename = `phuong-thuc-thanh-toan-nam-${year}-${monthText}`;
    
    exportToExcel(formattedData, filename);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/visualization/payment_method`);
        const apiData = response.data.results;

        // Filter data by year and month
        let filteredData = apiData.filter(item => item.year === year);
        if (month > 0) {
          filteredData = filteredData.filter(item => item.month === month);
        }
        
        // Lưu dữ liệu thô cho xuất Excel
        setRawData(filteredData);

        if (filteredData.length === 0) {
          setError(`Không có dữ liệu cho ${monthNames[month]} năm ${year}`);
          setChartData(null);
          return;
        }

        // Group by payment method
        const paymentMethods = [...new Set(filteredData.map(item => item.payment_method_name))];
        
        setChartData({
          labels: paymentMethods,
          datasets: [
            {
              label: 'Số giao dịch',
              data: paymentMethods.map(method => {
                const methodData = filteredData.filter(item => item.payment_method_name === method);
                return methodData.reduce((sum, item) => sum + item.transaction_count, 0);
              }),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1,
            },
            {
              label: 'Doanh thu (triệu VNĐ)',
              data: paymentMethods.map(method => {
                const methodData = filteredData.filter(item => item.payment_method_name === method);
                return Number((methodData.reduce((sum, item) => sum + item.total_revenue / 1000000, 0)).toFixed(2));
              }),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 1,
            },
          ],
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching payment method data:', err);
        setError('Không thể tải dữ liệu biểu đồ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Thống kê phương thức thanh toán ${month === 0 ? '' : monthNames[month]} năm ${year}`,
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label.includes('Doanh thu')) {
              return `${label}: ${value.toFixed(2)} triệu VNĐ`;
            }
            return `${label}: ${new Intl.NumberFormat('vi-VN').format(value)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
    setMonth(0);
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

export default PaymentMethodChart;