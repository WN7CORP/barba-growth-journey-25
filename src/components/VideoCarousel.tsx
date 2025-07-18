
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useMinoxidilVideos } from '@/hooks/useMinoxidilVideos';

export const VideoCarousel = () => {
  const { data: videos, isLoading } = useMinoxidilVideos();

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-300 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {videos.slice(0, 6).map((video) => (
            <CarouselItem key={video.id} className="basis-full md:basis-1/2 lg:basis-1/3">
              <div className="p-2">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <VideoPlayer
                    videoUrl={video.video}
                    thumbnail={video.thumbnail}
                    title={video.titulo}
                  />
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs">
                        @TheDicas
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
                      {video.titulo}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      {video.data && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(video.data).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                      {video.duracao && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.duracao}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 md:left-4 hover:bg-red-50 hover:border-red-200 bg-white/90 backdrop-blur-sm" />
        <CarouselNext className="right-2 md:right-4 hover:bg-red-50 hover:border-red-200 bg-white/90 backdrop-blur-sm" />
      </Carousel>
    </div>
  );
};
