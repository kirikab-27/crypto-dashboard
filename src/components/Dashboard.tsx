import React from 'react';
import { useCryptoData } from '../hooks/useCryptoData';
import { PriceCard } from './PriceCard';
import { format } from 'date-fns';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const { data: cryptos, isLoading, isError, error, refetch } = useCryptoData(10);

  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Crypto Dashboard</h1>
            <p className={styles.subtitle}>Real-time cryptocurrency prices</p>
          </div>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Crypto Dashboard</h1>
            <p className={styles.subtitle}>Real-time cryptocurrency prices</p>
          </div>
          <div className={styles.error}>
            <div className={styles.errorTitle}>Error Loading Data</div>
            <div className={styles.errorMessage}>
              {error?.message || 'Failed to fetch cryptocurrency data'}
            </div>
            <button className={styles.refreshButton} onClick={() => refetch()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crypto Dashboard</h1>
          <p className={styles.subtitle}>Real-time cryptocurrency prices</p>
        </div>
        
        <div className={styles.grid}>
          {cryptos?.map((crypto) => (
            <PriceCard key={crypto.id} crypto={crypto} />
          ))}
        </div>
        
        {cryptos && cryptos.length > 0 && (
          <div className={styles.lastUpdated}>
            Last updated: {format(new Date(cryptos[0].last_updated), 'PPpp')}
          </div>
        )}
      </div>
    </div>
  );
};