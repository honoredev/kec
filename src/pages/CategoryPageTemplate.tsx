import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Eye, Clock, LucideIcon } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Sidebar from "@/components/Sidebar";
import { API_URL, getImageUrl as getImageUrlUtil } from "@/lib/utils";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: { name: string };
  publishedAt: string;
  views: number;
  readTime: string;
}

interface CategoryPageTemplateProps {
  categorySlug: string;
  categoryName: string;
  categoryNameRw: string;
  description: string;
  icon: LucideIcon;
  color: string;
  fallbackImage: string;
}

const CategoryPageTemplate = ({
  categorySlug,
  categoryName,
  categoryNameRw,
  description,
  icon: Icon,
  color,
  fallbackImage
}: CategoryPageTemplateProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://gazelle-back.onrender.com/api/articles?category=${categorySlug}`);
      const data = await response.json();
      console.log(`Category ${categorySlug} response:`, data);
      const articlesArray = data.articles || data || [];
      console.log(`Articles for ${categorySlug}:`, articlesArray);
      setArticles(Array.isArray(articlesArray) ? articlesArray : []);
    } catch (error) {
      console.error(`Error fetching ${categoryName} articles:`, error);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, categoryName]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const getImageUrl = (imageUrl?: string) => {
    return getImageUrlUtil(imageUrl, fallbackImage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={`Loading ${categoryName} News...`} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`bg-gradient-to-r from-${color}-600 to-${color}-500 text-white py-12`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-10 h-10" />
              <h1 className="text-4xl md:text-5xl font-bold">{categoryName}</h1>
            </div>
            <p className="text-lg text-white/90 max-w-2xl">{description}</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {articles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <Icon className={`w-16 h-16 text-${color}-600 mx-auto mb-4`} />
                <p className="text-gray-500 text-lg mb-2">No {categoryName.toLowerCase()} articles found yet.</p>
                <p className="text-gray-400">Add some articles in the admin panel!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <Link to={`/article/${article.id}`}>
                      <div className="h-48 overflow-hidden">
                        <img
                          src={getImageUrl(article.imageUrl)}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImage;
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{formatViews(article.views || 0)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{article.readTime || '2 min'} read</span>
                          </div>
                          <div className="text-gray-400">
                            {formatDate(article.publishedAt)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPageTemplate;
