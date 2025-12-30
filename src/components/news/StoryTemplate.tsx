import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Eye, MessageCircle, Share2, Heart, User, Calendar, MapPin, Play, Volume2, Image as ImageIcon } from "lucide-react";
import { NewsStory } from "@/data/hardcodedNews";

interface StoryTemplateProps {
  story: NewsStory;
  relatedStories?: NewsStory[];
}

export function StoryTemplate({ story, relatedStories = [] }: StoryTemplateProps) {
  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views.toString();
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-5 h-5" />;
      case 'audio': return <Volume2 className="w-5 h-5" />;
      case 'gallery': return <ImageIcon className="w-5 h-5" />;
      default: return null;
    }
  };

  const renderMediaContent = () => {
    switch (story.contentType) {
      case 'video':
        return (
          <div className="relative mb-8">
            {story.videoUrl ? (
              <video controls className="w-full rounded-lg">
                <source src={story.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : story.youtubeUrl ? (
              <div className="aspect-video">
                <iframe
                  src={story.youtubeUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative">
                <img src={story.imageUrl || '/placeholder.svg'} alt={story.title} className="w-full rounded-lg" />
                <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                  <Play className="w-16 h-16 text-white" />
                </div>
              </div>
            )}
          </div>
        );
      
      case 'audio':
        return (
          <div className="mb-8">
            {story.audioUrl && (
              <audio controls className="w-full mb-4">
                <source src={story.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
            {story.imageUrl && (
              <img src={story.imageUrl} alt={story.title} className="w-full rounded-lg" />
            )}
          </div>
        );
      
      case 'gallery':
        return (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {story.gallery?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${story.title} - Image ${index + 1}`}
                  className="w-full rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              ))}
            </div>
          </div>
        );
      
      default:
        return story.imageUrl ? (
          <img src={story.imageUrl} alt={story.title} className="w-full rounded-lg mb-8" />
        ) : null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {story.category}
          </span>
          {story.breaking && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              🔥 BREAKING
            </span>
          )}
          {story.trending && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              TRENDING
            </span>
          )}
          {getContentTypeIcon(story.contentType) && (
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {getContentTypeIcon(story.contentType)}
              {story.contentType.toUpperCase()}
            </span>
          )}
        </div>

        {/* Drop Cap Title */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          <span className="float-left text-6xl md:text-8xl font-serif text-blue-600 mr-2 mt-2 leading-none">
            {story.title.charAt(0)}
          </span>
          {story.title.slice(1)}
        </h1>

        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {story.excerpt}
        </p>

        {/* Story Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="font-medium">{story.author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(story.publishedAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{story.readTime}</span>
          </div>
          {story.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{story.location}</span>
            </div>
          )}
        </div>

        {/* Social Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 pb-6 border-b">
          
          <span className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            {story.likes} likes
          </span>
          <span className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            {story.comments} comments
          </span>
          <span className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            {story.shareCount} shares
          </span>
        </div>
      </header>

      {/* Media Content */}
      {renderMediaContent()}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: story.content }} />
      </div>

      {/* Pull Quotes */}
      {story.pullQuotes && story.pullQuotes.length > 0 && (
        <div className="my-8">
          {story.pullQuotes.map((quote, index) => (
            <blockquote key={index} className="border-l-4 border-blue-600 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg">
              <p className="text-xl font-medium text-gray-800 italic">"{quote}"</p>
            </blockquote>
          ))}
        </div>
      )}

      {/* Tags */}
      {story.tags && story.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {story.tags.map((tag) => (
              <Link
                key={tag}
                to={`/tag/${tag.toLowerCase()}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {story.author.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">{story.author.name}</h3>
            <p className="text-gray-600">{story.author.bio}</p>
          </div>
        </div>
      </div>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Related Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedStories.slice(0, 3).map((relatedStory) => (
              <Link key={relatedStory.id} to={`/article/${relatedStory.id}`} className="group">
                <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <img
                    src={relatedStory.imageUrl || '/placeholder.svg'}
                    alt={relatedStory.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {relatedStory.category}
                    </span>
                    <h4 className="font-semibold mt-2 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {relatedStory.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{relatedStory.readTime}</span>
                      <span>•</span>
                      <span>{formatViews(relatedStory.views)} views</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}