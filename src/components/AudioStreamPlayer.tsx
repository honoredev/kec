import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const AudioStreamPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [streamUrl, setStreamUrl] = useState('http://localhost:8000/stream');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchActiveAudio = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/audios/active');
        if (response.ok) {
          const data = await response.json();
          if (data && data.audioUrl) {
            setStreamUrl(data.audioUrl);
          }
        }
      } catch (error) {
        console.log('Using default stream URL');
      }
    };
    fetchActiveAudio();
  }, []);

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Force reload the stream to get live audio
        audioRef.current.src = `${streamUrl}?t=${Date.now()}`;
        audioRef.current.load();
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.error('Play error:', err);
          setIsPlaying(false);
        }
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div 
        className="w-full rounded-lg p-4 sm:p-6 shadow-lg border border-gray-200"
        style={{
          background: 'linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)'
        }}
      >
        {/* Logo/Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div 
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center border-2 sm:border-4"
            style={{ 
              backgroundColor: '#2C3E50',
              borderColor: '#2C3E50'
            }}
          >
            <div className="relative">
              {/* Microphone */}
              <div className="w-4 h-6 sm:w-5 sm:h-7 lg:w-6 lg:h-8 bg-white rounded-full mx-auto mb-1"></div>
              <div className="w-3 h-1.5 sm:w-3.5 sm:h-1.5 lg:w-4 lg:h-2 bg-white mx-auto"></div>
              
              {/* Sound waves */}
              <div className="absolute -left-5 sm:-left-6 lg:-left-8 top-1 sm:top-1.5 lg:top-2 flex gap-0.5 sm:gap-1">
                <div className="w-0.5 sm:w-1 h-2 sm:h-2.5 lg:h-3 bg-white rounded"></div>
                <div className="w-0.5 sm:w-1 h-3 sm:h-4 lg:h-5 bg-white rounded"></div>
                <div className="w-0.5 sm:w-1 h-2 sm:h-2.5 lg:h-3 bg-white rounded"></div>
              </div>
              <div className="absolute -right-5 sm:-right-6 lg:-right-8 top-1 sm:top-1.5 lg:top-2 flex gap-0.5 sm:gap-1">
                <div className="w-0.5 sm:w-1 h-2 sm:h-2.5 lg:h-3 bg-white rounded"></div>
                <div className="w-0.5 sm:w-1 h-3 sm:h-4 lg:h-5 bg-white rounded"></div>
                <div className="w-0.5 sm:w-1 h-2 sm:h-2.5 lg:h-3 bg-white rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-3 sm:mb-4"
          style={{ color: '#2C3E50' }}
        >
          EYE FM
        </h2>

        {/* Live Status */}
        <div className="flex justify-center items-center gap-2 mb-3 sm:mb-4">
          <div className="bg-red-600 px-3 sm:px-4 py-0.5 sm:py-1 rounded-md">
            <span className="text-white font-bold text-xs sm:text-sm">LIVE</span>
          </div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-pulse"></div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center items-center gap-4 sm:gap-6">
          <button
            onClick={togglePlay}
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
            style={{ backgroundColor: '#2C3E50' }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="white" />
            ) : (
              <Play className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white ml-0.5 sm:ml-1" fill="white" />
            )}
          </button>

          <button
            onClick={toggleMute}
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
            style={{ backgroundColor: '#2C3E50' }}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            )}
          </button>
        </div>

        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef}
          preload="none"
        />
      </div>
    </div>
  );
};

export default AudioStreamPlayer;
