export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  high_24h: number;
  low_24h: number;
  last_updated: string;
}

export interface PriceData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

export interface ChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}