import { Link } from "react-router-dom";
import { Clock, Eye, User, Calendar, Play, Volume2, Image as ImageIcon } from "lucide-react";
import { NewsStory } from "@/data/hardcodedNews";

interface NewsGridProps {
  stories: NewsStory[];
}

export function NewsGrid({ stories }: NewsGridProps) {
  const featuredStory = stories.find(story => story.featured);
  const secondaryStories = stories.filter(story => story.featured && story.id !== featuredStory?.id).slice(0, 2);
  const regularStories = stories.filter(story => !story.featured);

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'audio': return <Volume2 className="w-4 h-4" />;
      case 'gallery': return <ImageIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views.toString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Featured Story - Large */}
      {featuredStory && (
        <div className="lg:col-span-2 lg:row-span-2">
          <Link to={`/article/${featuredStory.id}`} className="group block">
            <article className="relative h-full min-h-[500px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src={featuredStory.imageUrl || '/placeholder.svg'}
                alt={featuredStory.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {featuredStory.breaking && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    🔥 BREAKING
                  </span>
                )}
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  FEATURED
                </span>
                {getContentTypeIcon(featuredStory.contentType) && (
                  <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                    {getContentTypeIcon(featuredStory.contentType)}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="mb-3">
                  <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    {featuredStory.category}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-3">
                  {featuredStory.title}
                </h1>
                <p className="text-gray-200 mb-4 line-clamp-2">
                  {featuredStory.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredStory.author.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatViews(featuredStory.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredStory.readTime}
                  </span>
                </div>
              </div>
            </article>
          </Link>
        </div>
      )}

      {/* Secondary Stories - Medium */}
      {secondaryStories.map((story) => (
        <div key={story.id} className="lg:col-span-1">
          <Link to={`/article/${story.id}`} className="group block">
            <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full">
              <div className="relative">
                <img
                  src={story.imageUrl || '/placeholder.svg'}
                  alt={story.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {story.breaking && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      BREAKING
                    </span>
                  )}
                  {getContentTypeIcon(story.contentType) && (
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      {getContentTypeIcon(story.contentType)}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {story.category}
                  </span>
                </div>
                <h2 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {story.title}
                </h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {story.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(story.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatViews(story.views)}
                  </span>
                </div>
              </div>
            </article>
          </Link>
        </div>
      ))}

      {/* Regular Stories - Small */}
      <div className="lg:col-span-2 space-y-4">
        {regularStories.slice(0, 6).map((story) => (
          <Link key={story.id} to={`/article/${story.id}`} className="group block">
            <article className="flex gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img
                src={story.imageUrl || '/placeholder.svg'}
                alt={story.title}
                className="w-24 h-20 object-cover rounded flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {story.category}
                  </span>
                  {getContentTypeIcon(story.contentType) && (
                    <span className="text-purple-600">
                      {getContentTypeIcon(story.contentType)}
                    </span>
                  )}
                  {story.trending && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                      TRENDING
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {story.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {story.author.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatViews(story.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {story.readTime}
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}