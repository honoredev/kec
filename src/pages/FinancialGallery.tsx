import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Eye, Download } from 'lucide-react';
import KecHeader from '@/components/KecHeader';

const FinancialGallery = () => {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock financial gallery data
  const mockFinancialData = [
    {
      id: 1,
      category: 'charts',
      title: 'Rwanda GDP Growth 2024',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      description: 'Annual GDP growth showing positive trends',
      trend: 'up',
      percentage: '+7.2%',
      views: 1234,
      downloads: 89
    },
    {
      id: 2,
      category: 'infographics',
      title: 'East Africa Trade Statistics',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      description: 'Comprehensive trade data visualization',
      trend: 'up',
      percentage: '+12.5%',
      views: 2156,
      downloads: 234
    },
    {
      id: 3,
      category: 'reports',
      title: 'Banking Sector Performance',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
      description: 'Q4 2024 banking sector analysis',
      trend: 'down',
      percentage: '-2.1%',
      views: 987,
      downloads: 156
    },
    {
      id: 4,
      category: 'charts',
      title: 'Currency Exchange Rates',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
      description: 'RWF vs major currencies performance',
      trend: 'up',
      percentage: '+3.8%',
      views: 1567,
      downloads: 298
    },
    {
      id: 5,
      category: 'infographics',
      title: 'Investment Portfolio Analysis',
      imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop',
      description: 'Diversified investment strategies overview',
      trend: 'up',
      percentage: '+15.3%',
      views: 3421,
      downloads: 567
    },
    {
      id: 6,
      category: 'reports',
      title: 'Market Volatility Index',
      imageUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=400&fit=crop',
      description: 'Risk assessment and market predictions',
      trend: 'down',
      percentage: '-5.7%',
      views: 2234,
      downloads: 345
    }
  ];

  const categories = [
    { id: 'all', name: 'All', count: mockFinancialData.length },
    { id: 'charts', name: 'Charts', count: mockFinancialData.filter(item => item.category === 'charts').length },
    { id: 'infographics', name: 'Infographics', count: mockFinancialData.filter(item => item.category === 'infographics').length },
    { id: 'reports', name: 'Reports', count: mockFinancialData.filter(item => item.category === 'reports').length }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFinancialData(mockFinancialData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredData = selectedCategory === 'all' 
    ? financialData 
    : financialData.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <KecHeader />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading financial gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <KecHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Gallery</h1>
          <p className="text-gray-600">Visual insights into Rwanda's economic landscape</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[#021b41] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-3">
                    <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-[#021b41] text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
                    {item.category}
                  </span>
                </div>

                {/* Trend Indicator */}
                <div className="absolute top-3 right-3">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${
                    item.trend === 'up' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{item.percentage}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#021b41] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{item.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{item.downloads}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-[#021b41]">
                    <BarChart3 className="w-4 h-4" />
                    <span className="font-medium">View Details</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-[#021b41] text-white px-8 py-3 rounded-lg hover:bg-[#021b41]/90 transition-colors flex items-center space-x-2 mx-auto">
            <DollarSign className="w-5 h-5" />
            <span>Load More Financial Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialGallery;