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

const PriceChart: React.FC<PriceChartProps> = ({ coinId, coinName, color = '#3B82F6' }) => {
  const [chartData, setChartData] = useState<ApiChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChartData();
  }, [coinId]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await coinGeckoApi.fetchPriceHistory(coinId, 1);
      setChartData(data);
    } catch (err) {
      setError('Failed to load chart data');
      console.error('Error fetching chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = () => {
    if (!chartData) return null;

    const labels = chartData.prices.map(([timestamp]) => 
      format(new Date(timestamp), 'HH:mm')
    );

    const prices = chartData.prices.map(([, price]) => price);

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
        <div className={styles.error}>{error || 'No data available'}</div>
      </div>
    );
  }

  const data = formatChartData();
  if (!data) return null;

  return (
    <div className={styles.chartContainer}>
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;