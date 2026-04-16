'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/types';

interface RecentlyViewedContextType {
  items: Product[];
  addItem: (product: Product) => void;
  clear: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType>({
  items: [], addItem: () => {}, clear: () => {}
});

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recently_viewed');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const addItem = (product: Product) => {
    setItems(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const next = [product, ...filtered].slice(0, 10);
      localStorage.setItem('recently_viewed', JSON.stringify(next));
      return next;
    });
  };

  const clear = () => {
    setItems([]);
    localStorage.removeItem('recently_viewed');
  };

  return (
    <RecentlyViewedContext.Provider value={{ items, addItem, clear }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);
