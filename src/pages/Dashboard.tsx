import { useState, useEffect } from 'react';
import { Plus, Edit3, FileText, TrendingUp, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import ArticleModal from '@/components/ArticleModal';
import CategoryModal from '@/components/CategoryModal';
import VideoModal from '@/components/VideoModal';
import VideoCategoryModal from '@/components/VideoCategoryModal';
import LiveMatchModal from '@/components/LiveMatchModal';
import AudioModal from '@/components/AudioModal';
import FunModal from '@/components/FunModal';
import MusicPlayer from '@/components/MusicPlayer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import LoginModal from '@/components/LoginModal';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('articles');
  const [activeSubTab, setActiveSubTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoCategories, setVideoCategories] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [audios, setAudios] = useState([]);
  const [funContent, setFunContent] = useState([]);
  const [financialData, setFinancialData] = useState([]);
  const [bets, setBets] = useState([]);
  const navigate = useNavigate();

  const fetchArticles = async () => {
    try {
      const response = await fetch('https://kec-backend-1.onrender.com/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    }
  };
  const [loading, setLoading] = useState(true);
  const [articleModal, setArticleModal] = useState({ isOpen: false, article: null });
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, category: null });
  const [videoModal, setVideoModal] = useState({ isOpen: false, video: null });
  const [videoCategoryModal, setVideoCategoryModal] = useState({ isOpen: false, category: null });
  const [liveMatchModal, setLiveMatchModal] = useState({ isOpen: false, match: null });
  const [audioModal, setAudioModal] = useState({ isOpen: false, audio: null });
  const [funModal, setFunModal] = useState({ isOpen: false, funContent: null });
  const [betModal, setBetModal] = useState({ isOpen: false, bet: null });
  const [audioStreamEnabled, setAudioStreamEnabled] = useState(false);

  useEffect(() => {
    const enabled = localStorage.getItem('audioStreamEnabled') === 'true';
    setAudioStreamEnabled(enabled);
  }, []);

  const toggleAudioStream = () => {
    const newState = !audioStreamEnabled;
    setAudioStreamEnabled(newState);
    localStorage.setItem('audioStreamEnabled', newState.toString());
    toast.success(`Audio streaming ${newState ? 'enabled' : 'disabled'}!`);
  };

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === 'admin-authenticated') {
      setIsAuthenticated(true);
    } else {
      setShowLoginModal(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([
          fetchArticles(),
          fetchCategories(),
          fetchVideos(),
          fetchLiveMatches(),
          fetchAudios(),
          fetchFunContent(),
          fetchFinancialData(),
          fetchBets()
        ]);
        setLoading(false);
      };
      loadData();
    }
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://kec-backend-1.onrender.com/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch('https://kec-backend-1.onrender.com/api/videos');
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
    }
  };

  const fetchLiveMatches = async () => {
    try {
      const response = await fetch('https://kec-backend-1.onrender.com/api/live-matches');
      if (response.ok) {
        const data = await response.json();
        setLiveMatches(data || []);
      } else {
        setLiveMatches([]);
      }
    } catch (error) {
      console.error('Error fetching live matches:', error);
      setLiveMatches([]);
    }
  };

  const fetchAudios = async () => {
    try {
      const response = await fetch('https://kec-backend-1.onrender.com/api/audios');
      if (response.ok) {
        const data = await response.json();
        setAudios(data || []);
      } else {
        setAudios([]);
      }
    } catch (error) {
      console.error('Error fetching audios:', error);
      setAudios([]);
    }
  };

  const fetchFunContent = async () => {
    try {
      const response = await fetch('https://kec-backend-1.onrender.com/api/fun');
      if (response.ok) {
        const data = await response.json();
        setFunContent(data.funContent || []);
      } else {
        setFunContent([]);
      }
    } catch (error) {
      console.error('Error fetching fun content:', error);
      setFunContent([]);
    }
  };

  const fetchFinancialData = async () => {
    try {
      const response = await fetch('https://kec-backend-1.onrender.com/api/financial');
      if (response.ok) {
        const data = await response.json();
        setFinancialData(data.financialData || []);
      } else {
        setFinancialData([]);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setFinancialData([]);
    }
  };

  const fetchBets = async () => {
    try {
      const response = await fetch('https://kec-backend-1.onrender.com/api/bets');
      if (response.ok) {
        const data = await response.json();
        setBets(data.bets || []);
      } else {
        setBets([]);
      }
    } catch (error) {
      console.error('Error fetching bets:', error);
      setBets([]);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://kec-backend-1.onrender.com/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveArticle = async (articleData) => {
    try {
      await fetchArticles();
      toast.success(articleModal.article ? 'Article updated successfully!' : 'Article created successfully!');
      setArticleModal({ isOpen: false, article: null });
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Error saving article');
    }
  };

  const handleDeleteArticle = async (id) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setArticles(articles.filter(a => a.id !== id));
          toast.success('Article deleted successfully!');
        } else {
          toast.error('Failed to delete article');
        }
      } catch (error) {
        toast.error('Error deleting article');
      }
    }
  };

  const handleDeleteVideo = async (id) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        const response = await fetch(`https://kec-backend-1.onrender.com/api/videos/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setVideos(videos.filter(v => v.id !== id));
          toast.success('Video deleted successfully!');
        } else {
          toast.error('Failed to delete video');
        }
      } catch (error) {
        toast.error('Error deleting video');
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`https://kec-backend-1.onrender.com/api/categories/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setCategories(categories.filter(c => c.id !== id));
          toast.success('Category deleted successfully!');
        } else {
          toast.error('Failed to delete category');
        }
      } catch (error) {
        toast.error('Error deleting category');
      }
    }
  };

  const getFilteredArticles = (type) => {
    if (type === 'articles') return articles;
    if (type === 'categories') return [];
    if (type === 'videos') return videos;
    if (type === 'video-categories') return [];
    if (type.startsWith('video-')) {
      const categorySlug = type.replace('video-', '');
      return videos.filter(v => v.category?.slug === categorySlug);
    }
    return articles.filter(a => a.category?.slug === type);
  };

  const toggleArticleContentType = async (articleId, type) => {
    try {
      const typeMap = {
        'breaking': 'breaking',
        'trending': 'trending',
        'main-stories': 'mainStory',
        'video-stories': 'videoStory',
        'did-you-know': 'didYouKnow',
        'top-lists': 'topList'
      };
      
      const article = articles.find(a => a.id === articleId);
      const currentStatus = article[`is${typeMap[type].charAt(0).toUpperCase() + typeMap[type].slice(1)}`];
      
      const response = await fetch(`https://kec-backend-1.onrender.com/api/articles/${articleId}/content-type`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: typeMap[type], value: !currentStatus })
      });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error toggling content type:', error);
    }
  };

  const mainMenuItems = [
    { id: 'articles', label: 'Articles', icon: FileText, count: articles.length },
    { id: 'bets', label: 'Bets', icon: TrendingUp, count: 0 },
    { id: 'videos', label: 'Videos', icon: FileText, count: videos.length },
    { id: 'live-matches', label: 'Live Matches', icon: TrendingUp, count: liveMatches.length },
    { id: 'audios', label: 'Audio Player', icon: TrendingUp, count: audios.length },
    { id: 'fun', label: 'Fun Content', icon: FileText, count: 0 },
    { id: 'financial', label: 'Financial Data', icon: TrendingUp, count: 0 },
    { id: 'categories', label: 'Manage Categories', icon: TrendingUp, count: categories.length + videoCategories.length }
  ];

  const getSubMenuItems = () => {
    if (activeTab === 'articles') {
      return [
        { id: 'articles', label: 'All Articles', count: articles.length },
        ...categories.map(cat => ({
          id: cat.slug,
          label: cat.name,
          count: articles.filter(a => a.category?.slug === cat.slug).length
        }))
      ];
    }
    if (activeTab === 'videos') {
      return [
        { id: 'videos', label: 'All Videos', count: videos.length },
        ...videoCategories.map(cat => ({
          id: `video-${cat.slug}`,
          label: cat.name,
          count: videos.filter(v => v.category?.slug === cat.slug).length
        }))
      ];
    }
    if (activeTab === 'categories') {
      return [
        { id: 'article-categories', label: 'Article Categories', count: categories.length },
        { id: 'video-categories', label: 'Video Categories', count: videoCategories.length }
      ];
    }
    return [];
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#021b41' }}>
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => navigate('/')} 
          onSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#021b41' }}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#021b41' }}>
      <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white">Content Dashboard</h1>
            <p className="text-white/70">Manage your news content</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={toggleAudioStream}
              variant="outline"
              className={`border-white/20 text-white hover:bg-white/20 ${
                audioStreamEnabled ? 'bg-green-600/20' : 'bg-white/10'
              }`}
            >
              {audioStreamEnabled ? 'Disable' : 'Enable'} Audio Stream
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="mb-4 overflow-x-auto">
          <div className="flex flex-nowrap sm:flex-wrap gap-2 min-w-max sm:min-w-0">
            {mainMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setActiveSubTab(item.id);
                }}
                className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === item.id 
                    ? 'bg-white text-gray-900' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                <Badge variant={activeTab === item.id ? "default" : "secondary"}>{item.count}</Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Sub Navigation */}
        {getSubMenuItems().length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <div className="flex flex-nowrap sm:flex-wrap gap-2 min-w-max sm:min-w-0">
              {getSubMenuItems().map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeSubTab === item.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                  <Badge variant="outline" className="text-xs">{item.count}</Badge>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <Card className="bg-white/95 border-white/20">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                {getSubMenuItems().find(item => item.id === activeSubTab)?.label || mainMenuItems.find(item => item.id === activeTab)?.label}
              </h2>
              {activeSubTab === 'audios' ? (
                <Button 
                  onClick={() => setAudioModal({ isOpen: true, audio: null })}
                  className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  New Audio
                </Button>
              ) : activeSubTab === 'live-matches' ? (
                <Button 
                  onClick={() => setLiveMatchModal({ isOpen: true, match: null })}
                  className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  New Live Match
                </Button>
              ) : activeSubTab === 'article-categories' ? (
                <Button 
                  onClick={() => setCategoryModal({ isOpen: true, category: null })}
                  className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  New Category
                </Button>
              ) : activeSubTab === 'video-categories' ? (
                <Button 
                  onClick={() => setVideoCategoryModal({ isOpen: true, category: null })}
                  className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  New Video Category
                </Button>
              ) : activeSubTab === 'videos' || activeSubTab.startsWith('video-') ? (
                <Button 
                  onClick={() => setVideoModal({ isOpen: true, video: null })}
                  className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  New Video
                </Button>
              ) : activeSubTab === 'fun' ? (
                <Button 
                  onClick={() => setFunModal({ isOpen: true, funContent: null })}
                  className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  New Fun Content
                </Button>
              ) : (
                <Button 
                  onClick={() => setArticleModal({ isOpen: true, article: null })}
                  className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  New Article
                </Button>
              )}
            </div>

          

            {activeSubTab === 'audios' ? (
              <>
              <MusicPlayer
                playlist={audios}
                onUpload={async (files) => {
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const formData = new FormData();
                    formData.append('audioFile', file);
                    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
                    formData.append('type', 'music');
                    formData.append('isActive', 'false');
                    
                    try {
                      const response = await fetch('https://kec-backend-1.onrender.com/api/audios', {
                        method: 'POST',
                        body: formData
                      });
                      if (response.ok) {
                        const newAudio = await response.json();
                        setAudios([...audios, newAudio]);
                        toast.success(`${file.name} uploaded!`);
                      }
                    } catch (error) {
                      toast.error(`Failed to upload ${file.name}`);
                    }
                  }
                  fetchAudios();
                }}
                onSetActive={async (id) => {
                  try {
                    await fetch(`https://kec-backend-1.onrender.com/api/audios/${id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ isActive: true })
                    });
                    audios.forEach(async (a) => {
                      if (a.id !== id && a.isActive) {
                        await fetch(`https://kec-backend-1.onrender.com/api/audios/${a.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ isActive: false })
                        });
                      }
                    });
                    fetchAudios();
                    toast.success('Active audio updated!');
                  } catch (error) {
                    toast.error('Failed to set active audio');
                  }
                }}
              />
              <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">All Audio Files</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Artist</th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Duration</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {audios.map((audio) => (
                      <tr key={audio.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="font-medium text-gray-900">{audio.title}</div>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{audio.artist || '-'}</td>
                        <td className="py-3 pr-4">
                          <Badge variant="outline">{audio.type}</Badge>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{audio.duration || '-'}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={audio.isActive ? 'destructive' : 'secondary'}>
                            {audio.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 pr-0">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAudioModal({ isOpen: true, audio })}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={async () => {
                                if (confirm('Delete this audio?')) {
                                  try {
                                    const response = await fetch(`https://kec-backend-1.onrender.com/api/audios/${audio.id}`, { method: 'DELETE' });
                                    if (response.ok) {
                                      setAudios(audios.filter(a => a.id !== audio.id));
                                      toast.success('Audio deleted!');
                                    }
                                  } catch (error) {
                                    toast.error('Error deleting audio');
                                  }
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
              </>
            ) : activeSubTab === 'live-matches' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                      <th className="py-2 pr-4">Match</th>
                      <th className="py-2 pr-4">Score</th>
                      <th className="py-2 pr-4">Time</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {liveMatches.map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="font-medium text-gray-900">{match.team1} vs {match.team2}</div>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{match.score || '-'}</td>
                        <td className="py-3 pr-4 text-gray-600">{match.time || '-'}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={match.isActive ? 'destructive' : 'secondary'}>
                            {match.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 pr-0">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setLiveMatchModal({ isOpen: true, match })}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={async () => {
                                if (confirm('Delete this live match?')) {
                                  try {
                                    const response = await fetch(`https://kec-backend-1.onrender.com/api/live-matches/${match.id}`, { method: 'DELETE' });
                                    if (response.ok) {
                                      setLiveMatches(liveMatches.filter(m => m.id !== match.id));
                                      toast.success('Live match deleted!');
                                    }
                                  } catch (error) {
                                    toast.error('Error deleting live match');
                                  }
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : activeSubTab === 'article-categories' ? (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{articles.filter(a => a.category?.slug === category.slug).length} articles</Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCategoryModal({ isOpen: true, category })}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeSubTab === 'video-categories' ? (
              <div className="space-y-4">
                {videoCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{videos.filter(v => v.category?.slug === category.slug).length} videos</Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setVideoCategoryModal({ isOpen: true, category })}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeSubTab === 'videos' || activeSubTab.startsWith('video-') ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Category</th>
                      <th className="py-2 pr-4">Duration</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {getFilteredArticles(activeSubTab).map((video) => (
                      <tr key={video.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="font-medium text-gray-900">{video.title}</div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="font-medium text-gray-900">{video.category?.name}</div>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{video.duration}</td>
                        <td className="py-3 pr-4 text-gray-600">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-0">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setVideoModal({ isOpen: true, video })}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteVideo(video.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : activeSubTab === 'fun' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Likes</th>
                      <th className="py-2 pr-4">Author</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {funContent.map((fun) => (
                      <tr key={fun.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="font-medium text-gray-900">{fun.title}</div>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant="outline">{fun.type}</Badge>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{fun.likes}</td>
                        <td className="py-3 pr-4 text-gray-600">{fun.author}</td>
                        <td className="py-3 pr-4 text-gray-600">
                          {new Date(fun.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-0">
                          <div className="flex justify-end gap-2">
                            <Button variant="destructive" size="sm" onClick={async () => {
                              if (confirm('Delete this fun content?')) {
                                try {
                                  const response = await fetch(`https://kec-backend-1.onrender.com/api/fun/${fun.id}`, { method: 'DELETE' });
                                  if (response.ok) {
                                    setFunContent(funContent.filter(f => f.id !== fun.id));
                                    toast.success('Fun content deleted!');
                                  }
                                } catch (error) {
                                  toast.error('Error deleting fun content');
                                }
                              }
                            }}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : activeSubTab === 'financial' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Category</th>
                      <th className="py-2 pr-4">Trend</th>
                      <th className="py-2 pr-4">Views</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {financialData.map((financial) => (
                      <tr key={financial.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="font-medium text-gray-900">{financial.title}</div>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant="outline">{financial.category}</Badge>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant={financial.isPositive ? 'default' : 'destructive'}>
                            {financial.trend || 'N/A'}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{financial.views}</td>
                        <td className="py-3 pr-4 text-gray-600">
                          {new Date(financial.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-0">
                          <div className="flex justify-end gap-2">
                            <Button variant="destructive" size="sm" onClick={async () => {
                              if (confirm('Delete this financial data?')) {
                                try {
                                  const response = await fetch(`https://kec-backend-1.onrender.com/api/financial/${financial.id}`, { method: 'DELETE' });
                                  if (response.ok) {
                                    setFinancialData(financialData.filter(f => f.id !== financial.id));
                                    toast.success('Financial data deleted!');
                                  }
                                } catch (error) {
                                  toast.error('Error deleting financial data');
                                }
                              }
                            }}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Category</th>
                      <th className="py-2 pr-4">Views</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Tags</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {getFilteredArticles(activeSubTab).map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="font-medium text-gray-900">{article.title}</div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="font-medium text-gray-900">{article.category?.name}</div>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant="secondary">{article.views || 0} views</Badge>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4 text-gray-600">Published</td>
                        <td className="py-3 pr-4">
                          <div className="flex flex-wrap gap-1">
                            {article.isBreaking && <Badge variant="destructive">Breaking</Badge>}
                            {article.isFeatured && <Badge variant="default">Featured</Badge>}
                          </div>
                        </td>
                        <td className="py-3 pr-0">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setArticleModal({ isOpen: true, article })}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteArticle(article.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <ArticleModal
        isOpen={articleModal.isOpen}
        onClose={() => setArticleModal({ isOpen: false, article: null })}
        onSave={handleSaveArticle}
        article={articleModal.article}
      />
      
      <CategoryModal
        isOpen={categoryModal.isOpen}
        onClose={() => setCategoryModal({ isOpen: false, category: null })}
        onSave={async (categoryData) => {
          try {
            const response = await fetch('https://kec-backend-1.onrender.com/api/categories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: categoryData.name,
                slug: categoryData.slug,
                description: categoryData.description
              })
            });
            if (response.ok) {
              const newCategory = await response.json();
              setCategories([...categories, newCategory]);
              setCategoryModal({ isOpen: false, category: null });
              toast.success('Category created successfully!');
            } else {
              toast.error('Failed to create category');
            }
          } catch (error) {
            toast.error('Error creating category');
          }
        }}
        category={categoryModal.category}
      />
      
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ isOpen: false, video: null })}
        onSave={async (videoData) => {
          try {
            const response = await fetch('https://kec-backend-1.onrender.com/api/videos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: videoData.title,
                description: videoData.description,
                videoUrl: videoData.videoUrl,
                categoryId: videoData.categoryId,
                duration: videoData.duration
              })
            });
            if (response.ok) {
              const newVideo = await response.json();
              setVideos([...videos, newVideo]);
              setVideoModal({ isOpen: false, video: null });
              toast.success('Video created successfully!');
            } else {
              toast.error('Failed to create video');
            }
          } catch (error) {
            toast.error('Error creating video');
          }
        }}
        video={videoModal.video}
      />
      
      <VideoCategoryModal
        isOpen={videoCategoryModal.isOpen}
        onClose={() => setVideoCategoryModal({ isOpen: false, category: null })}
        onSave={(category) => {
          if (videoCategoryModal.category) {
            setVideoCategories(videoCategories.map(c => c.id === videoCategoryModal.category.id ? category : c));
          } else {
            setVideoCategories([...videoCategories, { ...category, id: Date.now() }]);
          }
          setVideoCategoryModal({ isOpen: false, category: null });
        }}
        category={videoCategoryModal.category}
      />
      
      <LiveMatchModal
        isOpen={liveMatchModal.isOpen}
        onClose={() => setLiveMatchModal({ isOpen: false, match: null })}
        match={liveMatchModal.match}
        onSave={async (matchData) => {
          try {
            if (liveMatchModal.match) {
              const response = await fetch(`https://kec-backend-1.onrender.com/api/live-matches/${liveMatchModal.match.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(matchData)
              });
              if (response.ok) {
                const updated = await response.json();
                setLiveMatches(liveMatches.map(m => m.id === updated.id ? updated : m));
                toast.success('Live match updated!');
              }
            } else {
              const response = await fetch('https://kec-backend-1.onrender.com/api/live-matches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(matchData)
              });
              if (response.ok) {
                const newMatch = await response.json();
                setLiveMatches([...liveMatches, newMatch]);
                toast.success('Live match created!');
              }
            }
            setLiveMatchModal({ isOpen: false, match: null });
          } catch (error) {
            toast.error('Error saving live match');
          }
        }}
      />
      
      <AudioModal
        isOpen={audioModal.isOpen}
        onClose={() => setAudioModal({ isOpen: false, audio: null })}
        audio={audioModal.audio}
        onSave={async (audioData) => {
          try {
            if (audioModal.audio) {
              const response = await fetch(`https://kec-backend-1.onrender.com/api/audios/${audioModal.audio.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(audioData)
              });
              if (response.ok) {
                const updated = await response.json();
                setAudios(audios.map(a => a.id === updated.id ? updated : a));
                toast.success('Audio updated!');
              }
            } else {
              const response = await fetch('https://kec-backend-1.onrender.com/api/audios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(audioData)
              });
              if (response.ok) {
                const newAudio = await response.json();
                setAudios([...audios, newAudio]);
                toast.success('Audio created!');
              }
            }
            setAudioModal({ isOpen: false, audio: null });
          } catch (error) {
            toast.error('Error saving audio');
          }
        }}
      />
      
      <FunModal
        isOpen={funModal.isOpen}
        onClose={() => setFunModal({ isOpen: false, funContent: null })}
        onSave={async (formData) => {
          try {
            const response = await fetch('https://kec-backend-1.onrender.com/api/fun', {
              method: 'POST',
              body: formData
            });
            if (response.ok) {
              fetchFunContent();
              toast.success('Fun content created successfully!');
            } else {
              toast.error('Failed to create fun content');
            }
          } catch (error) {
            toast.error('Error creating fun content');
          }
        }}
        funContent={funModal.funContent}
      />
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;