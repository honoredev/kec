import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Eye, TrendingUp, MessageCircle, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import KecHeader from '@/components/KecHeader';

interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  images?: string;
  leftColumnContent?: string;
  rightColumnContent?: string;
  author: { name: string };
  category: { name: string; slug: string };
  publishedAt: string;
  views: number;
  tags?: string;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  // Hardcoded fallback comments
  const fallbackComments: Comment[] = [
    {
      id: 1,
      content: "This is a very insightful article. The analysis provided here really helps understand the current situation better. Thank you for sharing this valuable information.",
      author: "Sarah Johnson",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      content: "Great piece of journalism! I appreciate the thorough research and balanced perspective presented in this article.",
      author: "Michael Chen",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      content: "Excellent reporting. This article provides exactly the kind of detailed analysis we need on this topic.",
      author: "Emma Williams",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        console.log('No slug provided');
        setLoading(false);
        return;
      }
      
      console.log('Fetching article with slug:', slug);
      
      try {
        const [articleResponse, trendingResponse] = await Promise.all([
          fetch(`https://kec-backend-1.onrender.com/api/articles/${slug}`),
          fetch('https://kec-backend-1.onrender.com/api/articles')
        ]);
        
        console.log('Response status:', articleResponse.status);
        
        if (articleResponse.ok) {
          const data = await articleResponse.json();
          console.log('Article data:', data);
          setArticle(data);
        } else {
          console.error('Failed to fetch article:', articleResponse.status, articleResponse.statusText);
        }
        
        if (trendingResponse.ok) {
          const trendingData = await trendingResponse.json();
          const allArticles = trendingData.articles || [];
          // Sort by newest first and shuffle randomly
          const sortedArticles = allArticles
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .sort(() => Math.random() - 0.5);
          setTrendingArticles(sortedArticles.slice(0, 15));
        }
        
        // Always set fallback comments first, then try to fetch real ones
        setComments(fallbackComments);
        
        // Fetch comments
        if (articleResponse.ok) {
          try {
            const commentsResponse = await fetch(`https://kec-backend-1.onrender.com/api/articles/${slug}/comments`);
            if (commentsResponse.ok) {
              const commentsData = await commentsResponse.json();
              const fetchedComments = commentsData.comments || [];
              // Only replace fallback comments if we have real comments
              if (fetchedComments.length > 0) {
                setComments(fetchedComments);
              }
            }
          } catch (error) {
            console.error('Error fetching comments:', error);
            // Keep fallback comments on error
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link to="/" className="text-gray-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  // Parse additional images
  let additionalImages: string[] = [];
  if (article.images) {
    try {
      additionalImages = JSON.parse(article.images);
    } catch (e) {
      console.error('Error parsing images:', e);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <KecHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Article Content */}
          <div className="col-span-12 lg:col-span-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Link>

        {/* Page Header */}
        <header className="text-center mb-10">
          <Badge className="mb-4 bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium">
            {article.category.name}
          </Badge>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>
          
          {/* Main Article Image */}
          {article.imageUrl && (
            <figure className="mb-6">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover mb-3"
              />
              <figcaption className="text-sm text-gray-600 italic">
                Figure 1: {article.title}
              </figcaption>
            </figure>
          )}
          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{article.views} views</span>
            </div>
          </div>
        </header>

        {/* Article Body - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(() => {
            // Use predefined column content or split at midpoint
            const allParagraphs = article.content.split('\n\n').filter(p => p.trim());
            const midpoint = Math.ceil(allParagraphs.length / 2);
            
            const leftParagraphs = article.leftColumnContent 
              ? article.leftColumnContent.split('\n\n').filter(p => p.trim())
              : allParagraphs.slice(0, midpoint);
              
            const rightParagraphs = article.rightColumnContent 
              ? article.rightColumnContent.split('\n\n').filter(p => p.trim())
              : allParagraphs.slice(midpoint);

            // Split images between columns
            const imagesPerColumn = Math.ceil(additionalImages.length / 2);
            const leftImages = additionalImages.slice(0, imagesPerColumn);
            const rightImages = additionalImages.slice(imagesPerColumn);

            let globalImageCounter = 2;

            const renderColumn = (paragraphs: string[], images: string[]) => {
              const elements: JSX.Element[] = [];
              
              // Calculate intervals for image placement
              const imageInterval = images.length > 0 
                ? Math.floor(paragraphs.length / images.length)
                : paragraphs.length + 1;
              
              let imageIndex = 0;
              let localImageCounter = globalImageCounter;

              paragraphs.forEach((paragraph, pIndex) => {
                // Add paragraph
                elements.push(
                  <p 
                    key={`p-${pIndex}`} 
                    className="mb-4 text-justify leading-relaxed text-gray-800"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {paragraph.trim()}
                  </p>
                );

                // Insert image after certain paragraphs
                const shouldInsertImage = 
                  imageIndex < images.length && 
                  (pIndex + 1) % imageInterval === 0 &&
                  pIndex < paragraphs.length - 1;

                if (shouldInsertImage) {
                  elements.push(
                    <figure key={`fig-${localImageCounter}`} className="mb-6 mt-2">
                      <img
                        src={images[imageIndex]}
                        alt={`Figure ${localImageCounter}`}
                        className="w-full h-auto border border-gray-200"
                      />
                      <figcaption className="text-sm text-gray-600 italic mt-2 text-center">
                        Figure {localImageCounter}
                      </figcaption>
                    </figure>
                  );
                  imageIndex++;
                  localImageCounter++;
                }
              });

              // Add any remaining images at the end of the column
              while (imageIndex < images.length) {
                elements.push(
                  <figure key={`fig-end-${localImageCounter}`} className="mb-6 mt-2">
                    <img
                      src={images[imageIndex]}
                      alt={`Figure ${localImageCounter}`}
                      className="w-full h-auto border border-gray-200"
                    />
                    <figcaption className="text-sm text-gray-600 italic mt-2 text-center">
                      Figure {localImageCounter}
                    </figcaption>
                  </figure>
                );
                imageIndex++;
                localImageCounter++;
              }

              globalImageCounter = localImageCounter;
              return elements;
            };

            return (
              <>
                {/* Left Column */}
                <div className="space-y-0">
                  {renderColumn(leftParagraphs, leftImages)}
                </div>

                {/* Right Column */}
                <div className="space-y-0">
                  {renderColumn(rightParagraphs, rightImages)}
                </div>
              </>
            );
          })()}
        </div>

        {/* Comments Section */}
        <div id="comments" className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Comments ({comments.length})</h2>
          </div>

          {/* Comment Form */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={async () => {
                  if (!newComment.trim() || !commentAuthor.trim()) return;
                  
                  setSubmittingComment(true);
                  
                  // Create optimistic comment for immediate display
                  const optimisticComment: Comment = {
                    id: Date.now(), // Temporary ID
                    content: newComment,
                    author: commentAuthor,
                    createdAt: new Date().toISOString()
                  };
                  
                  // Add comment immediately to UI
                  setComments(prev => [optimisticComment, ...prev]);
                  setNewComment('');
                  setCommentAuthor('');
                  
                  try {
                    const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${article?.id}/comments`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ content: optimisticComment.content, author: optimisticComment.author })
                    });
                    
                    console.log('Comment response status:', response.status);
                    const responseText = await response.text();
                    console.log('Comment response:', responseText);
                    
                    if (response.ok) {
                      const savedComment = JSON.parse(responseText);
                      // Replace optimistic comment with real one from server
                      setComments(prev => prev.map(c => c.id === optimisticComment.id ? savedComment : c));
                    } else {
                      console.error('Failed to save comment:', responseText);
                      // Remove optimistic comment if save failed
                      setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
                    }
                  } catch (error) {
                    console.error('Error posting comment:', error);
                    // Remove optimistic comment if save failed
                    setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
                  } finally {
                    setSubmittingComment(false);
                  }
                }}
                disabled={!newComment.trim() || !commentAuthor.trim() || submittingComment}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                      <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-4">
              {/* Latest News */}
              <div className="bg-white border border-gray-200 p-6 lg:h-screen lg:overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Latest News</h2>
                </div>
                
                <div className="space-y-5">
                  {trendingArticles
                    .filter(newsArticle => newsArticle.id !== article?.id)
                    .sort((a, b) => {
                      // Prioritize same category articles
                      if (a.category?.slug === article?.category?.slug && b.category?.slug !== article?.category?.slug) return -1;
                      if (b.category?.slug === article?.category?.slug && a.category?.slug !== article?.category?.slug) return 1;
                      // Then sort by date
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    })
                    .map((newsArticle, index) => (
                    <Link key={newsArticle.id} to={`/article/${newsArticle.slug}`} className="flex gap-3 group hover:bg-gray-50 p-2 -m-2 transition-colors">
                      {/* Left Column - Thumbnail (25-30% width) */}
                      <div className="w-24 h-24 flex-shrink-0 relative">
                        
                        <img 
                          src={newsArticle.imageUrl || `https://picsum.photos/400/250?random=${newsArticle.id}`}
                          alt={newsArticle.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Right Column - Text (70-75% width) */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-3 group-hover:underline leading-tight">
                          {newsArticle.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {new Date(newsArticle.publishedAt || newsArticle.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;