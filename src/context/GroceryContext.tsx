import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GroceryItem, ShoppingTrip } from '../types';
import { generateId } from '../utils/formatCurrency';
import { useStorage } from '../hooks/useStorage';

interface GroceryContextType {
  // Loading state
  isLoading: boolean;

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
  scannedProduct: { name: string; barcode: string } | null;
  openAddModal: () => void;
  openEditModal: (item: GroceryItem) => void;
  openAddModalWithScan: (name: string, barcode: string) => void;
  closeModal: () => void;

  // Scanner state
  isScannerVisible: boolean;
  openScanner: () => void;
  closeScanner: () => void;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export function GroceryProvider({ children }: { children: React.ReactNode }) {
  // Storage hook
  const { loadAllData, saveCurrentItems, saveHistory } = useStorage();

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  // Current shopping list state
  const [currentItems, setCurrentItems] = useState<GroceryItem[]>([]);

  // Shopping history state
  const [history, setHistory] = useState<ShoppingTrip[]>([]);

  // Modal state
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [scannedProduct, setScannedProduct] = useState<{ name: string; barcode: string } | null>(null);

  // Scanner state
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  // Load persisted data on mount
  useEffect(() => {
    async function loadPersistedData() {
      try {
        const { currentItems: savedItems, history: savedHistory } = await loadAllData();
        setCurrentItems(savedItems);
        setHistory(savedHistory);
      } catch (error) {
        console.error('Failed to load persisted data:', error);
      } finally {
        isInitialized.current = true;
        setIsLoading(false);
      }
    }

    loadPersistedData();
  }, [loadAllData]);

  // Auto-save current items when they change
  useEffect(() => {
    if (isInitialized.current) {
      saveCurrentItems(currentItems);
    }
  }, [currentItems, saveCurrentItems]);

  // Auto-save history when it changes
  useEffect(() => {
    if (isInitialized.current) {
      saveHistory(history);
    }
  }, [history, saveHistory]);

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
    setScannedProduct(null);
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
    setScannedProduct(null);
    setIsAddModalVisible(true);
  }, []);

  const openEditModal = useCallback((item: GroceryItem) => {
    setEditingItem(item);
    setScannedProduct(null);
    setIsAddModalVisible(true);
  }, []);

  const openAddModalWithScan = useCallback((name: string, barcode: string) => {
    setEditingItem(null);
    setScannedProduct({ name, barcode });
    setIsScannerVisible(false);
    setIsAddModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setEditingItem(null);
    setScannedProduct(null);
    setIsAddModalVisible(false);
  }, []);

  // Scanner actions
  const openScanner = useCallback(() => {
    setIsScannerVisible(true);
  }, []);

  const closeScanner = useCallback(() => {
    setIsScannerVisible(false);
  }, []);

  const value: GroceryContextType = {
    isLoading,
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
    scannedProduct,
    openAddModal,
    openEditModal,
    openAddModalWithScan,
    closeModal,
    isScannerVisible,
    openScanner,
    closeScanner,
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
