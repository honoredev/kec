import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import KecHeader from '@/components/KecHeader';

const Fun = () => {
  const [funContent, setFunContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunContent();
  }, []);

  const fetchFunContent = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/fun');
      if (response.ok) {
        const data = await response.json();
        setFunContent(data.funContent || []);
      }
    } catch (error) {
      console.error('Error fetching fun content:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleLike = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/fun/${id}/like`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const updatedItem = await response.json();
        setFunContent(prev => prev.map(item => 
          item.id === id ? updatedItem : item
        ));
      }
    } catch (error) {
      console.error('Error liking content:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <KecHeader />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">Loading fun content...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <KecHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fun Zone</h1>
          <p className="text-gray-600">Memes, viral content, and everything fun!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {funContent.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="p-4 flex items-center justify-between border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{item.author[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.author}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(item.createdAt)}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{item.title}</h3>
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-64 object-cover"
                  />
                )}
              </div>

              {/* Actions */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleLike(item.id)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.likes.toLocaleString()}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-green-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.shares}</span>
                    </button>
                  </div>
                  <button className="text-gray-600 hover:text-yellow-500 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="bg-[#021b41] text-white px-6 py-3 rounded-lg hover:bg-[#021b41]/90 transition-colors">
            Load More Fun Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default Fun;