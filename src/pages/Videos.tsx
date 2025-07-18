
import { useState, useEffect } from 'react';
import { Play, Calendar, Clock, Search, Filter, Grid, List } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useMinoxidilVideos } from '@/hooks/useMinoxidilVideos';
import Header from '@/components/Header';

const Videos = () => {
  const { data: videos, isLoading } = useMinoxidilVideos();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('videos-visited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('videos-visited', 'true');
    }
  }, []);

  const filteredVideos = videos?.filter(video =>
    video.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.data || 0).getTime() - new Date(a.data || 0).getTime();
      case 'oldest':
        return new Date(a.data || 0).getTime() - new Date(b.data || 0).getTime();
      case 'title':
        return a.titulo.localeCompare(b.titulo);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="grid gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-64 h-36 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        {showWelcome && (
          <div className="mb-8 bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-2xl shadow-xl animate-fade-in-scale">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Play className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Bem-vindo aos Vídeos!</h2>
              </div>
              <p className="text-lg mb-2">
                Estes vídeos são do canal <span className="font-bold">@TheDicas</span>
              </p>
              <p className="text-red-100">
                Aqui você verá evoluções reais de pessoas usando minoxidil para barba
              </p>
              <Button 
                variant="secondary" 
                onClick={() => setShowWelcome(false)}
                className="mt-4 bg-white text-red-600 hover:bg-gray-100"
              >
                Entendi, vamos começar!
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vídeos de Transformação
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Acompanhe evoluções reais do canal <span className="font-semibold text-red-600">@TheDicas</span>
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar vídeos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white/80">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                  <SelectItem value="oldest">Mais Antigos</SelectItem>
                  <SelectItem value="title">Por Título</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-md"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-md"
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Video List/Grid */}
        <div className="space-y-6">
          {sortedVideos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Nenhum vídeo encontrado' : 'Nenhum vídeo disponível'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Tente buscar por outros termos' : 'Novos vídeos serão adicionados em breve'}
              </p>
            </div>
          ) : (
            <>
              {viewMode === 'list' ? (
                <div className="space-y-6">
                  {sortedVideos.map((video) => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-80 flex-shrink-0">
                          <VideoPlayer
                            videoUrl={video.video}
                            thumbnail={video.thumbnail}
                            title={video.titulo}
                          />
                        </div>
                        <CardContent className="p-6 flex-1">
                          <div className="mb-4">
                            <Badge className="bg-red-600 hover:bg-red-700 text-white font-semibold mb-3">
                              @TheDicas
                            </Badge>
                            <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight">
                              {video.titulo}
                            </h3>
                            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                              {video.data && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(video.data).toLocaleDateString('pt-BR')}
                                </div>
                              )}
                              {video.duracao && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {video.duracao}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedVideos.map((video) => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
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
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Channel Info */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-2xl text-center shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Conheça o Canal @TheDicas</h3>
          <p className="text-red-100 max-w-2xl mx-auto leading-relaxed">
            Acompanhe transformações reais e dicas valiosas sobre o crescimento da barba. 
            Todos os vídeos mostram evoluções autênticas de pessoas usando minoxidil.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Videos;
