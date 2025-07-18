
import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
}

export const VideoPlayer = ({ videoUrl, thumbnail, title }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Mudado para false - áudio ligado por padrão

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const openFullscreen = () => {
    window.open(videoUrl, '_blank');
  };

  // Extract YouTube video ID from various URL formats
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const youtubeId = getYouTubeVideoId(videoUrl);

  if (!isPlaying) {
    return (
      <div className="relative aspect-video overflow-hidden bg-black rounded-lg group cursor-pointer" onClick={handlePlay}>
        <img 
          src={thumbnail || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
          <div className="bg-red-600 rounded-full p-4 opacity-90 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-2xl">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden bg-black rounded-lg">
      {youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0`}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
          <p>Vídeo não disponível</p>
        </div>
      )}
      <div className="absolute bottom-2 right-2 flex space-x-2">
        <Button
          size="sm"
          variant="secondary"
          className="bg-black/70 hover:bg-black/90 text-white border-0"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-black/70 hover:bg-black/90 text-white border-0"
          onClick={openFullscreen}
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
