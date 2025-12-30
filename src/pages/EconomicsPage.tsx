import { Link } from "react-router-dom";
import { getNewsByCategory } from "@/data/hardcodedNews";

const EconomicsPage = () => {
  const economicsStories = getNewsByCategory('Economics');
  const featuredStory = economicsStories[0];
  const otherStories = economicsStories.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <Link to="/" className="text-5xl font-serif font-bold">The Rwanda Times</Link>
        <h1 className="text-3xl font-serif font-bold mt-4">Economics</h1>
      </div>

      {/* Featured Story */}
      {featuredStory && (
        <div className="mb-12">
          <Link to={`/article/${featuredStory.id}`} className="group">
            <article className="grid grid-cols-12 gap-6">
              <div className="col-span-6">
                <img 
                  src={featuredStory.imageUrl} 
                  alt={featuredStory.title}
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="col-span-6">
                <h2 className="text-3xl font-serif font-bold leading-tight mb-4 group-hover:underline">
                  {featuredStory.title}
                </h2>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  {featuredStory.excerpt}
                </p>
                <div className="text-sm text-gray-500">
                  By {featuredStory.author.name} • {new Date(featuredStory.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </article>
          </Link>
        </div>
      )}

      {/* Other Stories */}
      <div className="border-t border-gray-200 pt-8">
        <div className="grid grid-cols-3 gap-8">
          {otherStories.map((story) => (
            <Link key={story.id} to={`/article/${story.id}`} className="group">
              <article>
                <img 
                  src={story.imageUrl} 
                  alt={story.title}
                  className="w-full h-48 object-cover mb-3"
                />
                <h3 className="font-serif font-bold text-xl leading-tight mb-2 group-hover:underline">
                  {story.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                  {story.excerpt}
                </p>
                <div className="text-xs text-gray-500">
                  By {story.author.name} • {new Date(story.publishedAt).toLocaleDateString()}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EconomicsPage;