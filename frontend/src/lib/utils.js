import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Indian Rupees
 * @param {number} price - The price to format
 * @returns {string} - Formatted price with ₹ symbol
 */
export function formatPrice(price) {
  if (price === null || price === undefined) return '₹0.00';
  return `₹${Number(price).toFixed(2)}`;
}
