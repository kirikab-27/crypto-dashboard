import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { coinGeckoApi } from '../services/coinGeckoApi';
import { PortfolioItem } from '../types/portfolio';
import styles from './AddToPortfolioModal.module.css';

interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
}

interface Props {
  onClose: () => void;
  onAdd: (item: Omit<PortfolioItem, 'id'>) => void;
}

export const AddToPortfolioModal: React.FC<Props> = ({ onClose, onAdd }) => {

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowResults(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<SearchResult | null>(null);
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<number>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.length >= 2 && !selectedCoin) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = window.setTimeout(async () => {
        setIsSearching(true);
        try {
          const results = await coinGeckoApi.searchCoins(searchQuery);
          setSearchResults(results.slice(0, 10));
          // Only show results if input still matches and no coin is selected
          if (searchQuery.length >= 2 && !selectedCoin) {
            setShowResults(true);
          }
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
          setShowResults(false);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedCoin]);

  const handleCoinSelect = (coin: SearchResult) => {
    setSelectedCoin(coin);
    setSearchQuery(coin.name);
    setShowResults(false);
    setErrors(prev => ({ ...prev, coin: '' }));
    console.log('Selected coin:', coin);
    
    // Remove focus from input field
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedCoin) {
      newErrors.coin = '通貨を選択してください';
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = '有効な数量を入力してください';
    }

    if (!purchasePrice || parseFloat(purchasePrice) <= 0) {
      newErrors.purchasePrice = '有効な購入価格を入力してください';
    }

    if (!purchaseDate) {
      newErrors.purchaseDate = '購入日を選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Validation:', {
      selectedCoin,
      amount,
      purchasePrice,
      isValid: selectedCoin && amount && !isNaN(Number(amount)) && Number(amount) > 0 && purchasePrice && !isNaN(Number(purchasePrice)) && Number(purchasePrice) > 0
    });
    
    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    try {
      const newItem = {
        coinId: selectedCoin!.id,
        symbol: selectedCoin!.symbol,
        name: selectedCoin!.name,
        amount: parseFloat(amount),
        purchasePrice: parseFloat(purchasePrice),
        purchaseDate: new Date(purchaseDate),
      };
      
      console.log('Adding item to portfolio:', newItem);
      onAdd(newItem);
      console.log('Item added to portfolio');
      
      onClose();
    } catch (error) {
      console.error('Failed to add to portfolio:', error);
      setErrors({ submit: 'ポートフォリオへの追加に失敗しました' });
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>ポートフォリオに追加</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              通貨 <span className={styles.required}>*</span>
            </label>
            <div className={styles.searchContainer}>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  
                  // Clear selected coin if user modifies the input
                  if (selectedCoin && value !== selectedCoin.name) {
                    setSelectedCoin(null);
                  }
                  
                  // Show suggestions only if there's input and no coin is selected
                  if (value.trim() && !selectedCoin) {
                    // Will be handled by useEffect
                  } else if (!value.trim()) {
                    setShowResults(false);
                  }
                }}
                onFocus={() => {
                  // Show results on focus only if there's input and no coin selected
                  if (searchQuery.trim() && !selectedCoin && searchResults.length > 0) {
                    setShowResults(true);
                  }
                }}
                onBlur={() => {
                  // Delay hiding to allow click events to register
                  setTimeout(() => setShowResults(false), 150);
                }}
                placeholder="通貨名またはシンボルを検索..."
                autoComplete="off"
              />
              
              {showResults && (
                <div className={styles.searchResults}>
                  {isSearching ? (
                    <div className={styles.loading}>検索中...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((coin) => (
                      <div
                        key={coin.id}
                        className={styles.searchResult}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleCoinSelect(coin);
                        }}
                      >
                        <div className={styles.coinInfo}>
                          <div className={styles.coinName}>{coin.name}</div>
                          <div className={styles.coinSymbol}>{coin.symbol}</div>
                        </div>
                        {coin.market_cap_rank && (
                          <div className={styles.coinPrice}>
                            ランク #{coin.market_cap_rank}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className={styles.loading}>検索結果がありません</div>
                  )}
                </div>
              )}
            </div>
            {errors.coin && <div className={styles.error}>{errors.coin}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              保有数量 <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              className={styles.input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onFocus={() => setShowResults(false)}
              placeholder="例: 1.5"
            />
            {errors.amount && <div className={styles.error}>{errors.amount}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              購入価格 (USD) <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              className={styles.input}
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              onFocus={() => setShowResults(false)}
              placeholder="例: 50000"
            />
            {errors.purchasePrice && <div className={styles.error}>{errors.purchasePrice}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              購入日 <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              className={styles.input}
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              onFocus={() => setShowResults(false)}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.purchaseDate && <div className={styles.error}>{errors.purchaseDate}</div>}
          </div>

          {errors.submit && <div className={styles.error}>{errors.submit}</div>}

          <div className={styles.buttons}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              キャンセル
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!selectedCoin || !amount || !purchasePrice}
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};