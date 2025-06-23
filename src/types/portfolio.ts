export interface PortfolioItem {
  id: string;
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: Date;
}

export interface PortfolioItemWithStats extends PortfolioItem {
  currentPrice: number;
  currentValue: number;
  purchaseValue: number;
  profit: number;
  profitPercent: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalProfit: number;
  totalProfitPercent: number;
  items: PortfolioItemWithStats[];
}