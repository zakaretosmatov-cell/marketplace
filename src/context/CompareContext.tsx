'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/lib/types';

interface CompareContextType {
  items: Product[];
  addToCompare: (p: Product) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType>({
  items: [], addToCompare: () => {}, removeFromCompare: () => {}, clearCompare: () => {}, isInCompare: () => false
});

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const addToCompare = (p: Product) => {
    setItems(prev => {
      if (prev.find(x => x.id === p.id)) return prev;
      if (prev.length >= 3) return [...prev.slice(1), p]; // max 3
      return [...prev, p];
    });
  };

  const removeFromCompare = (id: string) => setItems(prev => prev.filter(p => p.id !== id));
  const clearCompare = () => setItems([]);
  const isInCompare = (id: string) => items.some(p => p.id === id);

  return (
    <CompareContext.Provider value={{ items, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);
