import { useParams, Link } from "react-router-dom";
import { hardcodedNews } from "@/data/hardcodedNews";

export function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const tagStories = hardcodedNews.filter(story =>
    story.tags.some(storyTag => 
      storyTag.toLowerCase() === tag?.toLowerCase()
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <Link to="/" className="text-5xl font-serif font-bold">The Rwanda Times</Link>
        <h1 className="text-3xl font-serif font-bold mt-4">#{tag}</h1>
        <p className="text-gray-600 mt-2">{tagStories.length} articles</p>
      </div>

      {/* Stories */}
      <div className="grid grid-cols-3 gap-8">
        {tagStories.map((story) => (
          <Link key={story.id} to={`/article/${story.id}`} className="group">
            <article>
              <img 
                src={story.imageUrl} 
                alt={story.title}
                className="w-full h-48 object-cover mb-3"
              />
              <div className="text-xs font-bold uppercase tracking-wide text-blue-600 mb-1">
                {story.category}
              </div>
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
  );
}