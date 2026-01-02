import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AudioStreamPlayer from "@/components/AudioStreamPlayer";

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://kec-backend-1.onrender.com/api/articles');
        if (response.ok) {
          const data = await response.json();
          const articles = data.articles || data;
          const mappedArticles = Array.isArray(articles) ? articles.map(article => ({
            ...article,
            trending: article.sideCategories?.includes('trending') || false,
            breaking: article.sideCategories?.includes('breaking') || false,
            contentType: article.contentType || 'article',
            readTime: article.readTime || '5 min read',
            category: article.category?.name || 'General'
          })) : [];
          setNews(mappedArticles);
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const featuredStory = news.length > 0 ? news[0] : null;
  const secondaryStories = news.slice(1, 3);
  const regularStories = news.slice(3, 9);
  const trendingStories = news.filter(s => s.trending);
  const breakingStories = news.filter(s => s.breaking);
  const videoStories = news.filter(s => s.contentType === 'video').concat(
    news.filter(s => s.contentType === 'article').slice(0, 3)
  );
  const sliderImages = featuredStory ? secondaryStories.concat([featuredStory]) : secondaryStories;

  useEffect(() => {
    if (sliderImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sliderImages.length]);

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

      {/* Multi-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Main Content - 8 columns */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Latest News - Top Position (2x2) */}
            <div className="md:col-span-1 lg:col-span-2 lg:row-span-2">
              <div className="w-full h-[500px] md:h-[800px] lg:h-[1550px] border border-gray-200 overflow-y-auto">
                <div className="bg-[#021b41]/80 text-white px-4 py-2">
                  <h3 className="font-bold text-sm uppercase">Latest News</h3>
                </div>
                <div className="p-3 space-y-3">
                  {news.map((story) => (
                    <Link key={story.id} to={`/article/${story.id}`} className="group flex gap-3">
                      <img 
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-20 h-16 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-blue-600 font-bold uppercase mb-1">
                          {story.category}
                        </div>
                        <h4 className="font-serif font-bold text-sm leading-tight mb-1 group-hover:underline line-clamp-2">
                          {story.title}
                        </h4>
                        <div className="text-xs text-gray-500">
                          By {story.author.name} • {story.readTime}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Story - Main Position (2x1) */}
            <div className="md:col-span-1 lg:col-span-2">
              <div className="border border-gray-200 overflow-hidden h-auto lg:h-[600px]">
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
                    <h2 className="font-serif font-bold text-lg sm:text-xl lg:text-2xl leading-tight mb-3 hover:underline">
                      {sliderImages[currentSlide].title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {sliderImages[currentSlide].excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {sliderImages[currentSlide].author?.name || 'Unknown'}</span>
                      <span>{sliderImages[currentSlide].readTime}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Stories Row */}
            <div className="md:col-span-2 lg:col-span-2 lg:mt-[5px]">
              <div className="w-full lg:w-[400px]">
                <h3 className="text-lg font-serif font-bold border-b border-gray-200 pb-2 mb-4">Main Stories</h3>
                <div className="space-y-4">
                  {regularStories.slice(0, 2).map((story) => (
                    <Link key={story.id} to={`/article/${story.id}`} className="group block">
                      <div className="h-auto lg:h-[429px] border border-gray-200 overflow-hidden">
                        <img 
                          src={story.imageUrl} 
                          alt={story.title}
                          className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                        />
                        <div className="p-4">
                          <div className="text-xs text-blue-600 font-bold uppercase mb-2">
                            {story.category}
                          </div>
                          <h4 className="font-serif font-bold text-lg leading-tight mb-2 group-hover:underline">
                            {story.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                            {story.excerpt}
                          </p>
                          <div className="text-xs text-gray-500">
                            By {story.author.name} • {story.readTime}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - 4 columns */}
        <div className="lg:col-span-4 space-y-4 lg:space-y-6">
          {/* Live Audio Streaming Player */}
          <AudioStreamPlayer />

          {/* Trending */}
          <div className="border-gray-200 h-auto max-h-[400px] lg:h-[330px] overflow-y-auto">
            <div className="bg-[#021b41]/80 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase">Trending</h3>
            </div>
            <div className="p-4 space-y-3">
              {trendingStories.slice(0, 5).map((story, index) => (
                <Link key={story.id} to={`/article/${story.id}`} className="flex items-start gap-3 group">
                  <span className="bg-[#021b41]/80/50 text-white w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <img 
                    src={story.imageUrl} 
                    alt={story.title}
                    className="w-16 h-12 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm leading-tight group-hover:underline line-clamp-2 hover:line-clamp-none">
                      {story.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Did You Know */}
          <div className="border border-gray-200 h-auto max-h-[400px] lg:h-[330px] overflow-y-auto">
            <div className="bg-[#021b41]/80 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase">Did You Know?</h3>
            </div>
            <div className="p-4 space-y-3">
              {news.slice(0, 3).map((story) => (
                <div key={story.id} className="flex gap-3">
                  <img 
                    src={story.imageUrl} 
                    alt={story.title}
                    className="w-16 h-12 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm leading-tight mb-1 line-clamp-2 hover:line-clamp-none">
                      Did you know {typeof story.category === 'string' ? story.category.toLowerCase() : story.category} sector is making significant impact?
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 hover:line-clamp-none">
                      {story.excerpt.slice(0, 80)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Lists */}
          <div className="border border-gray-200 h-auto max-h-[500px] lg:h-[486px] overflow-y-auto">
            <div className="bg-[#021b41]/80 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase">Top Lists</h3>
            </div>
            <div className="p-4 space-y-3">
              {trendingStories.slice(0, 5).map((story, index) => (
                <Link key={story.id} to={`/article/${story.id}`} className="flex items-start gap-3 group">
                  <span className="bg-[#021b41]/80 text-white w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <img 
                    src={story.imageUrl} 
                    alt={story.title}
                    className="w-16 h-12 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm leading-tight group-hover:underline line-clamp-2 hover:line-clamp-none">
                      {story.title}
                    </h4>
                    <div className="text-xs text-gray-500 mt-1">
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
        <h2 className="text-xl sm:text-2xl font-serif font-bold mb-4 lg:mb-6">Video Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {videoStories.slice(0, 5).map((story, index) => (
            <div key={story.id} className="group">
              <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="relative">
                  {index === 0 ? (
                    <iframe
                      src="https://www.youtube.com/embed/rroiMpA0wvg?autoplay=1&mute=1&loop=1&playlist=rroiMpA0wvg"
                      className="w-full h-32"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img 
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-full h-32 object-cover group-hover:hidden"
                      />
                      <iframe
                        src="https://www.youtube.com/embed/rroiMpA0wvg?autoplay=1&mute=1&loop=1&playlist=rroiMpA0wvg"
                        className="w-full h-32 hidden group-hover:block"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:hidden">
                        <div className="w-10 h-10 bg-white/90 flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[8px] border-l-black border-y-[6px] border-y-transparent ml-1"></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-serif font-bold text-sm leading-tight group-hover:underline line-clamp-2">
                    {story.title}
                  </h4>
                  <div className="text-xs text-gray-500 mt-1">
                    {story.readTime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sport News */}
 

      {/* Culture, Lifestyle & More */}
      <div className="mt-8 lg:mt-12 border-t border-gray-200 pt-6 lg:pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Culture */}
          <div className="h-auto max-h-[500px] lg:h-[870px] overflow-y-auto border border-gray-200">
            <div className="bg-[#021b41]/80 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase">Culture</h3>
            </div>
            <div className="p-4 space-y-4">
              {news.filter(s => s.category === 'Entertainment').slice(0, 3).map((story) => (
                <Link key={story.id} to={`/article/${story.id}`} className="group block">
                  <div className="flex gap-3">
                    <img 
                      src={story.imageUrl} 
                      alt={story.title}
                      className="w-20 h-16 object-cover flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-sm leading-tight group-hover:underline mb-1">
                        {story.title}
                      </h4>
                      <div className="text-xs text-gray-500">
                        {story.readTime}
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
              <h3 className="text-lg font-serif font-bold border-b border-gray-200 pb-2 mb-4">Main Stories</h3>
              <div className="space-y-4">
                {regularStories.slice(0, 2).map((story) => (
                  <Link key={story.id} to={`/article/${story.id}`} className="group block">
                    <div className="h-auto lg:h-[400px] bg-white border border-gray-200 overflow-hidden">
                      <img 
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                      />
                      <div className="p-4">
                        <div className="text-xs text-blue-600 font-bold uppercase mb-2">
                          {story.category}
                        </div>
                        <h4 className="font-serif font-bold text-lg leading-tight mb-2 group-hover:underline">
                          {story.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                          {story.excerpt}
                        </p>
                        <div className="text-xs text-gray-500">
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
          <div className="h-auto max-h-[500px] lg:h-[870px] overflow-y-auto border border-gray-200">
            <div className="bg-[#021b41]/80 text-white px-4 py-2">
              <h3 className="font-bold text-sm uppercase">Environment</h3>
            </div>
            <div className="p-4 space-y-4">
              {news.filter(s => s.category === 'Environment').slice(0, 3).map((story) => (
                <Link key={story.id} to={`/article/${story.id}`} className="group block">
                  <div className="flex gap-3">
                    <img 
                      src={story.imageUrl} 
                      alt={story.title}
                      className="w-20 h-16 object-cover flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-sm leading-tight group-hover:underline mb-1">
                        {story.title}
                      </h4>
                      <div className="text-xs text-gray-500">
                        {story.readTime}
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
        <h2 className="text-xl sm:text-2xl font-serif font-bold mb-4 lg:mb-6">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {videoStories.slice(0, 5).map((story, index) => (
            <div key={story.id} className="group">
              <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="relative">
                  {index === 0 ? (
                    <iframe
                      src="https://www.youtube.com/embed/rroiMpA0wvg?autoplay=1&mute=1&loop=1&playlist=rroiMpA0wvg"
                      className="w-full h-32"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img 
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-full h-32 object-cover group-hover:hidden"
                      />
                      <iframe
                        src="https://www.youtube.com/embed/rroiMpA0wvg?autoplay=1&mute=1&loop=1&playlist=rroiMpA0wvg"
                        className="w-full h-32 hidden group-hover:block"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:hidden">
                        <div className="w-10 h-10 bg-white/90 flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[8px] border-l-black border-y-[6px] border-y-transparent ml-1"></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-serif font-bold text-sm leading-tight group-hover:underline line-clamp-2">
                    {story.title}
                  </h4>
                  <div className="text-xs text-gray-500 mt-1">
                    {story.readTime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
