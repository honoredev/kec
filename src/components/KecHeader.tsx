import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { X, Play, Pause, Volume2, Facebook, Twitter, Instagram, Youtube, Clock, Languages, Menu, User } from "lucide-react";
import LoginModal from "./LoginModal";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const KecHeader = () => {
  const [showLiveMatch, setShowLiveMatch] = useState(false);
  const [activeMatch, setActiveMatch] = useState(null);
  const [activeAudio, setActiveAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);
  const [language, setLanguage] = useState('en');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [audioStreamEnabled, setAudioStreamEnabled] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const translateRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const enabled = localStorage.getItem('audioStreamEnabled') === 'true';
    setAudioStreamEnabled(enabled);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchCategories();
    return () => clearInterval(timer);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://kec-backend-1.onrender.com/api/categories');
      const data = await response.json();
      setCategories(Array.isArray(data.categories) ? data.categories : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'Home') {
      navigate('/');
    } else {
      navigate(`/?category=${encodeURIComponent(categoryName)}`);
    }
    setIsMenuOpen(false);
  };

  const arrangeCategories = (cats: any[]) => {
    if (cats.length <= 9) return { firstRow: cats, secondRow: [] };
    
    const ahabanza = cats.find(cat => cat.name === 'Ahabanza');
    const others = cats.filter(cat => cat.name !== 'Ahabanza');
    
    const firstRow = ahabanza ? [ahabanza] : [];
    const secondRow = [];
    
    for (let i = 0; i < others.length; i++) {
      if (i % 2 === 0) {
        firstRow.push(others[i]);
      } else {
        secondRow.push(others[i]);
      }
    }
    
    return { firstRow, secondRow };
  };

  useEffect(() => {
    const loadGoogleTranslate = () => {
      if (!document.getElementById('google-translate-script')) {
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,rw,fr,sw',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element'
          );
          
          if (document.getElementById('google_translate_element_mobile')) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,rw,fr,sw',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              },
              'google_translate_element_mobile'
            );
          }
        };

        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
      }
    };

    loadGoogleTranslate();
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    
    setTimeout(() => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, 500);
  };

  useEffect(() => {
    const fetchActiveMatch = async () => {
      try {
        const response = await fetch('https://kec-backend-1.onrender.com/api/live-matches/active');
        if (response.ok) {
          const data = await response.json();
          setActiveMatch(data);
        }
      } catch (error) {
        console.error('Error fetching active match:', error);
      }
    };
    
    const fetchActiveAudio = async () => {
      try {
        const response = await fetch('https://kec-backend-1.onrender.com/api/audios/active');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setActiveAudio(data);
          }
        }
      } catch (error) {
        // Silently fail - backend may not be running
      }
    };
    
    fetchActiveMatch().catch(() => {});
    fetchActiveAudio().catch(() => {});
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  return (
    <header className="border-b-4 border-none relative" style={{ backgroundColor: '#021b41' }}>
      {/* Audio Player Banner */}
      {audioStreamEnabled && activeAudio && (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-sm">LIVE</span>
              </div>
              <span className="font-semibold">{activeAudio.title}</span>
              {activeAudio.artist && <span className="text-sm opacity-90">by {activeAudio.artist}</span>}
            </div>
            <button 
              onClick={togglePlay}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full flex items-center space-x-2 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="text-sm font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Hidden Audio Element */}
      {audioStreamEnabled && activeAudio && (
        <audio ref={audioRef} src={activeAudio.audioUrl} loop />
      )}
      
      {/* Live Match Banner */}
      {activeMatch && (
        <div className="bg-red-600 text-white py-2 animate-pulse">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="bg-white text-red-600 px-2 py-1 rounded text-xs font-bold">LIVE</span>
              <span className="font-semibold">{activeMatch.team1} vs {activeMatch.team2}</span>
              {activeMatch.score && <span className="text-sm">{activeMatch.score}</span>}
              {activeMatch.time && <span className="text-xs text-red-200">{activeMatch.time}</span>}
            </div>
            <button 
              onClick={() => setShowLiveMatch(true)}
              className="bg-white text-red-600 px-4 py-1 rounded-full text-sm font-bold hover:bg-red-50 transition-colors"
            >
              Watch Now
            </button>
          </div>
        </div>
      )}
      
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Desktop View */}
          <div className="hidden md:flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Facebook className="w-4 h-4 cursor-pointer hover:text-blue-400 transition-colors" />
                <Twitter className="w-4 h-4 cursor-pointer hover:text-blue-400 transition-colors" />
                <Instagram className="w-4 h-4 cursor-pointer hover:text-pink-400 transition-colors" />
                <Youtube className="w-4 h-4 cursor-pointer hover:text-red-400 transition-colors" />
              </div>

            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="hover:text-blue-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>
            </div>
          </div>
          
          {/* Mobile View */}
          <div className="md:hidden flex flex-col space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Facebook className="w-3 h-3 cursor-pointer" />
                <Twitter className="w-3 h-3 cursor-pointer" />
                <Instagram className="w-3 h-3 cursor-pointer" />
                <Youtube className="w-3 h-3 cursor-pointer" />
              </div>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-xs whitespace-nowrap"
              >
                Sign In
              </button>
            </div>

          </div>
        </div>
      </div>
      


      <div className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center space-x-3">
          <img 
            src="/ikaritamedia.png" 
            alt="Ikarita Media Logo" 
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
          />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
              Ikarita Media
            </h1>
            <p className="text-xs text-white/60 font-light" style={{ fontFamily: 'Arial, sans-serif' }}>
              Your Trusted News Source
            </p>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded transition-colors"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Navigation Bar */}
      <nav className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center py-3">
            <button 
              onClick={() => navigate('/')} 
              className="text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all px-4 py-2 mx-1 rounded"
            >
              Ahabanza
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all px-4 py-2 mx-1 rounded"
            >
              Amakuru
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all px-4 py-2 mx-1 rounded"
            >
              Videwo
            </button>
            <div className="relative group">
              <button className="text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all px-4 py-2 mx-1 rounded flex items-center">
                Izindi Inkuru <span className="ml-1">▼</span>
              </button>
              <div className="absolute top-full left-0 bg-[#021b41] border border-white/20 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-48 max-h-96 overflow-y-auto">
                {Array.isArray(categories) && categories.map((category) => (
                  <button 
                    key={category.id} 
                    onClick={() => handleCategoryClick(category.name)} 
                    className="block w-full text-left text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors px-4 py-2"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white/5 backdrop-blur-sm rounded-lg mx-2 my-3 p-4">
              <div className="space-y-2">
                <button 
                  onClick={() => { navigate('/'); setIsMenuOpen(false); }} 
                  className="w-full text-left text-sm font-medium text-white/90 hover:text-white transition-colors py-2 px-3 rounded hover:bg-white/10"
                >
                  Ahabanza
                </button>
                <button 
                  onClick={() => { navigate('/'); setIsMenuOpen(false); }} 
                  className="w-full text-left text-sm font-medium text-white/90 hover:text-white transition-colors py-2 px-3 rounded hover:bg-white/10"
                >
                  Amakuru
                </button>
                <button 
                  onClick={() => { navigate('/'); setIsMenuOpen(false); }} 
                  className="w-full text-left text-sm font-medium text-white/90 hover:text-white transition-colors py-2 px-3 rounded hover:bg-white/10"
                >
                  Videwo
                </button>
                <div className="border-t border-white/20 pt-2 mt-2">
                  <p className="text-xs text-white/60 px-3 py-1 font-semibold">Izindi Inkuru</p>
                  {Array.isArray(categories) && categories.map((category) => (
                    <button 
                      key={category.id} 
                      onClick={() => handleCategoryClick(category.name)} 
                      className="w-full text-left text-sm font-medium text-white/90 hover:text-white transition-colors py-2 px-3 rounded hover:bg-white/10"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Live Match Modal */}
      {showLiveMatch && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-[80vh] bg-black rounded-lg overflow-hidden">
            <button
              onClick={() => setShowLiveMatch(false)}
              className="absolute top-4 right-4 z-10 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src={activeMatch?.streamUrl || 'https://2live.sia-live.live/bein-1/'}
              className="w-full h-full"
              style={{ transform: 'scale(1.1)', transformOrigin: 'center top' }}
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              title="Live Match"
            />
          </div>
        </div>
      )}
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </header>
  );
};

export default KecHeader;

// Add CSS for marquee animation and hide Google Translate toolbar
const style = document.createElement('style');
style.textContent = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    animation: marquee 20s linear infinite;
  }
  .goog-te-banner-frame {
    display: none !important;
    visibility: hidden !important;
  }
  .goog-te-balloon-frame {
    display: none !important;
  }
  body {
    top: 0 !important;
    position: static !important;
  }
  body.translated-ltr {
    top: 0 !important;
  }
  .skiptranslate iframe {
    display: none !important;
  }
  #goog-gt-tt {
    display: none !important;
  }
  .goog-te-banner-frame.skiptranslate {
    display: none !important;
  }
  #google_translate_element {
    display: inline-block !important;
  }
  .goog-te-gadget {
    font-family: inherit !important;
    font-size: 12px !important;
    color: white !important;
  }
  .goog-te-gadget-simple {
    background-color: transparent !important;
    border: none !important;
    padding: 0 !important;
    border-radius: 0 !important;
    cursor: pointer !important;
    min-width: 100px !important;
    max-width: 140px !important;
    width: auto !important;
    display: inline-block !important;
    visibility: visible !important;
    opacity: 1 !important;
    font-size: 13px !important;
  }
  .translate-widget .goog-te-gadget-simple {
    background-color: transparent !important;
  }
  .translate-widget-mobile .goog-te-gadget-simple {
    background-color: transparent !important;
    width: 100% !important;
    text-align: center !important;
  }
  .goog-te-gadget-simple:hover {
    background-color: rgba(255,255,255,0.2) !important;
  }
  .goog-te-gadget-simple .goog-te-menu-value {
    color: white !important;
  }
  .goog-te-gadget-simple .goog-te-menu-value span {
    color: white !important;
  }
  .goog-te-gadget-simple .goog-te-menu-value {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  .goog-te-gadget-simple .goog-te-menu-value span:first-child {
    display: inline !important;
  }
  .goog-te-gadget-simple .goog-te-menu-value > span {
    color: white !important;
  }
  .goog-te-gadget-simple img {
    display: none !important;
  }
  .goog-te-gadget-icon {
    display: none !important;
  }
  .goog-te-menu2 {
    max-width: 100% !important;
  }
`;
document.head.appendChild(style);