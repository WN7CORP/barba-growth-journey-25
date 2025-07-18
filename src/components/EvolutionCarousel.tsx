
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Foto {
  id: string;
  dia: number;
  foto_url: string;
  observacoes?: string;
  created_at: string;
}

interface EvolutionCarouselProps {
  fotos: Foto[];
}

export const EvolutionCarousel = ({ fotos }: EvolutionCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (fotos.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Nenhuma foto ainda. Comece adicionando sua primeira foto!</p>
        </CardContent>
      </Card>
    );
  }

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % fotos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + fotos.length) % fotos.length);
  };

  const currentPhoto = fotos[currentIndex];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square md:aspect-video">
              <img
                src={currentPhoto.foto_url}
                alt={`Dia ${currentPhoto.dia}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="text-white">
                  <h3 className="font-bold text-lg">Dia {currentPhoto.dia}</h3>
                  {currentPhoto.observacoes && (
                    <p className="text-sm mt-1 opacity-90">{currentPhoto.observacoes}</p>
                  )}
                  <p className="text-xs mt-2 opacity-75">
                    {new Date(currentPhoto.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {fotos.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
              onClick={prevPhoto}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
              onClick={nextPhoto}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
          {fotos.map((foto, index) => (
            <button
              key={foto.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex ? 'border-blue-500 scale-105' : 'border-gray-200'
              }`}
            >
              <img
                src={foto.foto_url}
                alt={`Dia ${foto.dia}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
