import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Newspaper, Eye, Search, ChevronDown, 
  Loader2, AlertCircle, RefreshCw, ArrowLeft,
  ArrowRight, MessageSquare, Clock, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { fetchWithAuth, getImageUrl as getApiImageUrl } from "@/lib/config";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  publishedAt: Date;
  readTime: string;
  views: number;
  comments: number;
  shares: number;
  featured: boolean;
}

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper functions
  const getImageUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop';
    return getApiImageUrl(url);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  // Fetch news from database
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching news from API...');
        const response = await fetchWithAuth('/articles/latest?limit=100');
        
        console.log('News API response status:', response.status);
        
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        
        if (!response.ok) {
          let errorDetails = '';
          try {
            const errorData = await response.json();
            errorDetails = errorData.message || JSON.stringify(errorData);
          } catch (e) {
            const errorText = await response.text();
            errorDetails = errorText || 'No additional error details';
          }
          throw new Error(`Failed to load news (${response.status}): ${response.statusText}. ${errorDetails}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          const transformedNews = data.data.map((news: any) => {
            // Handle publish date
            let publishDate;
            try {
              publishDate = news.publishedAt ? new Date(news.publishedAt) : new Date();
            } catch (e) {
              console.warn('Invalid publish date, using current date:', news.publishedAt);
              publishDate = new Date();
            }
            
            // Handle image URL
            let imageUrl = '';
            if (news.imageUrl) {
              imageUrl = getImageUrl(news.imageUrl);
            } else if (news.images) {
              const firstImage = Array.isArray(news.images) 
                ? news.images[0] 
                : news.images.split(',')[0]?.trim();
              imageUrl = getImageUrl(firstImage || '');
            }
            
            return {
              id: news.id?.toString() || Math.random().toString(),
              title: news.title || 'Untitled News',
              content: news.content || '',
              excerpt: news.excerpt || news.content?.substring(0, 150) + '...' || '',
              image: imageUrl,
              category: news.category?.name || news.category || 'General',
              author: news.author?.name || news.author || 'Admin',
              publishedAt: publishDate,
              readTime: news.readTime || '2 min read',
              views: news.views || 0,
              comments: news.commentCount || 0,
              shares: news.shares || 0,
              featured: news.featured || false
            };
          });
          
          setNewsItems(transformedNews);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load news';
        console.error('Error in fetchNews:', {
          message: errorMessage,
          error: err,
          timestamp: new Date().toISOString()
        });
        setError(errorMessage);
        toast({
          title: 'Error Loading News',
          description: errorMessage.includes('500') 
            ? 'Server error. Please try again later or contact support if the problem persists.'
            : errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter and sort news
  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      news.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'popular') {
      return b.views - a.views;
    } else if (sortBy === 'featured') {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    } else {
      return b.publishedAt.getTime() - a.publishedAt.getTime();
    }
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading news...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No news found
  if (newsItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No news found</h3>
          <p className="text-gray-500 mt-2">There are no news articles available at the moment. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest News</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest news and articles from around the world.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* News Grid */}
          <div className="flex-1">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full sm:w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search news..."
                      className="pl-10 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-input rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="latest">Latest</option>
                      <option value="popular">Most Popular</option>
                      <option value="featured">Featured</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNews.map((news) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <Link to={`/news/${news.id}`}>
                    <div className="relative">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop';
                        }}
                      />
                      {news.featured && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                          Featured
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {news.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg line-clamp-2 h-14">{news.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{news.excerpt}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-3 border-t">
                        <div className="flex items-center">
                          <span>{news.author}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(news.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {formatNumber(news.views)}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {formatNumber(news.comments)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            {filteredNews.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Popular Categories */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Categories</h3>
              </div>
              <div className="p-4 space-y-2">
                {['All', 'Technology', 'Business', 'Science', 'Health', 'Entertainment', 'Sports', 'Politics'].map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start ${selectedCategory === category.toLowerCase() ? 'bg-gray-100' : ''}`}
                    onClick={() => setSelectedCategory(category.toLowerCase())}
                  >
                    {category}
                    <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {Math.floor(Math.random() * 50) + 10}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">Subscribe to get the latest news and updates.</p>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white"
                />
                <Button className="w-full">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
