// AudioPlayer.tsx - Asosiy audio player komponenti
import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  MoreVertical,
  Music,
  Mic,
  Clock,
} from 'lucide-react';

// ==================== TYPES ====================
export type AudioType = 'message' | 'music' | 'voice' | 'podcast';

export interface AudioPlayerProps {
  src: string;
  type?: AudioType;
  title?: string;
  artist?: string;
  duration?: number;
  size?: number;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  showDownload?: boolean;
  avatar?: string;
}

interface WaveformProps {
  bars: number[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

// ==================== WAVEFORM COMPONENT ====================
const Waveform: React.FC<WaveformProps> = ({ bars, currentTime, duration, onSeek }) => {
  const waveformRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onSeek(percentage * duration);
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div
      ref={waveformRef}
      className="flex items-center gap-[2px] h-8 cursor-pointer"
      onClick={handleClick}
    >
      {bars.map((height, i) => {
        const barProgress = i / bars.length;
        const isActive = barProgress <= progress;
        return (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all ${
              isActive ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
};

// ==================== VOICE MESSAGE PLAYER ====================
export const VoiceMessagePlayer: React.FC<AudioPlayerProps> = ({
  src,
  duration = 0,
  className = '',
  onPlay,
  onPause,
  onEnded,
  autoPlay = false,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [waveformBars] = useState(() =>
    Array.from({ length: 40 }, () => Math.random() * 60 + 40)
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setAudioDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    if (autoPlay) {
      audio.play();
      setIsPlaying(true);
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [autoPlay, onEnded]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      onPause?.();
    } else {
      audioRef.current.play();
      onPlay?.();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-2 bg-blue-100 rounded-2xl p-3 max-w-sm ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <button
        onClick={togglePlay}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
      >
        {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <Waveform
          bars={waveformBars}
          currentTime={currentTime}
          duration={audioDuration}
          onSeek={handleSeek}
        />
      </div>

      <span className="flex-shrink-0 text-xs text-gray-600 font-medium">
        {formatTime(isPlaying ? currentTime : audioDuration)}
      </span>
    </div>
  );
};

// ==================== MUSIC PLAYER ====================
export const MusicPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title = 'Unknown Track',
  artist = 'Unknown Artist',
  duration = 0,
  size,
  className = '',
  onPlay,
  onPause,
  showDownload = true,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setAudioDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      onPause?.();
    } else {
      audioRef.current.play();
      onPlay?.();
    }
    setIsPlaying(!isPlaying);
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

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = (bytes / (1024 * 1024)).toFixed(1);
    return `${mb} MB`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 max-w-sm ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Music className="text-white" size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
          <p className="text-sm text-gray-500 truncate">{artist}</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatTime(audioDuration)} {size && `• ${formatSize(size)}`}
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical size={18} className="text-gray-500" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg py-1 z-10 min-w-[120px]">
              {showDownload && (
                <a
                  href={src}
                  download
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  <Download size={16} />
                  Yuklash
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={audioDuration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer audio-slider"
        />
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
          
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
          >
            {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
          </button>
          
          <span className="text-xs text-gray-500">{formatTime(audioDuration)}</span>
        </div>
      </div>

      <style>{`
        .audio-slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .audio-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

// ==================== PODCAST PLAYER ====================
export const PodcastPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title = 'Podcast Episode',
  artist = 'Podcast Name',
  avatar,
  duration = 0,
  className = '',
  onPlay,
  onPause,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setAudioDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      onPause?.();
    } else {
      audioRef.current.play();
      onPlay?.();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 1.75, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = Math.floor(time % 60);
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 max-w-md ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="flex items-center gap-4 mb-6">
        {avatar ? (
          <img src={avatar} alt={title} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
            <Mic className="text-white" size={28} />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{title}</h3>
          <p className="text-sm text-gray-500 truncate">{artist}</p>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="range"
          min="0"
          max={audioDuration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer podcast-slider"
        />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(audioDuration)}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={changePlaybackRate}
            className="px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {playbackRate}x
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => skip(-15)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Clock size={20} className="text-gray-600 transform rotate-180" />
            </button>

            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors shadow-lg"
            >
              {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
            </button>

            <button
              onClick={() => skip(15)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Clock size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="p-2 hover:bg-gray-100 rounded-full">
              {isMuted ? <VolumeX size={18} className="text-gray-600" /> : <Volume2 size={18} className="text-gray-600" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer podcast-slider"
            />
          </div>
        </div>
      </div>

      <style>{`
        .podcast-slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .podcast-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

// ==================== SIMPLE AUDIO MESSAGE ====================
export const SimpleAudioMessage: React.FC<AudioPlayerProps> = ({
  src,
  duration = 0,
  className = '',
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2 ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" onEnded={() => setIsPlaying(false)} />
      
      <button
        onClick={togglePlay}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white"
      >
        {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" className="ml-0.5" />}
      </button>

      <div className="flex items-center gap-2">
        <Music size={16} className="text-gray-500" />
        <span className="text-sm text-gray-600">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default VoiceMessagePlayer;