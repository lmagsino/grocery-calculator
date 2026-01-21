import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { GroceryItem, ShoppingTrip } from '../types';
import { generateId } from '../utils/formatCurrency';

interface GroceryContextType {
  // Current shopping list
  currentItems: GroceryItem[];

  // Computed values
  itemCount: number;
  total: number;

  // Item actions
  addItem: (name: string, price: number, barcode?: string) => void;
  updateItem: (id: string, name: string, price: number) => void;
  deleteItem: (id: string) => void;
  clearAllItems: () => void;

  // Shopping trip actions
  history: ShoppingTrip[];
  saveTrip: () => void;

  // Modal state
  isAddModalVisible: boolean;
  editingItem: GroceryItem | null;
  openAddModal: () => void;
  openEditModal: (item: GroceryItem) => void;
  closeModal: () => void;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export function GroceryProvider({ children }: { children: React.ReactNode }) {
  // Current shopping list state
  const [currentItems, setCurrentItems] = useState<GroceryItem[]>([]);

  // Shopping history state
  const [history, setHistory] = useState<ShoppingTrip[]>([]);

  // Modal state
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);

  // Computed values
  const itemCount = currentItems.length;

  const total = useMemo(() => {
    return currentItems.reduce((sum, item) => sum + item.price, 0);
  }, [currentItems]);

  // Item actions
  const addItem = useCallback((name: string, price: number, barcode?: string) => {
    const newItem: GroceryItem = {
      id: generateId(),
      name: name.trim() || 'Item',
      price,
      barcode,
      createdAt: new Date(),
    };
    setCurrentItems(prev => [...prev, newItem]);
    setIsAddModalVisible(false);
  }, []);

  const updateItem = useCallback((id: string, name: string, price: number) => {
    setCurrentItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, name: name.trim() || 'Item', price }
          : item
      )
    );
    setEditingItem(null);
    setIsAddModalVisible(false);
  }, []);

  const deleteItem = useCallback((id: string) => {
    setCurrentItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearAllItems = useCallback(() => {
    setCurrentItems([]);
  }, []);

  // Shopping trip actions
  const saveTrip = useCallback(() => {
    if (currentItems.length === 0) return;

    const newTrip: ShoppingTrip = {
      id: generateId(),
      date: new Date(),
      items: [...currentItems],
      total,
    };

    setHistory(prev => [newTrip, ...prev]);
    setCurrentItems([]);
  }, [currentItems, total]);

  // Modal actions
  const openAddModal = useCallback(() => {
    setEditingItem(null);
    setIsAddModalVisible(true);
  }, []);

  const openEditModal = useCallback((item: GroceryItem) => {
    setEditingItem(item);
    setIsAddModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setEditingItem(null);
    setIsAddModalVisible(false);
  }, []);

  const value: GroceryContextType = {
    currentItems,
    itemCount,
    total,
    addItem,
    updateItem,
    deleteItem,
    clearAllItems,
    history,
    saveTrip,
    isAddModalVisible,
    editingItem,
    openAddModal,
    openEditModal,
    closeModal,
  };

  return (
    <GroceryContext.Provider value={value}>
      {children}
    </GroceryContext.Provider>
  );
}

export function useGrocery() {
  const context = useContext(GroceryContext);
  if (context === undefined) {
    throw new Error('useGrocery must be used within a GroceryProvider');
  }
  return context;
}
