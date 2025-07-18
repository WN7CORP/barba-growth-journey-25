
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  productName: string;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  productName
}) => {
  const [imageIndex, setImageIndex] = useState(currentIndex);
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Update screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive dimensions
  const getModalDimensions = () => {
    const margin = 32;
    const headerHeight = 80;
    const controlsHeight = 80;
    
    const maxWidth = Math.min(screenSize.width - margin, 1200);
    const maxHeight = Math.min(screenSize.height - headerHeight - controlsHeight - margin, 700);
    
    return { maxWidth, maxHeight };
  };

  const { maxWidth, maxHeight } = getModalDimensions();

  const handlePrevious = useCallback(() => {
    setImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
  }, [images.length]);

  useEffect(() => {
    setImageIndex(currentIndex);
  }, [currentIndex]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="p-0 bg-white border-0 shadow-2xl"
        style={{ 
          width: `${maxWidth}px`, 
          maxWidth: `${maxWidth}px`,
          height: `${maxHeight + 160}px`,
          maxHeight: '95vh'
        }}
      >
        {/* Header compacto */}
        <DialogHeader className="p-3 border-b bg-white flex-shrink-0">
          <DialogTitle className="flex items-center justify-between text-sm">
            <div className="flex-1 min-w-0 pr-2">
              <span className="font-semibold truncate block text-sm">{productName}</span>
              <span className="text-xs text-gray-500 mt-1 block">
                Imagem {imageIndex + 1} de {images.length}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0 bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Container da imagem - Formato Grande */}
        <div 
          className="relative bg-gray-50 overflow-hidden flex items-center justify-center flex-1"
          style={{ 
            height: `${maxHeight}px`,
            maxHeight: `${maxHeight}px`
          }}
        >
          {/* Botões de navegação */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full w-10 h-10 p-0"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full w-10 h-10 p-0"
                onClick={handleNext}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Imagem principal em formato grande */}
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={images[imageIndex]}
              alt={`${productName} - ${imageIndex + 1}`}
              className="max-w-full max-h-full object-contain select-none rounded-lg shadow-lg"
              draggable={false}
            />
          </div>
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="p-3 bg-white border-t flex-shrink-0">
            <div className="flex gap-1 justify-center overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                    index === imageIndex 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  onClick={() => setImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${productName} - Mini ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
