import React from 'react';
import { PortfolioItemWithStats, PortfolioSummary } from '../types/portfolio';
import styles from './Portfolio.module.css';

interface PortfolioProps {
  portfolioWithStats: PortfolioItemWithStats[];
  summary: PortfolioSummary;
  loading: boolean;
  onRemove: (id: string) => boolean;
  onAdd: () => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ 
  portfolioWithStats, 
  summary, 
  loading, 
  onRemove, 
  onAdd 
}) => {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('この投資記録を削除しますか？')) {
      onRemove(id);
    }
  };

  if (loading && portfolioWithStats.length === 0) {
    return (
      <div className={styles.portfolio}>
        <div className={styles.loading}>ポートフォリオを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className={styles.portfolio}>
      <div className={styles.header}>
        <h2 className={styles.title}>ポートフォリオ</h2>
        <button 
          className={styles.addButton}
          onClick={onAdd}
        >
          + ポートフォリオに追加
        </button>
      </div>

      {portfolioWithStats.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyMessage}>ポートフォリオが空です</div>
          <div className={styles.emptySubMessage}>
            暗号通貨を追加してポートフォリオの管理を始めましょう
          </div>
          <button 
            className={styles.addButton}
            onClick={onAdd}
          >
            最初の投資を追加
          </button>
        </div>
      ) : (
        <>
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>総資産価値</div>
              <div className={styles.summaryValue}>
                {formatCurrency(summary.totalValue)}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>投資金額</div>
              <div className={styles.summaryValue}>
                {formatCurrency(summary.totalInvested)}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>損益</div>
              <div className={`${styles.summaryValue} ${summary.totalProfit >= 0 ? styles.profit : styles.loss}`}>
                {formatCurrency(summary.totalProfit)}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>損益率</div>
              <div className={`${styles.summaryValue} ${summary.totalProfitPercent >= 0 ? styles.profit : styles.loss}`}>
                {formatPercent(summary.totalProfitPercent)}
              </div>
            </div>
          </div>

          <div className={styles.portfolioTable}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>通貨</th>
                  <th>保有数量</th>
                  <th>価格</th>
                  <th>現在価値</th>
                  <th>損益</th>
                  <th>購入日</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {portfolioWithStats.map((item) => (
                  <tr key={item.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className={styles.coinInfo}>
                        <div>
                          <div className={styles.coinSymbol}>{item.symbol.toUpperCase()}</div>
                          <div className={styles.coinName}>{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.amount}>{item.amount.toLocaleString()}</div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.priceChange}>
                        <div className={styles.currentPrice}>{formatCurrency(item.currentPrice)}</div>
                        <div className={styles.purchasePrice}>
                          購入: {formatCurrency(item.purchasePrice)}
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.amount}>{formatCurrency(item.currentValue)}</div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={`${styles.profitLoss} ${item.profit >= 0 ? styles.profit : styles.loss}`}>
                        <div>{formatCurrency(item.profit)}</div>
                        <div className={styles.profitPercent}>
                          {formatPercent(item.profitPercent)}
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      {formatDate(item.purchaseDate)}
                    </td>
                    <td className={styles.tableCell}>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(item.id)}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};