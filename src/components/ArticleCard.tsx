import { Eye, Share2 } from 'lucide-react';
import { timeAgo } from '@/utils/timeAgo';

interface ArticleCardProps {
  article: any;
  onClick?: () => void;
}

const ArticleCard = ({ article, onClick }: ArticleCardProps) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: `${window.location.origin}/article/${article.id}`
      });
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = `/article/${article.id}`;
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="card-hover rounded-card bg-white shadow-md cursor-pointer"
    >
      {article.imageUrl && (
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-40 sm:h-48 md:h-52 object-cover rounded-t-lg"
        />
      )}
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            {article.category?.name}
          </span>
          <span className="text-xs">{timeAgo(article.createdAt)}</span>
        </div>
        <h3 className="font-bold text-sm sm:text-base md:text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-3">{article.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs">{article.views || 0}</span>
          </div>
          <button 
            onClick={handleShare}
            className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
          >
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs">Share</span>
          </button>
        </div>
      </div>
    </div>
  );}
};

export default ArticleCard;
