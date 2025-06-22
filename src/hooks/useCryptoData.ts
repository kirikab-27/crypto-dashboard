import { useQuery } from '@tanstack/react-query';
import { coinGeckoApi } from '../services/coinGeckoApi';
import { CryptoCurrency } from '../types/crypto';

export const useCryptoData = (limit: number = 10) => {
  return useQuery<CryptoCurrency[], Error>({
    queryKey: ['cryptoCurrencies', limit],
    queryFn: () => coinGeckoApi.getTopCryptocurrencies(limit),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};