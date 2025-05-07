import React, { useState, useEffect } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const TopFilmRatingChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(5); // Default show top 5

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/visualization/top_film_rating');
        const films = response.data.results
          .sort((a, b) => b.avg_rating - a.avg_rating)
          .slice(0, displayCount);

        if (films.length === 0) {
          setError('Không có dữ liệu đánh giá phim');
          return;
        }

        setChartData({
          labels: films.map(film => film.film_title),
          datasets: [
            {
              label: 'Điểm đánh giá trung bình',
              data: films.map(film => film.avg_rating),
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1,
              yAxisID: 'y',
            },
            {
              label: 'Số lượt đánh giá',
              data: films.map(film => film.total_reviews),
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 1,
              yAxisID: 'y1',
            },
          ],
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching film rating data:', err);
        setError('Không thể tải dữ liệu biểu đồ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [displayCount]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Top ${displayCount} Phim Được Đánh Giá Cao Nhất`,
        font: { size: 16 },
      },
      datalabels: {
        display: true,
        color: 'black',
        anchor: 'end',
        align: 'top',
        offset: 0,
        font: { weight: 'bold', size: 12 },
        formatter: (value, context) => {
          if (context.dataset.label.includes('trung bình')) {
            return value.toFixed(2);
          }
          return value;
        },
      },
    },
    scales: {
      y: {
        position: 'left',
        title: {
          display: true,
          text: 'Điểm đánh giá trung bình',
        },
        min: 0,
        max: 5,
      },
      y1: {
        position: 'right',
        title: {
          display: true,
          text: 'Số lượt đánh giá',
        },
        min: 0,
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div>
      <div className="chart-controls" style={{ marginBottom: '20px' }}>
        <label>
          Hiển thị top:
          <select
            value={displayCount}
            onChange={(e) => setDisplayCount(Number(e.target.value))}
            style={{ marginLeft: '8px' }}
          >
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
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default TopFilmRatingChart;
