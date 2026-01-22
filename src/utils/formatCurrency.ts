/**
 * Currency formatting utilities for Philippine Peso (PHP)
 */

/**
 * Formats a number as Philippine Peso currency
 * @param amount - The amount to format
 * @returns Formatted string like "₱1,250.00"
 */
export function formatPeso(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Parses a peso string back to a number
 * Handles inputs like "₱1,250.00", "1250", "1,250.00"
 * @param value - The string to parse
 * @returns The numeric value or 0 if invalid
 */
export function parsePeso(value: string): number {
  // Remove peso sign, commas, and whitespace
  const cleaned = value.replace(/[₱,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formats a number for display in input fields (no peso sign)
 * @param amount - The amount to format
 * @returns Formatted string like "1,250.00"
 */
export function formatInputValue(amount: number): string {
  if (amount === 0) return '';
  return amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Generates a unique ID for items
 * @returns A unique string ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formats a date for display in history lists
 * @param date - The date to format
 * @returns Formatted string like "Jan 15, 2026"
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a date with time for detailed views
 * @param date - The date to format
 * @returns Formatted string like "Jan 15, 2026 at 2:30 PM"
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
