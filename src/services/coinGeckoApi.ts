import axios from 'axios';
import { CryptoCurrency, PriceData } from '../types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const coinGeckoApi = {
  async getTopCryptocurrencies(limit: number = 10): Promise<CryptoCurrency[]> {
    try {
      const response = await api.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cryptocurrencies:', error);
      throw error;
    }
  },

  async getSimplePrices(ids: string[]): Promise<PriceData> {
    try {
      const response = await api.get('/simple/price', {
        params: {
          ids: ids.join(','),
          vs_currencies: 'usd',
          include_24hr_change: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching prices:', error);
      throw error;
    }
  },
};