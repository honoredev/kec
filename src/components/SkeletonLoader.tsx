import React from 'react';

export const ArticleSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-300 h-64 w-full mb-4"></div>
    <div className="space-y-3">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-3 bg-gray-300 rounded w-24"></div>
        <div className="h-3 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export const FeaturedSkeleton = () => (
  <div className="animate-pulse border border-gray-200 overflow-hidden">
    <div className="bg-gray-300 h-80 w-full"></div>
    <div className="p-6 space-y-4">
      <div className="h-8 bg-gray-300 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-300 rounded w-32"></div>
        <div className="h-3 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  </div>
);

export const SidebarSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex space-x-3">
        <div className="bg-gray-300 h-16 w-20 flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    ))}
  </div>
);