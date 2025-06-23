import { PortfolioItem } from '../types/portfolio';

const STORAGE_KEY = 'crypto-portfolio';

export const portfolioService = {
  getPortfolio(): PortfolioItem[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const items = JSON.parse(stored);
      return items.map((item: any) => ({
        ...item,
        purchaseDate: new Date(item.purchaseDate)
      }));
    } catch {
      return [];
    }
  },

  savePortfolio(items: PortfolioItem[]): void {
    console.log('portfolioService.savePortfolio - Saving items:', items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    console.log('portfolioService.savePortfolio - Saved to localStorage');
  },

  addItem(item: Omit<PortfolioItem, 'id'>): PortfolioItem {
    const items = this.getPortfolio();
    const newItem: PortfolioItem = {
      ...item,
      id: Date.now().toString()
    };
    console.log('portfolioService.addItem - Current items:', items);
    console.log('portfolioService.addItem - New item:', newItem);
    items.push(newItem);
    this.savePortfolio(items);
    console.log('portfolioService.addItem - Saved items:', items);
    return newItem;
  },

  updateItem(id: string, updates: Partial<PortfolioItem>): boolean {
    const items = this.getPortfolio();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    items[index] = { ...items[index], ...updates };
    this.savePortfolio(items);
    return true;
  },

  deleteItem(id: string): boolean {
    const items = this.getPortfolio();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    
    this.savePortfolio(filtered);
    return true;
  },

  clearPortfolio(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};