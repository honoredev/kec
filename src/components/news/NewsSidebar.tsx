import { Link } from "react-router-dom";
import { TrendingUp, Eye, Clock, Play } from "lucide-react";
import { NewsStory } from "@/data/hardcodedNews";

interface NewsSidebarProps {
  trendingStories: NewsStory[];
  opinionStories: NewsStory[];
  videoStories: NewsStory[];
}

export function NewsSidebar({ trendingStories, opinionStories, videoStories }: NewsSidebarProps) {
  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views.toString();
  };

  return (
    <div className="space-y-6">
      {/* Trending Stories */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3">
          <h2 className="font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Trending Now
          </h2>
        </div>
        <div className="p-4 space-y-4">
          {trendingStories.slice(0, 5).map((story, index) => (
            <Link key={story.id} to={`/article/${story.id}`} className="group block">
              <article className="flex gap-3 hover:bg-gray-50 p-2 rounded transition-colors">
                <div className="flex-shrink-0">
                  <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-orange-600 transition-colors mb-1">
                    {story.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatViews(story.views)}
                    </span>
                    <span>{story.readTime}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Opinion/Editorial */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3">
          <h2 className="font-bold">Opinion & Analysis</h2>
        </div>
        <div className="p-4 space-y-4">
          {opinionStories.slice(0, 3).map((story) => (
            <Link key={story.id} to={`/article/${story.id}`} className="group block">
              <article className="hover:bg-gray-50 p-2 rounded transition-colors">
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-purple-600 transition-colors mb-2">
                  {story.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>{story.author.name}</span>
                  <span>•</span>
                  <span>{story.readTime}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {story.excerpt}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Video Stories */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3">
          <h2 className="font-bold flex items-center gap-2">
            <Play className="w-5 h-5" />
            Video Stories
          </h2>
        </div>
        <div className="p-4 space-y-4">
          {videoStories.slice(0, 3).map((story) => (
            <Link key={story.id} to={`/article/${story.id}`} className="group block">
              <article className="hover:bg-gray-50 p-2 rounded transition-colors">
                <div className="relative mb-2">
                  <img
                    src={story.imageUrl || '/placeholder.svg'}
                    alt={story.title}
                    className="w-full h-20 object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-black/30 rounded flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
                  {story.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatViews(story.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {story.readTime}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg p-6">
        <h3 className="font-bold mb-2">Stay Updated</h3>
        <p className="text-sm mb-4 opacity-90">Get the latest news delivered to your inbox</p>
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded text-gray-900 text-sm"
          />
          <button className="w-full bg-white text-blue-600 py-2 rounded font-semibold text-sm hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}