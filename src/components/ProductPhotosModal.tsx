
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Images, ShoppingCart, Play, X } from 'lucide-react';
import { ProductVideoModal } from '@/components/ProductVideoModal';

interface ProductPhotosModalProps {
  images: string[];
  productName: string;
  productPrice: string;
  productLink: string;
  videoUrl?: string;
}

export const ProductPhotosModal: React.FC<ProductPhotosModalProps> = ({
  images,
  productName,
  productPrice,
  productLink,
  videoUrl
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleBuyClick = () => {
    window.open(productLink, '_blank');
    setIsOpen(false);
  };

  const handleVideoClick = () => {
    setIsVideoOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 hover:text-purple-700 hover:border-purple-300 transition-all duration-300 hover:scale-105"
          >
            <Images className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Ver Fotos</span>
            <span className="sm:hidden">Fotos</span>
            <span className="ml-1">({images.length})</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-white">
          {/* Header fixo com botão de fechar */}
          <div className="bg-white border-b p-3 sm:p-4 sticky top-0 z-20 flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold line-clamp-2 text-gray-900">
                {productName}
              </h3>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-red-500 mt-1">
                {productPrice}
              </p>
            </div>
            
            {/* Botão de fechar prominente */}
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              size="sm"
              className="flex-shrink-0 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition-all duration-300"
            >
              <X className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Fechar</span>
            </Button>
          </div>

          {/* Botões de ação */}
          <div className="px-3 sm:px-4 py-2 bg-gray-50 border-b flex gap-2 flex-wrap">
            {videoUrl && (
              <Button 
                onClick={handleVideoClick}
                variant="outline"
                size="sm"
                className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 flex-1 sm:flex-none"
              >
                <Play className="w-4 h-4 mr-2" />
                Ver Vídeo
              </Button>
            )}
              <Button 
                onClick={handleBuyClick}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold transition-all duration-300 hover:scale-105 flex-1 sm:flex-none"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar
              </Button>
          </div>
          
          {/* Grid de imagens - sem funcionalidade de zoom */}
          <div className="p-3 sm:p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300" 
                >
                  <img 
                    src={image} 
                    alt={`${productName} - ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Indicador de número da imagem */}
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md opacity-90">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {videoUrl && (
        <ProductVideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoUrl={videoUrl}
          productName={productName}
          productPrice={productPrice}
          productLink={productLink}
        />
      )}
    </>
  );
};
