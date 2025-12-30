import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Megaphone, 
  Search, 
  Filter, 
  MapPin, 
  Calendar,
  Eye,
  Gavel,
  Newspaper,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import NewsSidebar from "@/components/NewsSidebar";

const API_URL = import.meta.env.VITE_API_URL || 'https://gazelle-back.onrender.com/api';
const API_BASE = API_URL.replace('/api', '');

interface BaseItem {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
}

interface Advertisement extends BaseItem {
  fullDescription: string;
  company: string;
  category: string;
  location: string;
  deadline?: string;
  views: number;
  applicants: number;
  contactPhone?: string;
  contactEmail?: string;
  contactWebsite?: string;
  contactAddress?: string;
  isFeatured?: boolean;
}

interface Auction extends BaseItem {
  currentBid: number;
  startingPrice: number;
  endTime: string;
  status: 'active' | 'completed' | 'upcoming';
  bids: number;
}

interface NewsArticle extends BaseItem {
  summary: string;
  author: string;
  category: string;
  readTime: string;
  isBreaking?: boolean;
}

const AllAdvertisementsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("advertisements");
  
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  
  const [loading, setLoading] = useState({
    ads: true,
    auctions: true,
    news: true
  });
  
  const allLoading = Object.values(loading).some(v => v === true);
  
  // Extract unique categories from advertisements
  const categories = ["all", ...new Set(advertisements.map(ad => ad.category))];
  
  // Filter ads based on search and category
  const filteredAds = advertisements.filter((ad) => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       ad.fullDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       ad.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || ad.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Advertisements
        const [adsRes, auctionsRes, newsRes] = await Promise.all([
          fetch(`${API_URL}/advertisements?limit=6`).then(res => res.json()),
          fetch(`${API_URL}/auctions?status=active&limit=6`).then(res => res.json()),
          fetch(`${API_URL}/articles?status=published&limit=6`).then(res => res.json())
        ]);

        if (adsRes.success) setAdvertisements(adsRes.data || []);
        if (auctionsRes.success) setAuctions(auctionsRes.data || []);
        if (newsRes.success) setNews(newsRes.data || []);
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading({ ads: false, auctions: false, news: false });
      }
    };

    fetchData();
  }, []);

  // Get image URL helper
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) {
      return 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${API_BASE}${imageUrl}`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return '';
    }
  };
  
  // Get time remaining for auctions
  const getTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  // Loading state
  if (allLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Megaphone className="w-12 h-12" />
              <h1 className="text-5xl font-bold">Amatangazo Yose</h1>
            </div>
            <p className="text-xl text-white/90 mb-8">
              Reba amatangazo yose y'akazi, uburezi, ubucuruzi n'ayandi
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Shakisha amatangazo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-full border-2 border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:bg-white focus:text-gray-900 transition-all"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
              <div className="glass p-6 rounded-xl">
                <Megaphone className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">{advertisements.length}</div>
                <div className="text-sm text-white/80">Amatangazo</div>
              </div>
              <div className="glass p-6 rounded-xl">
                <Gavel className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">{auctions.length}</div>
                <div className="text-sm text-white/80">Amasoko</div>
              </div>
              <div className="glass p-6 rounded-xl">
                <Newspaper className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">{news.length}</div>
                <div className="text-sm text-white/80">Amakuru</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="advertisements" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              Amatangazo
            </TabsTrigger>
            <TabsTrigger value="auctions" className="flex items-center gap-2">
              <Gavel className="w-4 h-4" />
              Amasoko
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              Amakuru Mashya
            </TabsTrigger>
          </TabsList>
          
          {/* Advertisements Tab */}
          <TabsContent value="advertisements">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                {/* Categories Filter */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h2 className="text-xl font-bold">Hitamo Icyiciro</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-3 rounded-full font-semibold transition-all ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg scale-105"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {category === "all" ? "Byose" : category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advertisements List */}
                {filteredAds.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredAds.map((ad) => (
                      <Card key={ad.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <img 
                            src={getImageUrl(ad.imageUrl)} 
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                          {ad.isFeatured && (
                            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                              Icyamamare
                            </div>
                          )}
                        </div>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{ad.title}</CardTitle>
                            <span className="text-sm text-gray-500">{formatDate(ad.createdAt)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            {ad.location}
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-gray-600 line-clamp-3">{ad.fullDescription}</p>
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full">
                            <Link to={`/advertisement/${ad.id}`}>Soma Birenzeho</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Megaphone className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">Nta Tangazo ririmo kuri ubu</h3>
                    <p className="text-gray-500 mt-2">Subira hanyuma ushake amatangazo mashya</p>
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-4 space-y-6">
                  <NewsSidebar />
                </div>
              </aside>
            </div>
          </TabsContent>
          
          {/* Auctions Tab */}
          <TabsContent value="auctions">
            {auctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.map((auction) => (
                  <Card key={auction.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={getImageUrl(auction.imageUrl)} 
                        alt={auction.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {auction.status === 'active' ? 'Irarimo' : 'Irarangira'}
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{auction.title}</CardTitle>
                        <span className="text-sm text-gray-500">{formatDate(auction.createdAt)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {getTimeRemaining(auction.endTime)}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 line-clamp-3">{auction.description}</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Igiciro cyo gutangira:</span>
                          <span className="font-medium">{auction.startingPrice} RWF</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Igiciro kiringaniye:</span>
                          <span className="font-medium text-orange-600">{auction.currentBid} RWF</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link to={`/auction/${auction.id}`}>Shora Aho Uri</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gavel className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">Nta Soko ririmo kuri ubu</h3>
                <p className="text-gray-500 mt-2">Subira hanyuma ushake amasoko mashya</p>
              </div>
            )}
          </TabsContent>
          
          {/* News Tab */}
          <TabsContent value="news">
            {news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <Card key={item.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={getImageUrl(item.imageUrl)} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.isBreaking && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          Amakuru Mashya
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <span className="text-sm text-gray-500">{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.category} • {item.readTime || '2 min'} y'isomo
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 line-clamp-3">{item.summary || item.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/news/${item.id}`}>Soma Birenzeho</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Newspaper className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">Nta Makuru arimo kuri ubu</h3>
                <p className="text-gray-500 mt-2">Subira hanyuma ushake amakuru mashya</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AllAdvertisementsPage;
