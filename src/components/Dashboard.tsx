import React, { useState } from 'react';
import { useCryptoData } from '../hooks/useCryptoData';
import { usePortfolio } from '../hooks/usePortfolio';
import { PriceCard } from './PriceCard';
import { Portfolio } from './Portfolio';
import { AddToPortfolioModal } from './AddToPortfolioModal';
import { format } from 'date-fns';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const { data: cryptos, isLoading, isError, error, refetch } = useCryptoData(10);
  const { portfolioWithStats, summary, loading: portfolioLoading, addToPortfolio, removeFromPortfolio } = usePortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        
        <Portfolio 
          portfolioWithStats={portfolioWithStats}
          summary={summary}
          loading={portfolioLoading}
          onRemove={removeFromPortfolio}
          onAdd={() => setIsModalOpen(true)}
        />
        
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
        
        {isModalOpen && (
          <AddToPortfolioModal 
            onClose={() => setIsModalOpen(false)}
            onAdd={(item) => {
              addToPortfolio(item);
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};