import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GroceryItem, ShoppingTrip } from '../types';

// Storage keys
const STORAGE_KEYS = {
  CURRENT_ITEMS: '@grocery_calculator:currentItems',
  HISTORY: '@grocery_calculator:history',
} as const;

/**
 * Serialized versions of our data types for AsyncStorage
 * Dates are converted to ISO strings
 */
interface SerializedGroceryItem {
  id: string;
  name: string;
  price: number;
  barcode?: string;
  createdAt: string; // ISO string
}

interface SerializedShoppingTrip {
  id: string;
  date: string; // ISO string
  items: SerializedGroceryItem[];
  total: number;
}

/**
 * Convert a GroceryItem to a serializable format
 */
function serializeItem(item: GroceryItem): SerializedGroceryItem {
  return {
    ...item,
    createdAt: item.createdAt.toISOString(),
  };
}

/**
 * Convert a serialized item back to a GroceryItem
 */
function deserializeItem(item: SerializedGroceryItem): GroceryItem {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
  };
}

/**
 * Convert a ShoppingTrip to a serializable format
 */
function serializeTrip(trip: ShoppingTrip): SerializedShoppingTrip {
  return {
    ...trip,
    date: trip.date.toISOString(),
    items: trip.items.map(serializeItem),
  };
}

/**
 * Convert a serialized trip back to a ShoppingTrip
 */
function deserializeTrip(trip: SerializedShoppingTrip): ShoppingTrip {
  return {
    ...trip,
    date: new Date(trip.date),
    items: trip.items.map(deserializeItem),
  };
}

/**
 * Custom hook for grocery data persistence
 */
export function useStorage() {
  /**
   * Save current items to AsyncStorage
   */
  const saveCurrentItems = useCallback(async (items: GroceryItem[]): Promise<void> => {
    try {
      const serialized = items.map(serializeItem);
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_ITEMS, JSON.stringify(serialized));
    } catch (error) {
      console.error('Failed to save current items:', error);
    }
  }, []);

  /**
   * Load current items from AsyncStorage
   */
  const loadCurrentItems = useCallback(async (): Promise<GroceryItem[]> => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_ITEMS);
      if (!json) return [];

      const serialized: SerializedGroceryItem[] = JSON.parse(json);
      return serialized.map(deserializeItem);
    } catch (error) {
      console.error('Failed to load current items:', error);
      return [];
    }
  }, []);

  /**
   * Save shopping history to AsyncStorage
   */
  const saveHistory = useCallback(async (trips: ShoppingTrip[]): Promise<void> => {
    try {
      const serialized = trips.map(serializeTrip);
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(serialized));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }, []);

  /**
   * Load shopping history from AsyncStorage
   */
  const loadHistory = useCallback(async (): Promise<ShoppingTrip[]> => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!json) return [];

      const serialized: SerializedShoppingTrip[] = JSON.parse(json);
      return serialized.map(deserializeTrip);
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }, []);

  /**
   * Load all persisted data at once
   */
  const loadAllData = useCallback(async (): Promise<{
    currentItems: GroceryItem[];
    history: ShoppingTrip[];
  }> => {
    const [currentItems, history] = await Promise.all([
      loadCurrentItems(),
      loadHistory(),
    ]);
    return { currentItems, history };
  }, [loadCurrentItems, loadHistory]);

  /**
   * Clear all persisted data
   */
  const clearAllData = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CURRENT_ITEMS,
        STORAGE_KEYS.HISTORY,
      ]);
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }, []);

  return {
    saveCurrentItems,
    loadCurrentItems,
    saveHistory,
    loadHistory,
    loadAllData,
    clearAllData,
  };
}
