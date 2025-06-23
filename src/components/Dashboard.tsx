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
  const [expandedChartIds, setExpandedChartIds] = useState<string[]>([]);
  const [isClosingChart, setIsClosingChart] = useState(false);
  const [isOpeningChart, setIsOpeningChart] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChartId, setPendingChartId] = useState<string | null>(null);

  const handleChartToggle = async (cryptoId: string, isExpanding: boolean) => {
    if (isExpanding) {
      // Check if chart limit is reached
      if (expandedChartIds.length >= 3 && !expandedChartIds.includes(cryptoId)) {
        setShowLimitWarning(true);
        setPendingChartId(cryptoId);
        setShowConfirmDialog(true);
        setTimeout(() => setShowLimitWarning(false), 5000);
        return;
      }
      
      setIsOpeningChart(true);
      setExpandedChartIds(prev => 
        prev.includes(cryptoId) ? prev : [...prev, cryptoId]
      );
      setIsOpeningChart(false);
    } else {
      setExpandedChartIds(prev => prev.filter(id => id !== cryptoId));
    }
  };

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
            <PriceCard 
              key={crypto.id} 
              crypto={crypto}
              isExpanded={expandedChartIds.includes(crypto.id)}
              onChartToggle={(isExpanding) => handleChartToggle(crypto.id, isExpanding)}
              isClosingChart={isClosingChart}
              isOpeningChart={isOpeningChart && expandedChartIds.includes(crypto.id)}
            />
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
        
        {showLimitWarning && (
          <div className={styles.toast}>
            <div className={styles.toastContent}>
              <div className={styles.toastIcon}>⚠️</div>
              <div className={styles.toastText}>
                APIの制限により、異なる通貨のチャート表示は3つまでです。4つ目を開くとネットワークエラーが発生します。
              </div>
            </div>
          </div>
        )}
        
        {showConfirmDialog && pendingChartId && (
          <div className={styles.modalOverlay} onClick={() => setShowConfirmDialog(false)}>
            <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
              <h3 className={styles.confirmTitle}>チャート表示の制限</h3>
              <p className={styles.confirmMessage}>
                4つ目のチャートはAPI制限により確認できません。
                既存のチャートを閉じてから新しいチャートを開いてください。
              </p>
              <div className={styles.confirmButtons}>
                <button 
                  className={styles.confirmButton}
                  onClick={() => setShowConfirmDialog(false)}
                >
                  了解
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};