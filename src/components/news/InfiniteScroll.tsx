import { useState, useEffect, useCallback } from "react";
import { NewsStory } from "@/data/hardcodedNews";
import { NewsGrid } from "./NewsGrid";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface InfiniteScrollProps {
  initialStories: NewsStory[];
  loadMoreStories: (page: number) => Promise<NewsStory[]>;
  hasMore?: boolean;
}

export function InfiniteScroll({ initialStories, loadMoreStories, hasMore = true }: InfiniteScrollProps) {
  const [stories, setStories] = useState<NewsStory[]>(initialStories);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreStories, setHasMoreStories] = useState(hasMore);

  const loadMore = useCallback(async () => {
    if (loading || !hasMoreStories) return;

    setLoading(true);
    try {
      const newStories = await loadMoreStories(page + 1);
      if (newStories.length === 0) {
        setHasMoreStories(false);
      } else {
        setStories(prev => [...prev, ...newStories]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to load more stories:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMoreStories, page, loadMoreStories]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  return (
    <div>
      <NewsGrid stories={stories} />
      
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}
      
      {!hasMoreStories && stories.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end of the stories</p>
        </div>
      )}
      
      {!loading && hasMoreStories && (
        <div className="text-center py-8">
          <button
            onClick={loadMore}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load More Stories
          </button>
        </div>
      )}
    </div>
  );
}

// Pagination Component Alternative
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg border ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}