import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import AudioStreamPlayer from "@/components/AudioStreamPlayer";

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [audioStreamEnabled, setAudioStreamEnabled] = useState(false);
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const [articleViews, setArticleViews] = useState({});
  const [funContent, setFunContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [trendingPage, setTrendingPage] = useState(1);
  const [culturePage, setCulturePage] = useState(1);
  const [environmentPage, setEnvironmentPage] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const generateViews = (articleId) => {
    const baseViews = Math.random() < 0.3 ? Math.floor(Math.random() * 500) + 100 : Math.floor(Math.random() * 50000) + 1000;
    return baseViews;
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  useEffect(() => {
    const enabled = localStorage.getItem('audioStreamEnabled') === 'true';
    setAudioStreamEnabled(enabled);
  }, []);
  
  // Lazy loading with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    
    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }
    
    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel fetch for faster loading
        const [articlesRes, videosRes, funRes, categoriesRes] = await Promise.all([
          fetch('https://kec-backend-1.onrender.com/api/articles'),
          fetch('https://kec-backend-1.onrender.com/api/videos'),
          fetch('https://kec-backend-1.onrender.com/api/fun'),
          fetch('https://kec-backend-1.onrender.com/api/categories')
        ]);
        
        // Process articles
        if (articlesRes.ok) {
          const data = await articlesRes.json();
          const articles = data.articles || data;
          const mappedArticles = Array.isArray(articles) ? articles.map(article => {
            let displayImage = article.imageUrl;
            if (!displayImage && article.images) {
              try {
                const parsedImages = JSON.parse(article.images);
                displayImage = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : null;
              } catch (e) {
                displayImage = null;
              }
            }
            
            return {
              ...article,
              trending: article.sideCategories?.includes('trending') || false,
              breaking: article.sideCategories?.includes('breaking') || false,
              contentType: article.contentType || 'article',
              readTime: article.readTime || '5 min read',
              category: article.category?.name || 'General',
              views: generateViews(article.id),
              imageUrl: displayImage
            };
          }) : [];
          
          const viewsMap = {};
          mappedArticles.forEach(article => {
            viewsMap[article.id] = article.views;
          });
          setArticleViews(viewsMap);
          setNews(mappedArticles);
        }
        
        // Process videos
        if (videosRes.ok) {
          const data = await videosRes.json();
          setVideos(data.videos || []);
        }
        
        // Process fun content
        if (funRes.ok) {
          const data = await funRes.json();
          setFunContent(data.funContent || []);
        }
        
        // Process categories
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(Array.isArray(data.categories) ? data.categories : []);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setNews([]);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCategory]);

  // Filter stories based on selected category
  const filteredNews = selectedCategory ? news : news;
  const mainStoriesNews = selectedCategory ? [] : news;
  
  // Distribute articles uniquely across containers (7 articles each)
  const articlesPerContainer = 7;
  
  // Left container (Latest News): articles 0-6
  const leftContainerArticles = filteredNews.slice(0, articlesPerContainer);
  const leftTotalPages = Math.ceil(leftContainerArticles.length / articlesPerContainer);
  const leftStart = (currentPage - 1) * articlesPerContainer;
  const paginatedNews = leftContainerArticles.slice(leftStart, leftStart + articlesPerContainer);
  
  // Right sidebar: articles 7-13
  const rightContainerArticles = filteredNews.slice(articlesPerContainer, articlesPerContainer * 2);
  const rightTotalPages = Math.ceil(rightContainerArticles.length / articlesPerContainer);
  const rightStart = (trendingPage - 1) * articlesPerContainer;
  const paginatedTrending = rightContainerArticles.slice(rightStart, rightStart + articlesPerContainer);
  
  // Bottom left: articles 14-20
  const bottomLeftArticles = filteredNews.slice(articlesPerContainer * 2, articlesPerContainer * 3);
  const bottomLeftTotalPages = Math.ceil(bottomLeftArticles.length / articlesPerContainer);
  const bottomLeftStart = (culturePage - 1) * articlesPerContainer;
  const paginatedCulture = bottomLeftArticles.slice(bottomLeftStart, bottomLeftStart + articlesPerContainer);
  
  // Bottom right: articles 21-27
  const bottomRightArticles = filteredNews.slice(articlesPerContainer * 3, articlesPerContainer * 4);
  const bottomRightTotalPages = Math.ceil(bottomRightArticles.length / articlesPerContainer);
  const bottomRightStart = (environmentPage - 1) * articlesPerContainer;
  const paginatedEnvironment = bottomRightArticles.slice(bottomRightStart, bottomRightStart + articlesPerContainer);
  
  const totalPages = leftTotalPages;
  const trendingTotalPages = rightTotalPages;
  const cultureTotalPages = bottomLeftTotalPages;
  const environmentTotalPages = bottomRightTotalPages;
  
  const featuredStory = filteredNews.length > 0 ? filteredNews[0] : null;
  const secondaryStories = filteredNews.slice(1, 3);
  const regularStories = mainStoriesNews.slice(3, 9);
  const trendingStories = filteredNews.filter(s => s.trending);
  const breakingStories = filteredNews.filter(s => s.breaking);
  const videoStories = videos.length > 0 ? videos : [];
  const sliderImages = featuredStory ? secondaryStories.concat([featuredStory]) : secondaryStories;

  useEffect(() => {
    if (sliderImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sliderImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setArticleViews(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          const currentViews = updated[id];
          if (currentViews < 500) {
            updated[id] = currentViews + Math.floor(Math.random() * 3) + 1;
          } else {
            updated[id] = currentViews + Math.floor(Math.random() * 10) + 1;
          }
        });
        return updated;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [news]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      <div className="max-w-7xl mx-auto px-4 py-1">

      {/* Mobile: 12 Large Featured Stories - Same as Featured Story Layout */}
      <div className="block lg:hidden mb-8">
        <div className="space-y-4">
          {filteredNews.slice(0, 12).map((story) => (
            <Link key={story.id} to={`/article/${story.id}`} className="group block">
              <div className="border-0 sm:border sm:border-gray-200 overflow-hidden h-auto lg:h-[600px]">
                <div className="relative group overflow-hidden">
                  <img 
                    src={story.imageUrl} 
                    alt={story.title}
                    className="w-full h-48 sm:h-64 lg:h-80 object-cover flex-shrink-0"
                  />
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-2">
                    {story.breaking && (
                      <span className="bg-[#021b41]/80 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold">
                        BREAKING
                      </span>
                    )}
                    <span className="bg-blue-600/50 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold">
                      FEATURED
                    </span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 lg:p-6">
                  <h2 className="font-bold text-lg sm:text-xl lg:text-2xl leading-tight mb-3 hover:underline" style={{fontFamily: 'Montserrat, sans-serif'}}>
                    {story.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                    {story.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 font-light mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>
                    <span>By {story.author?.name || 'Unknown'}</span>
                    <span>{story.readTime} • {formatViews(articleViews[story.id] || story.views)} views</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <button 
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/like`, { method: 'POST' });
                          if (response.ok) {
                            const updatedArticle = await response.json();
                            setNews(prev => prev.map(n => n.id === story.id ? {...n, likes: updatedArticle.likes} : n));
                          }
                        } catch (error) {
                          console.error('Error liking article:', error);
                        }
                      }}
                      className="flex items-center space-x-1 hover:text-red-500"
                    >
                      <Heart className="w-3 h-3" />
                      <span>{story.likes || 0}</span>
                    </button>
                    <Link 
                      to={`/article/${story.id}#comments`}
                      className="flex items-center space-x-1 hover:text-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{story.comments?.length || 0}</span>
                    </Link>
                    <button 
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/share`, { method: 'POST' });
                          if (response.ok) {
                            const updatedArticle = await response.json();
                            setNews(prev => prev.map(n => n.id === story.id ? {...n, shares: updatedArticle.shares} : n));
                          }
                        } catch (error) {
                          console.error('Error sharing article:', error);
                        }
                      }}
                      className="flex items-center space-x-1 hover:text-blue-500"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>{story.shares || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Remaining Articles - Small Layout for Mobile */}
        {filteredNews.length > 12 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>More News</h2>
            <div className="space-y-4">
              {filteredNews.slice(12).map((story) => (
                <Link key={story.id} to={`/article/${story.id}`} className="group flex gap-3 hover:bg-gray-50 p-3 -m-3 transition-colors">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img 
                      src={story.imageUrl} 
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm leading-tight mb-1 group-hover:underline line-clamp-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {story.title}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                      {story.excerpt}
                    </p>
                    <div className="text-xs text-gray-500 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {formatViews(articleViews[story.id] || story.views)} views
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Original Multi-Column Grid Layout */}
      <div className="hidden lg:block">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Main Content - 8 columns */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Latest News - Top Position (2x2) */}
            <div className="md:col-span-1 lg:col-span-2 lg:row-span-2">
              <div className="w-full h-auto border-0 sm:border sm:border-gray-200">
                <div className="bg-[#021b41]/80 text-white px-4 py-2">
                  <h3 className="font-bold text-sm uppercase">Inkuru Ziheruka</h3>
                </div>
                <div className="p-3 sm:p-6 space-y-4 sm:space-y-8">
                  {paginatedNews.map((story) => (
                    <div key={story.id} className="group">
                      <Link to={`/article/${story.id}`} className="flex gap-3 sm:gap-6 mb-4">
                        {/* Left Column - Image */}
                        <div className="w-2/5 flex-shrink-0">
                          <img 
                            src={story.imageUrl} 
                            alt={story.title}
                            className="w-full h-24 sm:h-32 object-cover"
                          />
                        </div>
                        
                        {/* Right Column - Text */}
                        <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                          <h4 className="font-bold text-sm sm:text-base leading-tight group-hover:underline line-clamp-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                            {story.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                            {story.excerpt}
                          </p>
                          <div className="text-xs text-gray-500 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                            By {story.author.name} • {story.readTime} • {formatViews(articleViews[story.id] || story.views)} views
                          </div>
                        </div>
                      </Link>
                      
                      {/* Interaction buttons */}
                      <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-500 pl-3 sm:pl-6">
                        <button 
                          onClick={async () => {
                            try {
                              const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/like`, { method: 'POST' });
                              if (response.ok) {
                                const updatedArticle = await response.json();
                                setNews(prev => prev.map(n => n.id === story.id ? {...n, likes: updatedArticle.likes} : n));
                              }
                            } catch (error) {
                              console.error('Error liking article:', error);
                            }
                          }}
                          className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                        >
                          <Heart className="w-3 h-3" />
                          <span>{story.likes || 0}</span>
                        </button>
                        <Link 
                          to={`/article/${story.id}#comments`}
                          className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>{story.comments?.length || 0}</span>
                        </Link>
                        <button 
                          onClick={async () => {
                            try {
                              const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/share`, { method: 'POST' });
                              if (response.ok) {
                                const updatedArticle = await response.json();
                                setNews(prev => prev.map(n => n.id === story.id ? {...n, shares: updatedArticle.shares} : n));
                              }
                            } catch (error) {
                              console.error('Error sharing article:', error);
                            }
                          }}
                          className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>{story.shares || 0}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border ${
                            currentPage === i + 1
                              ? 'bg-[#021b41] text-white border-[#021b41]'
                              : 'border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Story - Main Position (2x1) */}
            <div className="md:col-span-1 lg:col-span-2">
              <div className="border-0 sm:border sm:border-gray-200 overflow-hidden h-auto lg:h-[600px]">
                <div className="relative group overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {sliderImages.map((story, index) => (
                      <img 
                        key={story.id}
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-full h-48 sm:h-64 lg:h-80 object-cover flex-shrink-0"
                      />
                    ))}
                  </div>
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-2">
                    {sliderImages[currentSlide]?.breaking && (
                      <span className="bg-[#021b41]/80 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold">
                        BREAKING
                      </span>
                    )}
                    <span className="bg-blue-600/50 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold">
                      FEATURED
                    </span>
                  </div>
                  <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 flex gap-2">
                    {sliderImages.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-2 h-2 ${
                          index === currentSlide ? 'bg-white' : 'bg-white/50'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
                {sliderImages[currentSlide] && (
                  <div className="p-3 sm:p-4 lg:p-6">
                    <h2 className="font-bold text-lg sm:text-xl lg:text-2xl leading-tight mb-3 hover:underline" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {sliderImages[currentSlide].title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                      {sliderImages[currentSlide].excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      <span>By {sliderImages[currentSlide].author?.name || 'Unknown'}</span>
                      <span>{sliderImages[currentSlide].readTime} • {formatViews(articleViews[sliderImages[currentSlide].id] || sliderImages[currentSlide].views)} views</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Stories Row - Hidden when category is selected */}
            {!selectedCategory && (
              <div className="md:col-span-2 lg:col-span-2 lg:mt-[5px]">
                <div className="w-full lg:w-[400px]">
                  <h3 className="text-base sm:text-lg font-bold border-b-2 border-gray-300 pb-2 mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>Inkuru Nyamukuru</h3>
                  <div className="space-y-4">
                    {regularStories.slice(0, 2).map((story) => (
                      <Link key={story.id} to={`/article/${story.id}`} className="group block">
                        <div className="h-auto lg:h-[429px] border-0 sm:border sm:border-gray-200 overflow-hidden">
                          <img 
                            src={story.imageUrl} 
                            alt={story.title}
                            className="w-full h-40 sm:h-48 lg:h-64 object-cover"
                          />
                          <div className="p-3 sm:p-4">
                            <h4 className="font-bold text-base sm:text-lg leading-tight mb-2 group-hover:underline" style={{fontFamily: 'Montserrat, sans-serif'}}>
                              {story.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                              {story.excerpt}
                            </p>
                            <div className="text-xs text-gray-500 mb-2 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                              By {story.author.name} • {story.readTime} • {formatViews(articleViews[story.id] || story.views)} views
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <button 
                                onClick={async (e) => {
                                  e.preventDefault();
                                  try {
                                    const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/like`, { method: 'POST' });
                                    if (response.ok) {
                                      const updatedArticle = await response.json();
                                      setNews(prev => prev.map(n => n.id === story.id ? {...n, likes: updatedArticle.likes} : n));
                                    }
                                  } catch (error) {
                                    console.error('Error liking article:', error);
                                  }
                                }}
                                className="flex items-center space-x-1 hover:text-red-500"
                              >
                                <Heart className="w-3 h-3" />
                                <span>{story.likes || 0}</span>
                              </button>
                              <Link 
                                to={`/article/${story.id}#comments`}
                                className="flex items-center space-x-1 hover:text-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>{story.comments?.length || 0}</span>
                              </Link>
                              <button 
                                onClick={async (e) => {
                                  e.preventDefault();
                                  try {
                                    const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/share`, { method: 'POST' });
                                    if (response.ok) {
                                      const updatedArticle = await response.json();
                                      setNews(prev => prev.map(n => n.id === story.id ? {...n, shares: updatedArticle.shares} : n));
                                    }
                                  } catch (error) {
                                    console.error('Error sharing article:', error);
                                  }
                                }}
                                className="flex items-center space-x-1 hover:text-blue-500"
                              >
                                <Share2 className="w-3 h-3" />
                                <span>{story.shares || 0}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - 4 columns */}
        <div className="lg:col-span-4 space-y-4 lg:space-y-6">
          {/* Live Audio Streaming Player */}
          {audioStreamEnabled && <AudioStreamPlayer />}

          {/* More News */}
          <div className="border-0 sm:border sm:border-gray-200 h-auto">
            <div className="bg-[#021b41]/80 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase">Izindi Inkuru</h3>
            </div>
            <div className="p-3 sm:p-6 space-y-4 sm:space-y-8">
              {paginatedTrending.map((story) => (
                <div key={story.id} className="group">
                  <Link to={`/article/${story.id}`} className="flex gap-3 sm:gap-6 mb-4">
                    <div className="w-2/5 flex-shrink-0">
                      <img 
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-full h-24 sm:h-32 object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                      <h4 className="font-bold text-sm sm:text-base leading-tight group-hover:underline line-clamp-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        {story.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {story.excerpt}
                      </p>
                      <div className="text-xs text-gray-500 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        By {story.author.name} • {story.readTime} • {formatViews(articleViews[story.id] || story.views)} views
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-500 pl-3 sm:pl-6">
                    <button 
                      onClick={async () => {
                        try {
                          const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/like`, { method: 'POST' });
                          if (response.ok) {
                            const updatedArticle = await response.json();
                            setNews(prev => prev.map(n => n.id === story.id ? {...n, likes: updatedArticle.likes} : n));
                          }
                        } catch (error) {
                          console.error('Error liking article:', error);
                        }
                      }}
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-3 h-3" />
                      <span>{story.likes || 0}</span>
                    </button>
                    <Link 
                      to={`/article/${story.id}#comments`}
                      className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{story.comments?.length || 0}</span>
                    </Link>
                    <button 
                      onClick={async () => {
                        try {
                          const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/share`, { method: 'POST' });
                          if (response.ok) {
                            const updatedArticle = await response.json();
                            setNews(prev => prev.map(n => n.id === story.id ? {...n, shares: updatedArticle.shares} : n));
                          }
                        } catch (error) {
                          console.error('Error sharing article:', error);
                        }
                      }}
                      className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>{story.shares || 0}</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Pagination */}
              {trendingTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setTrendingPage(prev => Math.max(1, prev - 1))}
                    disabled={trendingPage === 1}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(trendingTotalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setTrendingPage(i + 1)}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border ${
                        trendingPage === i + 1
                          ? 'bg-[#021b41] text-white border-[#021b41]'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setTrendingPage(prev => Math.min(trendingTotalPages, prev + 1))}
                    disabled={trendingPage === trendingTotalPages}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Stories - Bottom Section */}
      <div className="mt-8 lg:mt-12 border-t border-gray-200 pt-6 lg:pt-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 lg:mb-6 pb-2" style={{fontFamily: 'Montserrat, sans-serif'}}>Video Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {videoStories.slice(0, 5).map((video) => {
            const getEmbedUrl = (url) => {
              if (!url) return '';
              if (url.includes('youtu.be/')) {
                const videoId = url.split('youtu.be/')[1].split('?')[0];
                return `https://www.youtube.com/embed/${videoId}`;
              }
              if (url.includes('youtube.com/watch?v=')) {
                const videoId = url.split('v=')[1].split('&')[0];
                return `https://www.youtube.com/embed/${videoId}`;
              }
              return url;
            };
            
            return (
              <div key={video.id} className="group">
                <div className="bg-white border border-gray-200 overflow-hidden">
                  <div className="relative">
                    <iframe
                      src={getEmbedUrl(video.videoUrl)}
                      className="w-full h-32"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title={video.title}
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm leading-tight group-hover:underline line-clamp-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {video.title}
                    </h4>
                    <div className="text-xs text-gray-500 mt-1 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {video.duration || 'Video'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fun Zone Section */}
      <div className="mt-8 lg:mt-12 border-t border-gray-200 pt-6 lg:pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 gap-4">
          <div className="flex items-center space-x-4">
           
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>Trending Content</h2>
          </div>
          <Link to="/fun" className="bg-[#021b41] text-white px-6 py-3 hover:bg-[#021b41]/90 transition-colors font-medium">
            View All Fun Content →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funContent.slice(0, 6).map((item) => {
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
            
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="/newikarita.png" 
                      alt="Ikarita Media" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>{item.author}</p>
                      <p className="text-xs text-gray-500 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>{formatTimeAgo(item.createdAt)}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3" style={{fontFamily: 'Montserrat, sans-serif'}}>{item.title}</h3>
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
                        onClick={async () => {
                          try {
                            const response = await fetch(`https://kec-backend-1.onrender.com/api/fun/${item.id}/like`, { 
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' }
                            });
                            if (response.ok) {
                              const updatedItem = await response.json();
                              setFunContent(prev => prev.map(f => f.id === item.id ? updatedItem : f));
                            }
                          } catch (error) {
                            console.error('Error liking content:', error);
                          }
                        }}
                        className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium" style={{fontFamily: 'Montserrat, sans-serif'}}>{item.likes.toLocaleString()}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium" style={{fontFamily: 'Montserrat, sans-serif'}}>{item.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-green-500 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        <span className="text-sm font-medium" style={{fontFamily: 'Montserrat, sans-serif'}}>{item.shares}</span>
                      </button>
                    </div>
                    <button className="text-gray-600 hover:text-yellow-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Culture, Main Stories & Environment - Same Layout */}
      <div className="mt-8 lg:mt-12 border-t border-gray-200 pt-6 lg:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* More Articles */}
          <div className="lg:col-span-4 border border-gray-200 h-auto">
            <div className="bg-[#021b41]/80 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase">Andi Makuru</h3>
            </div>
            <div className="p-6 space-y-8">
              {paginatedCulture.map((story) => (
                <div key={story.id} className="group">
                  <Link to={`/article/${story.id}`} className="flex gap-6 mb-4">
                    <div className="w-2/5 flex-shrink-0">
                      <img 
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="text-xs text-blue-600 font-bold uppercase">
                        {story.category}
                      </div>
                      <h4 className="font-bold text-base leading-tight group-hover:underline line-clamp-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        {story.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {story.excerpt}
                      </p>
                      <div className="text-xs text-gray-500 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        By {story.author.name} • {story.readTime} • {formatViews(articleViews[story.id] || story.views)} views
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 pl-6">
                    <button 
                      onClick={async () => {
                        try {
                          const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/like`, { method: 'POST' });
                          if (response.ok) {
                            const updatedArticle = await response.json();
                            setNews(prev => prev.map(n => n.id === story.id ? {...n, likes: updatedArticle.likes} : n));
                          }
                        } catch (error) {
                          console.error('Error liking article:', error);
                        }
                      }}
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-3 h-3" />
                      <span>{story.likes || 0}</span>
                    </button>
                    <Link 
                      to={`/article/${story.id}#comments`}
                      className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{story.comments?.length || 0}</span>
                    </Link>
                    <button 
                      onClick={async () => {
                        try {
                          const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/share`, { method: 'POST' });
                          if (response.ok) {
                            const updatedArticle = await response.json();
                            setNews(prev => prev.map(n => n.id === story.id ? {...n, shares: updatedArticle.shares} : n));
                          }
                        } catch (error) {
                          console.error('Error sharing article:', error);
                        }
                      }}
                      className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>{story.shares || 0}</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Pagination */}
              {cultureTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setCulturePage(prev => Math.max(1, prev - 1))}
                    disabled={culturePage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(cultureTotalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCulturePage(i + 1)}
                      className={`px-3 py-1 text-sm border ${
                        culturePage === i + 1
                          ? 'bg-[#021b41] text-white border-[#021b41]'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCulturePage(prev => Math.min(cultureTotalPages, prev + 1))}
                    disabled={culturePage === cultureTotalPages}
                    className="px-3 py-1 text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Stories - Middle Column */}
          <div className="lg:col-span-4">
            <div className="w-full">
              <h3 className="text-lg font-bold pb-2 mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>Inkuru Nyamukuru</h3>
              <div className="space-y-4">
                {regularStories.slice(0, 2).map((story) => (
                  <Link key={story.id} to={`/article/${story.id}`} className="group block">
                    <div className="h-auto lg:h-[750px] bg-white border border-gray-200 overflow-hidden">
                      <img 
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-full h-48 sm:h-56 lg:h-96 object-cover"
                      />
                      <div className="p-4">
                        <div className="text-xs text-blue-600 font-bold uppercase mb-2">
                          {story.category}
                        </div>
                        <h4 className="font-bold text-lg leading-tight mb-2 group-hover:underline" style={{fontFamily: 'Montserrat, sans-serif'}}>
                          {story.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                          {story.excerpt}
                        </p>
                        <div className="text-xs text-gray-500 mb-2 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                          By {story.author.name} • {story.readTime} • {formatViews(articleViews[story.id] || story.views)} views
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <button 
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/like`, { method: 'POST' });
                                if (response.ok) {
                                  const updatedArticle = await response.json();
                                  setNews(prev => prev.map(n => n.id === story.id ? {...n, likes: updatedArticle.likes} : n));
                                }
                              } catch (error) {
                                console.error('Error liking article:', error);
                              }
                            }}
                            className="flex items-center space-x-1 hover:text-red-500"
                          >
                            <Heart className="w-3 h-3" />
                            <span>{story.likes || 0}</span>
                          </button>
                          <Link 
                            to={`/article/${story.id}#comments`}
                            className="flex items-center space-x-1 hover:text-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>{story.comments?.length || 0}</span>
                          </Link>
                          <button 
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/share`, { method: 'POST' });
                                if (response.ok) {
                                  const updatedArticle = await response.json();
                                  setNews(prev => prev.map(n => n.id === story.id ? {...n, shares: updatedArticle.shares} : n));
                                }
                              } catch (error) {
                                console.error('Error sharing article:', error);
                              }
                            }}
                            className="flex items-center space-x-1 hover:text-blue-500"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>{story.shares || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Additional News */}
          <div className="lg:col-span-4 border border-gray-200 h-auto">
            <div className="bg-[#021b41]/80 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase">Ibindi Byose</h3>
            </div>
            <div className="p-6 space-y-8">
              {paginatedEnvironment.map((story) => (
                <div key={story.id} className="group">
                  <Link to={`/article/${story.id}`} className="flex gap-6 mb-4">
                    <div className="w-2/5 flex-shrink-0">
                      <img 
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="text-xs text-blue-600 font-bold uppercase">
                        {story.category}
                      </div>
                      <h4 className="font-bold text-base leading-tight group-hover:underline line-clamp-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        {story.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {story.excerpt}
                      </p>
                      <div className="text-xs text-gray-500 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        By {story.author.name} • {story.readTime} • {formatViews(articleViews[story.id] || story.views)} views
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 pl-6">
                    <button 
                      onClick={async () => {
                        try {
                          const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/like`, { method: 'POST' });
                          if (response.ok) {
                            const updatedArticle = await response.json();
                            setNews(prev => prev.map(n => n.id === story.id ? {...n, likes: updatedArticle.likes} : n));
                          }
                        } catch (error) {
                          console.error('Error liking article:', error);
                        }
                      }}
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-3 h-3" />
                      <span>{story.likes || 0}</span>
                    </button>
                    <Link 
                      to={`/article/${story.id}#comments`}
                      className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{story.comments?.length || 0}</span>
                    </Link>
                    <button 
                      onClick={async () => {
                        try {
                          const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${story.id}/share`, { method: 'POST' });
                          if (response.ok) {
                            const updatedArticle = await response.json();
                            setNews(prev => prev.map(n => n.id === story.id ? {...n, shares: updatedArticle.shares} : n));
                          }
                        } catch (error) {
                          console.error('Error sharing article:', error);
                        }
                      }}
                      className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>{story.shares || 0}</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Pagination */}
              {environmentTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setEnvironmentPage(prev => Math.max(1, prev - 1))}
                    disabled={environmentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(environmentTotalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setEnvironmentPage(i + 1)}
                      className={`px-3 py-1 text-sm border ${
                        environmentPage === i + 1
                          ? 'bg-[#021b41] text-white border-[#021b41]'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setEnvironmentPage(prev => Math.min(environmentTotalPages, prev + 1))}
                    disabled={environmentPage === environmentTotalPages}
                    className="px-3 py-1 text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lazy Loading Sentinel */}
      <div id="scroll-sentinel" className="h-10"></div>
      
      <div className="mt-8 lg:mt-12 border-t border-gray-200 pt-6 lg:pt-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 lg:mb-6 pb-2" style={{fontFamily: 'Montserrat, sans-serif'}}>How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {videoStories.slice(0, 5).map((video, index) => {
            const getEmbedUrl = (url) => {
              if (!url) return '';
              if (url.includes('youtu.be/')) {
                const videoId = url.split('youtu.be/')[1].split('?')[0];
                return `https://www.youtube.com/embed/${videoId}`;
              }
              if (url.includes('youtube.com/watch?v=')) {
                const videoId = url.split('v=')[1].split('&')[0];
                return `https://www.youtube.com/embed/${videoId}`;
              }
              return url;
            };
            
            return (
              <div key={video.id} className="group">
                <div className="bg-white border border-gray-200 overflow-hidden">
                  <div className="relative">
                    <iframe
                      src={getEmbedUrl(video.videoUrl)}
                      className="w-full h-32"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm leading-tight group-hover:underline line-clamp-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {video.title}
                    </h4>
                    <div className="text-xs text-gray-500 mt-1 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {video.duration || '5 min'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
  );
};

export default HomePage;
