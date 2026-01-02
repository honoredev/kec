const API_BASE_URL = 'https://kec-backend-1.onrender.com/api';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
};

export const articlesAPI = {
  getAll: (params?: any) => apiRequest(`/articles?${new URLSearchParams(params || {})}`),
  getById: (id: number) => apiRequest(`/articles/${id}`),
  getBreaking: () => apiRequest('/articles/breaking/all'),
  getLatest: (limit = 10) => apiRequest(`/articles/latest?limit=${limit}`),
  getFeatured: (limit = 6) => apiRequest(`/articles/featured?limit=${limit}`),
  search: (query: string, limit = 20) => apiRequest(`/articles/search?q=${encodeURIComponent(query)}&limit=${limit}`),
  incrementViews: (id: number) => apiRequest(`/articles/${id}/view`, { method: 'POST' }),
  create: (data: any) => apiRequest('/articles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiRequest(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest(`/articles/${id}`, { method: 'DELETE' }),
};

export const advertisementsAPI = {
  getAll: (params?: any) => apiRequest(`/advertisements?${new URLSearchParams(params || {})}`),
  getById: (id: number) => apiRequest(`/advertisements/${id}`),
  getFeatured: (limit = 6) => apiRequest(`/advertisements/featured?limit=${limit}`),
  incrementViews: (id: number) => apiRequest(`/advertisements/${id}/view`, { method: 'POST' }),
  trackApplication: (id: number) => apiRequest(`/advertisements/${id}/apply`, { method: 'POST' }),
  create: (data: any) => apiRequest('/advertisements', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiRequest(`/advertisements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest(`/advertisements/${id}`, { method: 'DELETE' }),
};

export const auctionsAPI = {
  getAll: (params?: any) => apiRequest(`/auctions?${new URLSearchParams(params || {})}`),
  getById: (id: number) => apiRequest(`/auctions/${id}`),
  getFeatured: (limit = 6) => apiRequest(`/auctions/featured?limit=${limit}`),
  getBids: (id: number) => apiRequest(`/auctions/${id}/bids`),
  placeBid: (id: number, amount: number) => apiRequest(`/auctions/${id}/bid`, { method: 'POST', body: JSON.stringify({ amount }) }),
  incrementWatchers: (id: number) => apiRequest(`/auctions/${id}/watch`, { method: 'POST' }),
  create: (data: any) => apiRequest('/auctions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiRequest(`/auctions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest(`/auctions/${id}`, { method: 'DELETE' }),
};

export default {
  articles: articlesAPI,
  advertisements: advertisementsAPI,
  auctions: auctionsAPI,
};