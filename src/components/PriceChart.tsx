import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { coinGeckoApi } from '../services/coinGeckoApi';
import { ChartData as ApiChartData } from '../types/crypto';
import styles from './PriceChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceChartProps {
  coinId: string;
  coinName: string;
  color?: string;
}

type TimeRange = '1h' | '24h' | '7d' | '30d';

const timeRangeOptions = [
  { key: '1h' as TimeRange, label: '1H', days: 1/24 },
  { key: '24h' as TimeRange, label: '24H', days: 1 },
  { key: '7d' as TimeRange, label: '7D', days: 7 },
  { key: '30d' as TimeRange, label: '30D', days: 30 },
];

const PriceChart: React.FC<PriceChartProps> = ({ coinId, coinName, color = '#3B82F6' }) => {
  const [chartData, setChartData] = useState<ApiChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');

  useEffect(() => {
    fetchChartData();
  }, [coinId, selectedRange]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const option = timeRangeOptions.find(opt => opt.key === selectedRange);
      const days = option?.days || 1;
      console.log('Fetching chart data for range:', selectedRange, 'days:', days);
      const data = await coinGeckoApi.fetchPriceHistory(coinId, days);
      console.log('Chart data received:', data?.prices?.length, 'data points');
      
      if (!data || !data.prices || data.prices.length === 0) {
        setError('No data available for this time range');
        setChartData(null);
        return;
      }
      
      setChartData(data);
    } catch (err: any) {
      console.error('Error fetching chart data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (err.response?.status === 429) {
        setError('API rate limit reached. Please wait a moment and try again.');
      } else if (errorMessage.includes('timeout') || errorMessage.includes('Network Error')) {
        setError('Network timeout - please try again');
      } else if (errorMessage.includes('Max retries exceeded')) {
        setError('Connection failed after multiple attempts. Please check your internet connection.');
      } else {
        setError('Failed to load chart data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = () => {
    if (!chartData) return null;

    const getTimeFormat = () => {
      switch (selectedRange) {
        case '1h':
          return 'HH:mm';
        case '24h':
          return 'HH:mm';
        case '7d':
          return 'MM/dd';
        case '30d':
          return 'MM/dd';
        default:
          return 'HH:mm';
      }
    };

    // データが多すぎる場合はサンプリングする
    const maxDataPoints = selectedRange === '30d' ? 150 : selectedRange === '7d' ? 100 : chartData.prices.length;
    const step = Math.max(1, Math.floor(chartData.prices.length / maxDataPoints));
    const sampledPrices = chartData.prices.filter((_, index) => index % step === 0);

    console.log('Original data points:', chartData.prices.length, 'Sampled:', sampledPrices.length);

    const labels = sampledPrices.map(([timestamp]) => 
      format(new Date(timestamp), getTimeFormat())
    );

    const prices = sampledPrices.map(([, price]) => price);

    return {
      labels,
      datasets: [
        {
          label: `${coinName} Price (USD)`,
          data: prices,
          borderColor: color,
          backgroundColor: `${color}20`,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.1,
          fill: true,
        },
      ],
    };
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: color,
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `$${value.toFixed(value < 1 ? 4 : 2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          maxTicksLimit: 6,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value) {
            const numValue = value as number;
            return `$${numValue.toFixed(numValue < 1 ? 4 : 2)}`;
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  if (loading) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.loading}>Loading chart...</div>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.error}>
          <div>{error || 'No data available'}</div>
          {error && (
            <button 
              className={styles.retryButton}
              onClick={fetchChartData}
              disabled={loading}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  const data = formatChartData();
  if (!data) return null;

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <div className={styles.timeRangeButtons}>
          {timeRangeOptions.map((option) => (
            <button
              key={option.key}
              className={`${styles.timeRangeButton} ${
                selectedRange === option.key ? styles.active : ''
              }`}
              onClick={() => setSelectedRange(option.key)}
              disabled={loading}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;