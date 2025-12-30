const API_URL = 'https://gazelle-back.onrender.com/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  listArticles: () => request(`/articles`),
  getArticle: (id: number) => request(`/articles/${id}`),
  createArticle: (data: any) => request(`/articles`, { method: 'POST', body: JSON.stringify(data) }),
  updateArticle: (id: number, data: any) => request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteArticle: (id: number) => request(`/articles/${id}`, { method: 'DELETE' }),
  toggleBreaking: (id: number, is_breaking: boolean) => request(`/articles/${id}/breaking`, { method: 'PATCH', body: JSON.stringify({ is_breaking }) }),
  
  listAds: () => request(`/ads`),
  getAd: (id: number) => request(`/ads/${id}`),
  createAd: (data: any) => request(`/ads`, { method: 'POST', body: JSON.stringify(data) }),
  updateAd: (id: number, data: any) => request(`/ads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAd: (id: number) => request(`/ads/${id}`, { method: 'DELETE' }),
  
  listAuctions: () => request(`/auctions`),
  getAuction: (id: number) => request(`/auctions/${id}`),
  createAuction: (data: any) => request(`/auctions`, { method: 'POST', body: JSON.stringify(data) }),
  updateAuction: (id: number, data: any) => request(`/auctions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAuction: (id: number) => request(`/auctions/${id}`, { method: 'DELETE' }),
};