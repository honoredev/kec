import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp, Megaphone, Gavel, Eye } from 'lucide-react';
import { API_URL, getImageUrl } from '@/lib/utils';

interface Article {
  id: number;
  title: string;
  imageUrl?: string;
  publishedAt?: string;
  createdAt?: string;
  views: number;
}

interface Advertisement {
  id: number;
  title: string;
  company: string;
  imageUrl?: string;
  createdAt?: string;
}

interface Auction {
  id: number;
  title: string;
  currentBid: number;
  imageUrl?: string;
  endTime: string;
  createdAt?: string;
}

const Sidebar = () => {
  const [latestNews, setLatestNews] = useState<Article[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    fetchLatestNews();
    fetchAdvertisements();
    fetchAuctions();
  }, []);

  // Auto-slide latest news every 4 seconds
  useEffect(() => {
    if (latestNews.length > 1) {
      const interval = setInterval(() => {
        setCurrentNewsIndex((prev) => (prev + 1) % latestNews.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [latestNews.length]);

  // Auto-slide advertisements every 5 seconds
  useEffect(() => {
    if (advertisements.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % advertisements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [advertisements.length]);

  const fetchLatestNews = async () => {
    try {
      const response = await fetch('https://gazelle-back.onrender.com/api/articles?limit=5');
      const data = await response.json();
      if (data.articles) {
        setLatestNews(data.articles);
      }
    } catch (error) {
      console.error('Error fetching latest news:', error);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const response = await fetch('https://gazelle-back.onrender.com/api/ads?limit=3');
      const data = await response.json();
      if (data.ads) {
        setAdvertisements(data.ads);
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    }
  };

  const fetchAuctions = async () => {
    try {
      const response = await fetch('https://gazelle-back.onrender.com/api/auctions?limit=3');
      const data = await response.json();
      if (data.auctions) {
        setAuctions(data.auctions);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Latest News */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="text-xl font-bold text-gray-900">Latest News</h3>
        </div>
        <div className="relative overflow-hidden">
          {latestNews.length > 0 ? (
            <>
              <div className="transition-transform duration-500 ease-in-out" style={{ transform: `translateY(-${currentNewsIndex * 100}px)` }}>
                {latestNews.map((article, index) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className={`flex gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors h-[100px] ${index === currentNewsIndex ? 'opacity-100' : 'opacity-50'}`}
                  >
                    {article.imageUrl && (
                      <img
                        src={getImageUrl(article.imageUrl)}
                        alt={article.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200&fit=crop';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(article.publishedAt || article.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {latestNews.length > 1 && (
                <div className="flex justify-center gap-1 mt-3">
                  {latestNews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentNewsIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentNewsIndex ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No latest news available</p>
          )}
        </div>
      </div>

      {/* Advertisements */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">AMATANGAZO</h3>
        </div>
        <div className="relative overflow-hidden">
          {advertisements.length > 0 ? (
            <>
              <div className="transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}>
                <div className="flex">
                  {advertisements.map((ad, index) => (
                    <Link
                      key={ad.id}
                      to={`/advertisement/${ad.id}`}
                      className={`block bg-white rounded-lg p-4 hover:shadow-md transition-shadow flex-shrink-0 w-full ${index === currentAdIndex ? 'opacity-100' : 'opacity-70'}`}
                    >
                      {ad.imageUrl && (
                        <img
                          src={getImageUrl(ad.imageUrl)}
                          alt={ad.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&fit=crop';
                          }}
                        />
                      )}
                      <h4 className="font-bold text-sm mb-1">{ad.title}</h4>
                      <p className="text-xs text-gray-600">{ad.company}</p>
                    </Link>
                  ))}
                </div>
              </div>
              {advertisements.length > 1 && (
                <div className="flex justify-center gap-1 mt-3">
                  {advertisements.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAdIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentAdIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No advertisements available</p>
          )}
        </div>
      </div>

      {/* Auctions/Market */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gavel className="w-5 h-5 text-orange-600" />
          <h3 className="text-xl font-bold text-gray-900">AMASOKO</h3>
        </div>
        <div className="space-y-4">
          {auctions.length > 0 ? (
            auctions.map((auction) => (
              <Link
                key={auction.id}
                to={`/auction/${auction.id}`}
                className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {auction.imageUrl && (
                  <img
                    src={getImageUrl(auction.imageUrl)}
                    alt={auction.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop';
                    }}
                  />
                )}
                <h4 className="font-bold text-sm mb-1">{auction.title}</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600 font-bold">
                    {auction.currentBid.toLocaleString()} RWF
                  </span>
                  <span className="text-gray-500">
                    Ends: {formatDate(auction.endTime)}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No active auctions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
