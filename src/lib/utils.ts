import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date, options: Intl.DateTimeFormatOptions = {}) {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  return date.toLocaleDateString('en-US', defaultOptions);
}

export function truncate(text: string, maxLength: number, ellipsis: boolean = true) {
  if (text.length <= maxLength) return text;
  return ellipsis ? `${text.substring(0, maxLength)}...` : text.substring(0, maxLength);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function getTimeAgo(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `${interval} ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }
  
  return 'just now';
}

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'https://gazelle-back.onrender.com/api';
export const API_BASE = API_URL.replace('/api', '');

// Helper function to get proper image URL
export function getImageUrl(imageUrl?: string, fallback: string = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=500&fit=crop'): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return fallback;
  }
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // If it's a relative path, prepend the API base URL
  return `${API_BASE}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
}
