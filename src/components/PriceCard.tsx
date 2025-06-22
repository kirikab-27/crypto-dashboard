import React, { useEffect, useState } from 'react';
import { CryptoCurrency } from '../types/crypto';
import PriceChart from './PriceChart';
import styles from './PriceCard.module.css';

interface PriceCardProps {
  crypto: CryptoCurrency;
}

export const PriceCard: React.FC<PriceCardProps> = ({ crypto }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [previousPrice, setPreviousPrice] = useState(crypto.current_price);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (crypto.current_price !== previousPrice) {
      setIsUpdating(true);
      setPreviousPrice(crypto.current_price);
      const timer = setTimeout(() => setIsUpdating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [crypto.current_price, previousPrice]);

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    } else if (price >= 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      }).format(price);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    }
  };

  const getPriceChangeClass = (change: number): string => {
    if (change > 0) return styles.positive;
    if (change < 0) return styles.negative;
    return styles.neutral;
  };

  const formatPercentage = (percentage: number): string => {
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const handleCardClick = () => {
    setShowChart(!showChart);
  };

  const getChartColor = (): string => {
    const colors: { [key: string]: string } = {
      bitcoin: '#F7931A',
      ethereum: '#627EEA',
      tether: '#26A17B',
      'binancecoin': '#F3BA2F',
      solana: '#9945FF',
      'usd-coin': '#2775CA',
      'ripple': '#23292F',
      tron: '#FF0013',
    };
    return colors[crypto.id] || '#3B82F6';
  };

  return (
    <div className={`${styles.card} ${isUpdating ? styles.updating : ''} ${showChart ? styles.expanded : ''}`}>
      <div className={styles.cardContent} onClick={handleCardClick}>
        <div className={styles.header}>
          <div>
            <div className={styles.symbol}>{crypto.symbol}</div>
            <div className={styles.name}>{crypto.name}</div>
          </div>
          <div className={styles.rank}>#{crypto.market_cap_rank}</div>
        </div>
        
        <div className={styles.price}>{formatPrice(crypto.current_price)}</div>
        
        <div className={`${styles.priceChange} ${getPriceChangeClass(crypto.price_change_percentage_24h)}`}>
          {formatPercentage(crypto.price_change_percentage_24h)}
        </div>
        
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>24h High</span>
            <span className={styles.detailValue}>{formatPrice(crypto.high_24h)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>24h Low</span>
            <span className={styles.detailValue}>{formatPrice(crypto.low_24h)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Market Cap</span>
            <span className={styles.detailValue}>{formatNumber(crypto.market_cap)}</span>
          </div>
        </div>
      </div>
      
      {showChart && (
        <div className={styles.chartWrapper}>
          <PriceChart 
            coinId={crypto.id} 
            coinName={crypto.name}
            color={getChartColor()}
          />
        </div>
      )}
    </div>
  );
};