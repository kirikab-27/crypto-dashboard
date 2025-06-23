import axios from 'axios';
import { CryptoCurrency, PriceData, ChartData } from '../types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastRequestTime = 0;
  private readonly minInterval = 2000; // 2秒間隔に変更（レート制限対策強化）
  private requestCount = 0;
  private windowStart = Date.now();
  private readonly maxRequestsPerMinute = 50; // 安全マージンを設けて50リクエスト/分に制限

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await this.executeWithRetry(request);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async executeWithRetry<T>(request: () => Promise<T>, maxRetries = 3): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await request();
      } catch (error: any) {
        console.log(`API request attempt ${attempt} failed:`, error.message);
        
        // レート制限エラー（429）またはネットワークエラーの場合はリトライ
        if (
          (error.response?.status === 429 || 
           error.message?.includes('timeout') || 
           error.message?.includes('Network Error')) &&
          attempt < maxRetries
        ) {
          const delay = Math.pow(2, attempt) * 1000; // 指数バックオフ
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        throw error;
      }
    }
    throw new Error('Max retries exceeded');
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      await this.checkRateLimit();
      
      const request = this.queue.shift();
      if (request) {
        this.lastRequestTime = Date.now();
        this.requestCount++;
        await request();
      }
    }
    
    this.processing = false;
  }

  private async checkRateLimit() {
    const now = Date.now();
    const windowDuration = 60 * 1000; // 1分
    
    // 1分経過したらリセット
    if (now - this.windowStart > windowDuration) {
      this.requestCount = 0;
      this.windowStart = now;
    }
    
    // リクエスト制限に達した場合は待機
    if (this.requestCount >= this.maxRequestsPerMinute) {
      const waitTime = windowDuration - (now - this.windowStart);
      console.log(`Rate limit reached. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.windowStart = Date.now();
    }
    
    // 最小間隔の確保
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastRequest));
    }
  }
}

const requestQueue = new RequestQueue();

interface CacheEntry {
  data: ChartData;
  timestamp: number;
}

class ChartDataCache {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5分

  getCacheKey(coinId: string, days: number): string {
    return `${coinId}-${days}`;
  }

  get(coinId: string, days: number): ChartData | null {
    const key = this.getCacheKey(coinId, days);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    console.log('Using cached data for:', key);
    return entry.data;
  }

  set(coinId: string, days: number, data: ChartData): void {
    const key = this.getCacheKey(coinId, days);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.log('Cached data for:', key);
  }

  clear(): void {
    this.cache.clear();
  }
}

const chartCache = new ChartDataCache();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30秒に延長
});

export const coinGeckoApi = {
  async getTopCryptocurrencies(limit: number = 10): Promise<CryptoCurrency[]> {
    return requestQueue.add(async () => {
      try {
        const response = await api.get('/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: limit,
            page: 1,
            sparkline: false,
            include_24hr_change: true,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
        throw error;
      }
    });
  },

  async getSimplePrices(ids: string[]): Promise<PriceData> {
    return requestQueue.add(async () => {
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
    });
  },

  async fetchPriceHistory(coinId: string, days: number = 1): Promise<ChartData> {
    // キャッシュをチェック
    const cachedData = chartCache.get(coinId, days);
    if (cachedData) {
      return cachedData;
    }

    return requestQueue.add(async () => {
      try {
        const params: any = {
          vs_currency: 'usd',
          days: days,
        };

        console.log('Fetching price history for:', coinId, 'days:', days);
        const response = await api.get(`/coins/${coinId}/market_chart`, {
          params,
        });
        console.log('API response status:', response.status);
        console.log('API response data length:', response.data?.prices?.length);
        
        // データをキャッシュに保存
        chartCache.set(coinId, days, response.data);
        
        return response.data;
      } catch (error) {
        console.error('Error fetching price history:', error);
        console.error('Error details:', error.response?.data);
        throw error;
      }
    });
  },

  async searchCoins(query: string): Promise<any[]> {
    return requestQueue.add(async () => {
      try {
        const response = await api.get('/search', {
          params: {
            query: query,
          },
        });
        return response.data.coins || [];
      } catch (error) {
        console.error('Error searching coins:', error);
        throw error;
      }
    });
  },
};