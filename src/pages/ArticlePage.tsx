import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const ArticlePage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedStories, setRelatedStories] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${id}`);
        if (response.ok) {
          const data = await response.json();
          setStory(data);
          
          // Fetch related articles
          const relatedResponse = await fetch(`https://kec-backend-1.onrender.com/api/articles?category=${data.category?.name}&limit=3`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            const related = (relatedData.articles || relatedData).filter(s => s.id !== data.id).slice(0, 3);
            setRelatedStories(related);
          }
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-64 bg-gray-300 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <Link to="/" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold">The Rwanda Times</Link>
      </div>

      {/* Article */}
      <article className="max-w-2xl mx-auto">
        {/* Category */}
        <div className="text-sm font-bold uppercase tracking-wide text-blue-600 mb-2">
          {story.category?.name || 'General'}
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-tight mb-3 sm:mb-4">
          {story.title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-4 sm:mb-6 font-serif">
          {story.excerpt}
        </p>

        {/* Byline */}
        <div className="border-t border-b border-gray-200 py-2 sm:py-3 mb-4 sm:mb-6 text-xs sm:text-sm">
          <div className="font-bold">By {story.author?.name || 'Unknown'}</div>
          <div className="text-gray-600">
            {new Date(story.publishedAt || story.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Featured Image */}
        {/* Featured Media */}
        {story.contentType === 'video' && story.videoUrl ? (
          <figure className="mb-6 sm:mb-8">
            <video controls className="w-full rounded-lg">
              <source src={story.videoUrl} type="video/mp4" />
            </video>
            <figcaption className="text-xs sm:text-sm text-gray-600 mt-2 italic">
              {story.location && `${story.location} - `}
              {story.title}
            </figcaption>
          </figure>
        ) : story.contentType === 'gallery' && story.gallery ? (
          <figure className="mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {story.gallery.map((img, i) => (
                <img key={i} src={img} alt={`${story.title} ${i+1}`} className="w-full rounded-lg" />
              ))}
            </div>
            <figcaption className="text-xs sm:text-sm text-gray-600 mt-2 italic">
              {story.location && `${story.location} - `}
              {story.title}
            </figcaption>
          </figure>
        ) : (
          <figure className="mb-6 sm:mb-8">
            <img 
              src={story.imageUrl} 
              alt={story.title}
              className="w-full rounded-lg"
            />
            <figcaption className="text-xs sm:text-sm text-gray-600 mt-2 italic">
              {story.location && `${story.location} - `}
              {story.title}
            </figcaption>
          </figure>
        )}

        {/* Content */}
        <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none font-serif leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: story.content }} />
        </div>

        {/* Pull Quotes */}
        {story.pullQuotes?.map((quote, index) => (
          <blockquote key={index} className="text-lg sm:text-xl md:text-2xl font-serif italic text-center my-6 sm:my-8 py-4 sm:py-6 border-t border-b border-gray-200">
            "{quote}"
          </blockquote>
        ))}

        {/* Tags */}
        {story.tags && (
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="text-xs sm:text-sm text-gray-600">
              Tags: {story.tags.map((tag, index) => (
                <span key={tag}>
                  <Link to={`/tag/${tag.toLowerCase()}`} className="text-blue-600 hover:underline">
                    {tag}
                  </Link>
                  {index < story.tags.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

        {/* Related Articles */}
        {relatedStories.length > 0 && (
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6">More in {story.category?.name || 'This Category'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedStories.map((related) => (
                <Link key={related.id} to={`/article/${related.id}`} className="group">
                  <article>
                    <img 
                      src={related.imageUrl} 
                      alt={related.title}
                      className="w-full h-32 sm:h-40 object-cover mb-2 rounded-lg"
                    />
                    <h4 className="font-serif font-bold text-sm sm:text-base leading-tight group-hover:underline">
                      {related.title}
                    </h4>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                      By {related.author?.name || 'Unknown'}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default ArticlePage;