import { useState, useEffect, useCallback } from 'react';
import { PortfolioItem, PortfolioItemWithStats, PortfolioSummary } from '../types/portfolio';
import { portfolioService } from '../services/portfolioService';
import { coinGeckoApi } from '../services/coinGeckoApi';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [portfolioWithStats, setPortfolioWithStats] = useState<PortfolioItemWithStats[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    totalInvested: 0,
    totalProfit: 0,
    totalProfitPercent: 0,
    items: []
  });
  const [loading, setLoading] = useState(false);

  const loadPortfolio = useCallback(() => {
    const items = portfolioService.getPortfolio();
    console.log('usePortfolio.loadPortfolio - Loaded items:', items);
    setPortfolio(items);
  }, []);

  const calculatePortfolioStats = useCallback(async (items: PortfolioItem[]) => {
    if (items.length === 0) {
      setPortfolioWithStats([]);
      setSummary({
        totalValue: 0,
        totalInvested: 0,
        totalProfit: 0,
        totalProfitPercent: 0,
        items: []
      });
      return;
    }

    setLoading(true);
    try {
      const coinIds = [...new Set(items.map(item => item.coinId))];
      const prices = await coinGeckoApi.getSimplePrices(coinIds);

      const itemsWithStats: PortfolioItemWithStats[] = items.map(item => {
        const currentPrice = prices[item.coinId]?.usd || 0;
        const currentValue = item.amount * currentPrice;
        const purchaseValue = item.amount * item.purchasePrice;
        const profit = currentValue - purchaseValue;
        const profitPercent = purchaseValue > 0 ? (profit / purchaseValue) * 100 : 0;

        return {
          ...item,
          currentPrice,
          currentValue,
          purchaseValue,
          profit,
          profitPercent
        };
      });

      const totalValue = itemsWithStats.reduce((sum, item) => sum + item.currentValue, 0);
      const totalInvested = itemsWithStats.reduce((sum, item) => sum + item.purchaseValue, 0);
      const totalProfit = totalValue - totalInvested;
      const totalProfitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

      setPortfolioWithStats(itemsWithStats);
      setSummary({
        totalValue,
        totalInvested,
        totalProfit,
        totalProfitPercent,
        items: itemsWithStats
      });
    } catch (error) {
      console.error('Error calculating portfolio stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToPortfolio = useCallback((item: Omit<PortfolioItem, 'id'>) => {
    console.log('usePortfolio.addToPortfolio - Adding item:', item);
    const newItem = portfolioService.addItem(item);
    console.log('usePortfolio.addToPortfolio - New item returned:', newItem);
    loadPortfolio();
    console.log('usePortfolio.addToPortfolio - Portfolio reloaded');
    return newItem;
  }, [loadPortfolio]);

  const removeFromPortfolio = useCallback((id: string) => {
    const success = portfolioService.deleteItem(id);
    if (success) {
      loadPortfolio();
    }
    return success;
  }, [loadPortfolio]);

  const updatePortfolioItem = useCallback((id: string, updates: Partial<PortfolioItem>) => {
    const success = portfolioService.updateItem(id, updates);
    if (success) {
      loadPortfolio();
    }
    return success;
  }, [loadPortfolio]);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  useEffect(() => {
    calculatePortfolioStats(portfolio);
  }, [portfolio, calculatePortfolioStats]);

  return {
    portfolio,
    portfolioWithStats,
    summary,
    loading,
    addToPortfolio,
    removeFromPortfolio,
    updatePortfolioItem,
    refreshPortfolio: loadPortfolio
  };
};