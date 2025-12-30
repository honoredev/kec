import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Upload, Shuffle, Repeat, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MusicPlayerProps {
  playlist: any[];
  onUpload: (files: FileList) => void;
  onSetActive: (id: number) => void;
}

const MusicPlayer = ({ playlist, onUpload, onSetActive }: MusicPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTrack = playlist[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(err => console.error('Autoplay error:', err));
    }
  }, [currentIndex]);

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const playNext = () => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentIndex(randomIndex);
    } else if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (repeat) {
      setCurrentIndex(0);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Music Player</h3>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-white/20 hover:bg-white/30"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Audio
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {playlist.length === 0 ? (
        <div className="text-center py-8 text-white/70">
          <p>No audio files yet. Upload some music to get started!</p>
        </div>
      ) : currentTrack ? (
        <>
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <h4 className="text-lg font-semibold">{currentTrack.title}</h4>
            {currentTrack.artist && <p className="text-sm text-white/70">{currentTrack.artist}</p>}
          </div>

          <audio
            ref={audioRef}
            src={currentTrack.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              if (repeat) {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play();
                }
              } else {
                playNext();
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/70 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex justify-center items-center space-x-4 mb-4">
            <Button
              onClick={playPrevious}
              disabled={currentIndex === 0}
              className="bg-white/20 hover:bg-white/30"
              size="sm"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              onClick={togglePlay}
              className="bg-white text-purple-900 hover:bg-white/90 w-12 h-12 rounded-full"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button
              onClick={playNext}
              disabled={currentIndex === playlist.length - 1}
              className="bg-white/20 hover:bg-white/30"
              size="sm"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShuffle(!shuffle)}
                className={`${shuffle ? 'bg-green-600' : 'bg-white/20'} hover:bg-white/30`}
                size="sm"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setRepeat(!repeat)}
                className={`${repeat ? 'bg-green-600' : 'bg-white/20'} hover:bg-white/30`}
                size="sm"
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24"
              />
              <Button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="bg-white/20 hover:bg-white/30"
                size="sm"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      ) : null}

      {showPlaylist && (
      <div className="mt-6 max-h-64 overflow-y-auto">
        <h4 className="text-sm font-semibold mb-2 flex justify-between items-center">
          <span>Playlist ({playlist.length})</span>
          <span className="text-xs text-white/70">Total: {playlist.reduce((acc, t) => acc + (t.duration ? parseInt(t.duration.split(':')[0]) * 60 + parseInt(t.duration.split(':')[1]) : 0), 0) / 60 | 0} min</span>
        </h4>
        {playlist.map((track, index) => (
          <div
            key={track.id}
            onClick={() => setCurrentIndex(index)}
            className={`p-2 rounded cursor-pointer mb-1 flex justify-between items-center ${
              index === currentIndex ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div>
              <div className="text-sm font-medium">{track.title}</div>
              {track.artist && <div className="text-xs text-white/70">{track.artist}</div>}
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onSetActive(track.id);
              }}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-xs"
            >
              Set Active
            </Button>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default MusicPlayer;
