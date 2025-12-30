import { Link, useSearchParams } from "react-router-dom";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'http://localhost:3000/api/articles';
        if (selectedCategory) {
          url += `?category=${encodeURIComponent(selectedCategory)}`;
        }
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
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
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setNews([]);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/videos');
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos || []);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    
    const fetchFunContent = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/fun');
        if (response.ok) {
          const data = await response.json();
          setFunContent(data.funContent || []);
        }
      } catch (error) {
        console.error('Error fetching fun content:', error);
      }
    };
    
    fetchData();
    fetchVideos();
    fetchFunContent();
  }, [selectedCategory]);

  // Filter stories based on selected category
  const filteredNews = selectedCategory ? news : news;
  const mainStoriesNews = selectedCategory ? [] : news; // Hide main stories when category is selected
  
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
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {selectedCategory && (
          <div className="mb-6">
            <div className="bg-[#021b41] text-white px-4 py-2 rounded-lg inline-block">
              <h2 className="text-lg font-bold">Category: {selectedCategory}</h2>
            </div>
          </div>
        )}

      {/* Multi-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Main Content - 8 columns */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Latest News - Top Position (2x2) */}
            <div className="md:col-span-1 lg:col-span-2 lg:row-span-2">
              <div className="w-full h-[500px] md:h-[800px] lg:h-[1550px] border border-gray-200">
                <div className="bg-[#021b41]/80 text-white px-4 py-2">
                  <h3 className="font-bold text-sm uppercase">Latest News</h3>
                </div>
                <div className="p-6 space-y-8">
                  {filteredNews.map((story) => (
                    <div key={story.id} className="group">
                      <Link to={`/article/${story.id}`} className="flex gap-6 mb-4">
                        {/* Left Column - Image (40-45% width) */}
                        <div className="w-2/5 flex-shrink-0">
                          <img 
                            src={story.imageUrl} 
                            alt={story.title}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                        
                        {/* Right Column - Text (55-60% width) */}
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
                      
                      {/* Interaction buttons */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500 pl-6">
                        <button 
                          onClick={async () => {
                            try {
                              const response = await fetch(`http://localhost:3000/api/articles/${story.id}/like`, { method: 'POST' });
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
                              const response = await fetch(`http://localhost:3000/api/articles/${story.id}/share`, { method: 'POST' });
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
                </div>
              </div>
            </div>

            {/* Featured Story - Main Position (2x1) */}
            <div className="md:col-span-1 lg:col-span-2">
              <div className="border border-gray-200 h-auto lg:h-[600px]">
                <div className="relative group">
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
                  <div className="absolute top-4 left-4 flex gap-2">
                    {sliderImages[currentSlide]?.breaking && (
                      <span className="bg-[#021b41]/80 text-white px-3 py-1 text-sm font-bold">
                        BREAKING
                      </span>
                    )}
                    <span className="bg-blue-600/50 text-white px-3 py-1 text-sm font-bold">
                      FEATURED
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
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
                    <div className="text-xs sm:text-sm text-blue-600 font-bold uppercase mb-2">
                      {sliderImages[currentSlide].category}
                    </div>
                    <h2 className="font-bold text-lg sm:text-xl lg:text-2xl leading-tight mb-3 hover:underline" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {sliderImages[currentSlide].title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {sliderImages[currentSlide].excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
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
                  <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>Main Stories</h3>
                  <div className="space-y-4">
                    {regularStories.slice(0, 2).map((story) => (
                      <Link key={story.id} to={`/article/${story.id}`} className="group block">
                        <div className="h-auto lg:h-[429px] border border-gray-200">
                          <img 
                            src={story.imageUrl} 
                            alt={story.title}
                            className="w-full h-48 sm:h-56 lg:h-64 object-cover"
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

          {/* Trending */}
          <div className="border-gray-200 h-auto max-h-[500px] lg:h-[450px]">
            <div className="bg-[#021b41]/80 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase">Trending</h3>
            </div>
            <div className="p-6 space-y-6">
              {trendingStories.slice(0, 5).map((story, index) => (
                <Link key={story.id} to={`/article/${story.id}`} className="flex gap-4 group">
                  {/* Left Column - Image (40% width) */}
                  <div className="w-2/5 flex-shrink-0 relative">
                    <span className="absolute -top-2 -left-2 bg-[#021b41] text-white w-6 h-6 flex items-center justify-center text-xs font-bold z-10">
                      {index + 1}
                    </span>
                    <img 
                      src={story.imageUrl} 
                      alt={story.title}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                  
                  {/* Right Column - Text (60% width) */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm leading-tight group-hover:underline line-clamp-3" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {story.title}
                    </h4>
                    <div className="text-xs text-gray-500 mt-2 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {story.category}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Did You Know */}
          <div className="border border-gray-200 h-auto max-h-[500px] lg:h-[450px]">
            <div className="bg-[#021b41]/80 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase">Did You Know?</h3>
            </div>
            <div className="p-6 space-y-6">
              {news.slice(0, 3).map((story) => (
                <div key={story.id} className="flex gap-4">
                  {/* Left Column - Image (40% width) */}
                  <div className="w-2/5 flex-shrink-0">
                    <img 
                      src={story.imageUrl} 
                      alt={story.title}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                  
                  {/* Right Column - Text (60% width) */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="font-bold text-sm leading-tight line-clamp-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      Did you know {typeof story.category === 'string' ? story.category.toLowerCase() : story.category} sector is making significant impact?
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {story.excerpt.slice(0, 80)}...
                    </p>
                    <div className="text-xs text-gray-500 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {story.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Lists */}
          <div className="border border-gray-200 h-auto max-h-[600px] lg:h-[550px]">
            <div className="bg-[#021b41]/80 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase">Top Lists</h3>
            </div>
            <div className="p-6 space-y-6">
              {trendingStories.slice(0, 5).map((story, index) => (
                <Link key={story.id} to={`/article/${story.id}`} className="flex gap-4 group">
                  {/* Left Column - Image (40% width) */}
                  <div className="w-2/5 flex-shrink-0 relative">
                    <span className="absolute -top-2 -left-2 bg-[#021b41] text-white w-6 h-6 flex items-center justify-center text-xs font-bold z-10">
                      {index + 1}
                    </span>
                    <img 
                      src={story.imageUrl} 
                      alt={story.title}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                  
                  {/* Right Column - Text (60% width) */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="font-bold text-sm leading-tight group-hover:underline line-clamp-3" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {story.title}
                    </h4>
                    <div className="text-xs text-gray-500 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {story.category}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Stories - Bottom Section */}
      <div className="mt-8 lg:mt-12 border-t border-gray-200 pt-6 lg:pt-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 lg:mb-6" style={{fontFamily: 'Montserrat, sans-serif'}}>Video Stories</h2>
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
                <div className="bg-white border border-gray-200">
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
        <div className="flex items-center justify-between mb-8">
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
              <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
                            const response = await fetch(`http://localhost:3000/api/fun/${item.id}/like`, { 
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
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Culture, Lifestyle & More */}
      <div className="mt-8 lg:mt-12 border-t border-gray-200 pt-6 lg:pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Culture */}
          <div className="h-auto max-h-[600px] lg:h-[550px] border border-gray-200">
            <div className="bg-[#021b41]/80 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase">Culture</h3>
            </div>
            <div className="p-6 space-y-6">
              {news.filter(s => s.category === 'Entertainment').slice(0, 3).map((story) => (
                <Link key={story.id} to={`/article/${story.id}`} className="group block">
                  <div className="flex gap-4">
                    {/* Left Column - Image (40% width) */}
                    <div className="w-2/5 flex-shrink-0">
                      <img 
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-full h-24 object-cover"
                      />
                    </div>
                    
                    {/* Right Column - Text (60% width) */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <h4 className="font-bold text-sm leading-tight group-hover:underline line-clamp-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        {story.title}
                      </h4>
                      <div className="text-xs text-gray-500 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        {story.readTime} • {story.category}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Main Stories */}
          <div className="">
            <div className="w-full lg:w-[400px] mx-auto">
              <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>Main Stories</h3>
              <div className="space-y-4">
                {regularStories.slice(0, 2).map((story) => (
                  <Link key={story.id} to={`/article/${story.id}`} className="group block">
                    <div className="h-auto lg:h-[400px] bg-white border border-gray-200">
                      <img 
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover"
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
                        <div className="text-xs text-gray-500 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                          By {story.author.name} • {story.readTime}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          
          {/* Environment */}
          <div className="h-auto max-h-[600px] lg:h-[550px] border border-gray-200">
            <div className="bg-[#021b41]/80 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase">Environment</h3>
            </div>
            <div className="p-6 space-y-6">
              {news.filter(s => s.category === 'Environment').slice(0, 3).map((story) => (
                <Link key={story.id} to={`/article/${story.id}`} className="group block">
                  <div className="flex gap-4">
                    {/* Left Column - Image (40% width) */}
                    <div className="w-2/5 flex-shrink-0">
                      <img 
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-full h-24 object-cover"
                      />
                    </div>
                    
                    {/* Right Column - Text (60% width) */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <h4 className="font-bold text-sm leading-tight group-hover:underline line-clamp-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        {story.title}
                      </h4>
                      <div className="text-xs text-gray-500 font-light" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        {story.readTime} • {story.category}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 lg:mt-12 border-t border-gray-200 pt-6 lg:pt-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 lg:mb-6" style={{fontFamily: 'Montserrat, sans-serif'}}>How It Works</h2>
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
                <div className="bg-white border border-gray-200">
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
    </div>
  );
};

export default HomePage;